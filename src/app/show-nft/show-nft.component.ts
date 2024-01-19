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
  HomeCard,
  NFTCard,
  WatchList,
} from '../models/marketPlaceModel';
import { SVG, Track } from '../models/minting';
import { NFTMarket } from '../models/nft';
import { UserWallet } from '../models/userwallet';
import { ApiServicesService } from '../services/api-services/api-services.service';
import { NftServicesService } from '../services/api-services/nft-services/nft-services.service';
import { MintService } from '../services/blockchain-services/mint.service';
import { SnackbarServiceService } from '../services/snackbar-service/snackbar-service.service';
import { FreighterComponent } from '../wallet/freighter/freighter.component';
import { MetamaskComponent } from '../wallet/metamask/metamask.component';
import { PhantomComponent } from '../wallet/phantom/phantom.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-show-nft',
  templateUrl: './show-nft.component.html',
  styleUrls: ['./show-nft.component.css'],
})
export class ShowNFTComponent implements OnInit {
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
  selectedBlockchain: string;
  nfts: any;
  loading: boolean = false;
  thumbnailSRC: any;
  observer: any;
  currentPage: number = 0;
  nextPage: number = 1;
  nextPageLoading: boolean = false;
  paginationflag: boolean = false;
  responseArrayLength: number = 0;

  constructor(
    private api: ApiServicesService,
    private service: NftServicesService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private snackbarService: SnackbarServiceService,
    private mint: MintService,
    private _location: Location,
    private snackbar: SnackbarServiceService
  ) {}

  async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      this.favouritesModel.User = await freighterWallet.getWalletaddress();
    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.favouritesModel.User = await phantomWallet.getWalletaddress();
    }

    if (blockchain == 'ethereum' || blockchain == 'polygon') {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.favouritesModel.User = await metamaskwallet.getWalletaddress();
    }
  }

  addToWatchList(id: string, blockchain: string) {
    this.watchlistModel.Blockchain = blockchain;
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

  addToFavourites(id: string, blockchain: string) {
    this.favouritesModel.Blockchain = blockchain;
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

  routeToBuy(id: string, blockchain: string) {
    let data: any[] = [id, blockchain];
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
    });
    if (this.data != null) {
      this.loading = true;
      if (this.data == 'Favourites') {
        this.service.getNFTOnSale('ON SALE').subscribe((result: any) => {
          const curLength = this.List.length;
          this.nfts = result.Response;
          for (let x = 0; x < this.nfts.length; x++) {
            if (this.nfts[x].trending == true) {
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
                  card.Id = this.nfts[x].Id
                  card.thumbnail = ''
                  card.ImageBase64 = this.imageSrc;
                  // card.thumbnail=this.thumbnailSRC
                  card.NFTIdentifier = this.nfts[x].nftidentifier;
                  card.NFTName = this.nfts[x].nftname;
                  card.Blockchain = this.nfts[x].blockchain;
                  card.CreatorUserId = this.nfts[x].creatoruserid;
                  card.CurrentOwnerPK = this.nfts[x].currentownerpk;
                  card.SellingStatus = this.nfts[x].sellingstatus;
                  card.CurrentPrice = this.nfts[x].currentprice;
                  this.List.push(card);
                  this.loading = false;
                
            }
          }

          this.setThumbnails(curLength)
        });
      } else if (this.data == 'hotpicks') {
        this.getFilteredNFTs('hotpicks');
        this.intersectionFilterObserver('hotpicks');
      } else if (this.data == 'trending') {
        this.getFilteredNFTs('trending');
        this.intersectionFilterObserver('trending');
      } else if (
        this.data != 'Favourites' &&
        this.data != 'hotpicks' &&
        this.data != 'trending'
      ) {
        this.currentPage = 1;
        this.getNFTbyTag(this.data);
        this.intersectionFilterObserver(this.data);
      }
    } else {
      this.snackbarService.openSnackBar(
        'User PK not connected or not endorsed',
        'info'
      );
    }
  }

  ngAfterViewInit() {
    this.theLastItem?.changes.subscribe((d) => {
      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }

  public getFilteredNFTs(filter: string) {
    if (!this.loading) {
      this.nextPageLoading = true;
    } else {
      this.responseArrayLength = 0;
    }

    this.service
      .getFilteredNFTs('stellar', this.currentPage, filter, 12)
      .subscribe((result: any) => {
        try {
          const curLength = this.List.length
          this.nextPage = result.Response.PaginationInfo.nextpage;
          this.responseArrayLength += result.Response.content.length;
          result.Response.content.forEach(
            (cont) => {
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
                    card.Id = cont.Id
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
                      this.nextPageLoading = false;
                      this.loading = false;
                    }
                  
              
            },
            (err) => {
              this.loading = false;
              this.nextPageLoading = false;
            }
          );
          this.setThumbnails(curLength)
        } catch (e) {
          this.loading = false;
          this.nextPageLoading = false;
        }
      });
  }

  private getNFTbyTag(tag: string) {
    if (!this.loading) {
      this.nextPageLoading = true;
    } else {
      this.responseArrayLength = 0;
    }
    try {
      this.mint.getNFTByTag(tag, 8, this.currentPage).subscribe(
        (res: any) => {
          const curLength = this.List.length
          this.nextPage = res.Response.PaginationInfo.nextpage;
          this.NFTList = res;
          if (this.NFTList.Response == null) {
            this.loading = false;
            this.nextPageLoading = false;
          }

          this.responseArrayLength += this.NFTList.Response.content.length;
          for (let x = 0; x < this.NFTList.Response.content.length; x++) {
            if (
              this.NFTList.Response.content[x].sellingstatus == 'ON SALE' 
            ) {
              
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
                  card.Id = this.NFTList.Response.content[x].Id
                  card.thumbnail = ''
                  card.ImageBase64 = this.imageSrc;
                  // card.thumbnail=this.thumbnailSRC
                  card.NFTIdentifier =
                    this.NFTList.Response.content[x].nftidentifier;
                  card.NFTName = this.NFTList.Response.content[x].nftname;
                  card.Blockchain = this.NFTList.Response.content[x].blockchain;
                  card.CreatorUserId =
                    this.NFTList.Response.content[x].creatoruserid;
                  card.CurrentOwnerPK =
                    this.NFTList.Response.content[x].currentownerpk;
                  card.SellingStatus =
                    this.NFTList.Response.content[x].sellingstatus;
                  card.CurrentPrice =
                    this.NFTList.Response.content[x].currentprice;
                  this.List.push(card);
                  if (this.List.length === this.responseArrayLength) {
                    this.nextPageLoading = false;
                    this.loading = false;
                  }
                
            } else {
              this.loading = false;
              this.nextPageLoading = false;
            }
          }
          this.setThumbnails(curLength)
          
        },
        (err) => {
          this.loading = false;
          this.nextPageLoading = false;
        }
      );
    } catch (e) {
      this.loading = false;
      this.nextPageLoading = false;
    }
  }

  intersectionFilterObserver(filter: string) {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (filter == 'hotpicks') {
          if (this.nextPage !== 0) {
            this.currentPage++;
            this.getFilteredNFTs(filter);
          }
        } else if (filter == 'trending') {
          if (this.nextPage !== 0) {
            this.currentPage++;
            this.getFilteredNFTs(filter);
          }
        } else if (filter != 'Favourites') {
          if (this.nextPage !== 0) {
            this.currentPage++;
            this.getNFTbyTag(filter);
          }
        }
      }
    }, option);
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
}
