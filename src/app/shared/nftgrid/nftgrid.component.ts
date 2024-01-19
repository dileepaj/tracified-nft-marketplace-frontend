import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Card,
  Favourites,
  NFTCard,
  WatchList,
} from 'src/app/models/marketPlaceModel';
import { SVG } from 'src/app/models/minting';
import { NFTMarket } from 'src/app/models/nft';
import { UserWallet } from 'src/app/models/userwallet';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { MintService } from 'src/app/services/blockchain-services/mint.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { Location } from '@angular/common';
import albedo from '@albedo-link/intent';
@Component({
  selector: 'app-nftgrid',
  templateUrl: './nftgrid.component.html',
  styleUrls: ['./nftgrid.component.css'],
})
export class NftgridComponent implements OnInit {
  @ViewChildren('theLastItem', { read: ElementRef })
  theLastItem: QueryList<ElementRef>;
  Decryption: any;
  NFTList: any;
  List: any[] = [];
  svg: SVG = new SVG('', '', 'NA', '', '');
  favouritesModel: Favourites = new Favourites('', '', '');
  watchlistModel: WatchList = new WatchList('', '', '');
  nft: NFTMarket = new NFTMarket(
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );
  imageSrc: any;
  dec: string;
  data: any;
  blockchain: any;
  status: string;
  User: string;
  nfts: any;
  loading: boolean = false;
  thumbnailSRC: any;
  paginationflag: boolean = false;
  observer: any;
  currentPage: number = 0;
  nextPage: number = 1;
  nextPageLoading: boolean = false;
  responseArrayLength: number = 0;
  title: string = '';

  constructor(
    private api: ApiServicesService,
    private service: NftServicesService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private snackbarService: SnackbarServiceService,
    private mint: MintService,
    private _location: Location
  ) {}

  async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      let details = navigator.userAgent;

      let regexp = /android|iphone|kindle|ipad/i;

      let isMobileDevice = await regexp.test(details);

      if (isMobileDevice) {
        await albedo
          .publicKey({
            require_existing: true,
          })
          .then((res: any) => {
            this.User = res.pubkey;
          });
      } else {
        let freighterWallet = new UserWallet();
        freighterWallet = new FreighterComponent(freighterWallet);
        await freighterWallet.initWallelt();
        this.User = await freighterWallet.getWalletaddress();
      }
    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.User = await phantomWallet.getWalletaddress();
    }

    if (blockchain == 'ethereum' || blockchain == 'polygon') {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.User = await metamaskwallet.getWalletaddress();
    }
  }

  addToWatchList(id: string) {
    this.watchlistModel.Blockchain = this.blockchain;
    this.watchlistModel.NFTIdentifier = id;
    this.retrive(this.watchlistModel.Blockchain).then((res) => {
      this.api.addToWatchList(this.watchlistModel).subscribe((res) => {
        this.snackbarService.openSnackBar('Added to watchlists', 'success');
        this.api
          .getWatchlistByBlockchainAndNFTIdentifier(
            this.watchlistModel.Blockchain,
            this.watchlistModel.NFTIdentifier
          )
          .subscribe((res) => {});
      });
    });
  }

  addToFavourites(id: string) {
    this.favouritesModel.Blockchain = this.blockchain;
    this.favouritesModel.NFTIdentifier = id;
    this.retrive(this.favouritesModel.Blockchain).then((res) => {
      this.api.addToFavourites(this.favouritesModel).subscribe((res) => {
        this.snackbarService.openSnackBar('Added to favourites', 'success');
        this.api
          .getFavouritesByBlockchainAndNFTIdentifier(
            this.favouritesModel.Blockchain,
            this.favouritesModel.NFTIdentifier
          )
          .subscribe((res) => {});
      });
    });
  }

  viewNFT() {}

  ngAfterViewInit() {
    this.theLastItem?.changes.subscribe((d) => {
      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }

  routeToBuy(id: string) {
    let data: any[] = [id, this.blockchain];
    this.router.navigate(['./buyNft'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  public back() {
    this._location.back();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = params['data'];
      this.status = this.data[0];
      this.blockchain = this.data[1];
      if (this.status === 'onsale') {
        this.title = 'On Sale';
      } else if (this.status === 'hotpicks') {
        this.title = 'Watchlist';
      } else if (this.status === 'bought') {
        this.title = 'Bought';
      } else if (this.status === 'favorite') {
        this.title = 'Favourites';
      } else if (this.status === 'minted') {
        this.title = 'Mints';
      }

      this.loading = true;
      this.retrive(this.blockchain).then((res) => {
        if (this.status == 'favorite' || this.status == 'hotpicks') {
          this.getPicks();
        } else {
          this.getFilteredNFTs();
          this.intersectionFilterObserver();
        }
      });
    });
  }

  private getPicks() {
    if (this.status == 'favorite') {
      this.api.getFavouritesByUserId(this.User).subscribe(
        (res1: any) => {
          if (res1 != null) {
            for (let y = 0; y < res1.length; y++) {
              this.api
                .getNFTIdAndBlockchain(
                  res1[y].nftidentifier,
                  res1[y].blockchain
                )
                .subscribe((resy: any) => {
                  this.Filter(resy.Response);
                });
            }
          } else {
            this.loading = false;
            this.nextPageLoading = false;
          }
        },
        (err) => {
          this.loading = false;
          this.nextPageLoading = false;
        }
      );
    } else if (this.status == 'hotpicks') {
      this.api.getWatchListByUserId(this.User).subscribe(
        (res: any) => {
          if (res != null) {
            for (let x = 0; x < res.length; x++) {
              this.api
                .getNFTIdAndBlockchain(res[x].nftidentifier, res[x].blockchain)
                .subscribe((resx: any) => {
                  this.Filter(resx.Response);
                });
            }
          } else {
            this.loading = false;
            this.nextPageLoading = false;
          }
        },
        (err) => {
          this.loading = false;
          this.nextPageLoading = false;
        }
      );
    }
  }

  private getFilteredNFTs() {
    if (!this.loading) {
      this.nextPageLoading = true;
    } else {
      this.responseArrayLength = 0;
    }
    if (
      this.status == 'minted' ||
      this.status == 'bought' ||
      this.status == 'onsale'
    ) {
      this.service
        .getNFTByBlockchainandUserPaginated(
          this.blockchain,
          this.User,
          this.data[0].toLowerCase(),
          8,
          this.currentPage
        )
        .subscribe(
          (result: any) => {
            try {
              const curLength = this.List.length
              this.nextPage = result.Response.PaginationInfo.nextpage;
              this.responseArrayLength += result.Response.content.length;
              result.Response.content.forEach((cont) => {
                let card: NFTCard = new NFTCard(
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  false,
                  false,
                  ''
                );
                card.Id = cont.Id;
                card.thumbnail = ''
                card.ImageBase64 = this.imageSrc;
                // card.thumbnail= cont.thumbnail;
                card.Blockchain = cont.blockchain;
                card.NFTIdentifier = cont.nftidentifier;
                card.NFTName = cont.nftname;
                card.Blockchain = cont.blockchain;
                card.CreatorUserId = cont.creatoruserid;
                card.SellingStatus = cont.sellingstatus;
                card.CurrentOwnerPK = cont.currentownerpk;
                card.CurrentPrice = cont.currentprice;
                this.List.push(card);
                if (this.List.length === this.responseArrayLength) {
                  this.loading = false;
                   this.nextPageLoading = false;

                }
                    
                
              });

              this.setThumbnails(curLength)

            } catch (e) {
              this.loading = false;
              this.nextPageLoading = false;

            }
          },
          (err) => {
            this.loading = false;
            this.nextPageLoading = false;

          }
        );
    }
  }

  public setThumbnails (curLength: number) {
    let count = 0;
    for (let x = curLength; x < this.List.length; x++) {
      this.thumbnailSRC = '';
      //this.paginationflag = true;
   
      this.service.getThumbnailId(this.List[x].Id).subscribe(async (thumbnail: any) => {
        //this.paginationflag = true;
        if (thumbnail == '') {
          this.thumbnailSRC = this.imageSrc;
        } else {
          this.thumbnailSRC = this._sanitizer.bypassSecurityTrustResourceUrl(
            thumbnail.Response.thumbnail
          );
        }
        this.List[x].thumbnail = this.thumbnailSRC;
        /* if (count >= 7) {
          this.paginationflag = false;
        } */
        count++;
      });

      
    }
  }

  Filter(response: any) {
      this.service
        .getThumbnailId(response.id)
        .subscribe(async (thumbnail: any) => {
          this.paginationflag = true;
          if (thumbnail == '') {
            this.thumbnailSRC = this.imageSrc;
          } else {
            this.thumbnailSRC = this._sanitizer.bypassSecurityTrustResourceUrl(
              thumbnail.Response.thumbnail
            );
          }
          card.thumbnail = this.thumbnailSRC;
          if (card.thumbnail != '') {
            this.paginationflag = false;
          }
        });
      let card: NFTCard = new NFTCard(
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        false,
        false,
        ''
      );
      card.ImageBase64 = this.imageSrc;
      // card.thumbnail=this.thumbnailSRC
      card.NFTIdentifier = response.nftidentifier;
      card.NFTName = response.nftname;
      card.Blockchain = response.blockchain;
      card.CreatorUserId = response.creatoruserid;
      card.CurrentOwnerPK = response.currentownerpk;
      card.SellingStatus = response.sellingstatus;
      card.CurrentPrice = response.currentprice;
      this.List.push(card);
      this.loading = false;
    
  }

  intersectionFilterObserver() {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.nextPage !== 0) {
          this.currentPage++;
          this.getFilteredNFTs();
        }
      }
    }, option);
  }
}
