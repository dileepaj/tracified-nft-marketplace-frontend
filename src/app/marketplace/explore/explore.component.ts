import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Card,
  Favourites,
  HomeCard,
  NFTCard,
  WatchList,
} from 'src/app/models/marketPlaceModel';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { Location } from '@angular/common';
import { SVG } from 'src/app/models/minting';
import { DomSanitizer } from '@angular/platform-browser';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { interval, timer } from 'rxjs';
import { APIConfigENV } from 'src/environments/environment';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { CollectionService } from 'src/app/services/api-services/collection.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent implements OnInit, AfterViewInit {
  @ViewChildren('theLastItem', { read: ElementRef })
  theLastItem: QueryList<ElementRef>;

  @ViewChild('ddRef') ddRef: ElementRef<HTMLElement>;

  isOnDropdown: boolean = false;

  watchlist: any;
  favourites: any;
  uptodates: any;
  defaultResult: any;
  nfts: any;
  Decryption: any;
  loading: boolean = false;

  dec: string;
  svg: SVG = new SVG('', '', 'NA', '', '');

  imageSrc: any;
  saleNft: any;
  List: any[] = [];
  ListNew: any[] = [];
  All: any[] = [];
  Trend: any[] = [];
  HotPick: any[] = [];
  Sale: any[] = [];
  UpToDate: any[] = [];
  Creators: any[] = [];
  favouritesModel: Favourites = new Favourites('', '', '');
  watchlistModel: WatchList = new WatchList('', '', '');
  selectedFilter: string = 'all';
  selectedBlockchain: string = '';
  nftItems: any = [];
  observer: any;
  currentPage: number = 1;
  nextPageLoading: boolean = false;
  filterChanged: boolean = false;
  isNftItem: boolean = false;
  trends: any;
  hotpicks: any;
  sales: any;
  creators: any;
  thumbnailSRC: any;
  showNoNftError: boolean = false;
  paginationflag: boolean = false;
  svgflag: boolean = false;
  thumbnailflag: boolean = false;
  responseArrayLength: number = 0;
  isStellarFlag: boolean = false;
  isSolanaFlag: boolean = false;
  isAllFlag: boolean = false;
  collectionName: string;

  constructor(
    private api: ApiServicesService,
    private nft: NftServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _sanitizer: DomSanitizer,
    private snackbarService: SnackbarServiceService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private collectionService: CollectionService
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

  addToFavourites(id: string) {
    this.favouritesModel.Blockchain = this.selectedBlockchain;
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

  addToWatchList(id: string) {
    this.watchlistModel.Blockchain = this.selectedBlockchain;
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

  routeToBuy(id: string) {
    let data: any[] = [id, this.selectedBlockchain];
    this.router.navigate(['./buyNft'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  viewNFT() {}

  ngAfterViewInit() {
    this.theLastItem?.changes.subscribe((d) => {
      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }

  ngOnInit(): void {
    // window.location.reload();
    this.List.splice(0);
    /*  const loadingAnimation = this.dialogService.pendingDialog({
       message:"Loading NFTs.."
     }) */
    const timer$ = timer(0, APIConfigENV.homepageIntervalTimer);
    timer$.subscribe((data) => {
      this.Trend.splice(0);
      this.HotPick.splice(0);
      this.UpToDate.splice(0);
      this.Creators.splice(0);
      this.Sale.splice(0);
      this.nftItems.splice(0);
      this.List.splice(0);
      this.route.queryParams.subscribe((params) => {
        this.loading = true;
        this.collectionName = params['collection'];
        this.selectedBlockchain = params['blockchain'];
        this.selectedFilter = params['filter'];

        if (this.selectedBlockchain == 'stellar') {
          this.isStellarFlag = true;
        }
        if (this.selectedBlockchain == 'solana') {
          this.isSolanaFlag = true;
        }
        if (this.selectedBlockchain == 'all') {
          this.isAllFlag = true;
        }

        if (
          this.selectedFilter === 'onsale' ||
          this.selectedFilter === 'hotpicks' ||
          this.selectedFilter === 'trending' ||
          this.selectedFilter === 'bestcreators' ||
          this.selectedFilter === 'uptodate'
        ) {
          this.currentPage = 1;
          this.intersectionFilterObserver(this.selectedFilter);
          this.List.splice(0);
          this.Filters(this.selectedFilter);
        } else {
          this.currentPage = 1;
          this.List.splice(0);
          this.intersectionObserver(this.selectedFilter);
          this.getAllNFTsByCollection(this.selectedFilter);
        }
      });

      this.loaderService.isLoading.subscribe((data) => {
        if (!data && this.responseArrayLength === 0) {
          this.loading = false;
          this.showNoNftError = true;
        }
      });

      /* interval(APIConfigENV.APIStartDelay).subscribe(data=>{
        if(this.List.length === 0) {
          this.loading = false;
          this.showNoNftError = true;
        }
        else {
          this.showNoNftError = false;
        }

      }) */
    });
  }

  public filterAndShowCard(arr: any[], filter: string) {
    const curLength = this.List.length;
    for (let x = 0; x < arr.length; x++) {
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
        '',
        false
      );
      card.Id = arr[x].Id;
      card.thumbnail = '';
      card.NFTIdentifier = arr[x].nftidentifier;
      card.NFTName = arr[x].nftname;
      card.Blockchain = arr[x].blockchain;
      card.CreatorUserId = arr[x].creatoruserid;
      card.SellingStatus = arr[x].sellingstatus;
      card.CurrentOwnerPK = arr[x].currentownerpk;
      card.Hotpicks = arr[x].hotpicks;
      card.Trending = arr[x].trending;
      card.CurrentPrice = arr[x].currentprice;
      card.isfiat = arr[x].isfiat;
      if (
        this.selectedBlockchain === 'all' ||
        card.Blockchain == this.selectedBlockchain ||
        (this.selectedBlockchain === 'jpy' && card.isfiat)
      ) {
        this.List.push(card);
      }

      if (this.List.length === this.responseArrayLength) {
        this.nextPageLoading = false;
        this.loading = false;
      }
    }

    this.setThumbnails(curLength);
    //this.checkIfNftLoaded();
  }

  public setThumbnails(curLength: number) {
    let count = 0;
    for (let x = curLength; x < this.List.length; x++) {
      this.thumbnailSRC = '';
      //this.paginationflag = true;

      this.nft
        .getThumbnailId(this.List[x].Id)
        .subscribe(async (thumbnail: any) => {
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

  public setFilter(filter: string) {
    this.filterChanged = true;
    this.List.splice(0);
    this.nftItems.splice(0);
    this.Trend.splice(0);
    this.HotPick.splice(0);
    this.UpToDate.splice(0);
    this.Creators.splice(0);
    this.Sale.splice(0);
    this.closeFilterDropdown();
    this.router
      .navigate(['/explore/nfts'], {
        queryParams: {
          collection: this.collectionName,
          blockchain: this.selectedBlockchain,
          filter,
        },
      })
      .then((res) => {
        window.location.reload();
      });
  }

  public changeBlockchain(blockchain: string) {
    if (blockchain !== this.selectedBlockchain) {
      this.filterChanged = true;
      this.List.splice(0);
      this.nftItems.splice(0);
      this.Trend.splice(0);
      this.HotPick.splice(0);
      this.UpToDate.splice(0);
      this.Creators.splice(0);
      this.Sale.splice(0);
      this.router
        .navigate(['/explore/nfts'], {
          queryParams: {
            collection: this.collectionName,
            blockchain,
            filter: this.selectedFilter,
          },
        })
        .then((res) => {
          window.location.reload();
        });
    }
  }

  Filters(filter: string) {
    this.Trend.splice(0);
    this.HotPick.splice(0);
    this.UpToDate.splice(0);
    this.Creators.splice(0);
    this.Sale.splice(0);
    this.nftItems.splice(0);
    if (filter === 'onsale') {
      if (!this.loading) {
        this.nextPageLoading = true;
      } else {
        this.responseArrayLength = 0;
      }
      this.Sale.splice(0);
      this.nft
        .getNFTpaginatedOnSALE(
          this.selectedBlockchain,
          this.currentPage,
          'ON SALE'
        )
        .subscribe(async (data: any) => {
          if (data.Response.content != null) {
            this.sales = data;
            this.responseArrayLength += this.sales.Response.content.length;
            for (let a = 0; a < this.sales.Response.content.length; a++) {
              this.Sale.push(this.sales.Response.content[a]);
              if (this.List.length > 0 && this.currentPage == 1) {
                //window.location.reload();
              }
            }
            this.nftItems.splice(0);
            this.filterAndShowCard(this.Sale, filter);
          } else {
            window.location.reload();
          }
        });
    }

    if (filter === 'hotpicks') {
      this.HotPick.splice(0);
      if (!this.loading) {
        this.nextPageLoading = true;
      } else {
        this.responseArrayLength = 0;
      }
      this.collectionService
        .getFilteredNFTsByCollection(
          this.collectionName,
          this.selectedBlockchain,
          8,
          this.currentPage,
          1
        )
        .subscribe(async (data: any) => {
          if (data.Response.content != null) {
            this.hotpicks = data;
            this.responseArrayLength += this.hotpicks.Response.content.length;
            if (this.List.length > 0 && this.currentPage == 1) {
              //window.location.reload();
            }

            for (let a = 0; a < this.hotpicks.Response.content.length; a++) {
              this.HotPick.push(this.hotpicks.Response.content[a]);
            }
            this.nftItems.splice(0);
            this.filterAndShowCard(this.HotPick, filter);
          } else {
            window.location.reload();
          }
        });
    }

    if (filter == 'trending') {
      this.Trend.splice(0);
      if (!this.loading) {
        this.nextPageLoading = true;
      } else {
        this.responseArrayLength = 0;
      }
      this.collectionService
        .getFilteredNFTsByCollection(
          this.collectionName,
          this.selectedBlockchain,
          8,
          this.currentPage,
          2
        )
        .subscribe(async (data: any) => {
          if (data.Response.content != null) {
            this.trends = data;
            this.responseArrayLength += this.trends.Response.content.length;
            for (let a = 0; a < this.trends.Response.content.length; a++) {
              this.Trend.push(this.trends.Response.content[a]);
              if (this.List.length > 0 && this.currentPage == 1) {
                //window.location.reload();
              }
            }
            this.nftItems.splice(0);
            this.filterAndShowCard(this.Trend, filter);
          } else {
            window.location.reload();
          }
        });
    }

    if (filter === 'uptodate') {
      this.UpToDate.splice(0);
      if (!this.loading) {
        this.nextPageLoading = true;
      } else {
        this.responseArrayLength = 0;
      }
      this.nft
        .getNFTpaginated(this.selectedBlockchain, this.currentPage)
        .subscribe(async (data: any) => {
          if (data.Response.content != null) {
            this.uptodates = data;
            this.responseArrayLength += this.uptodates.Response.content.length;

            for (let a = 0; a < this.uptodates.Response.content.length; a++) {
              this.UpToDate.push(this.uptodates.Response.content[a]);
              if (this.List.length > 0 && this.currentPage == 1) {
                //window.location.reload();
              }
            }
            this.nftItems.splice(0);
            this.filterAndShowCard(this.UpToDate, filter);
          } else {
            window.location.reload();
          }
        });
    }

    if (filter === 'bestcreators') {
      this.Creators.splice(0);
      if (!this.loading) {
        this.nextPageLoading = true;
      } else {
        this.responseArrayLength = 0;
      }
      this.collectionService
        .getFilteredNFTsByCollection(
          this.collectionName,
          this.selectedBlockchain,
          8,
          this.currentPage,
          3
        )
        .subscribe(async (data: any) => {
          if (data.Response.content != null) {
            this.creators = data;
            this.Creators.splice(0);
            this.responseArrayLength += this.creators.Response.content.length;
            for (let a = 0; a < this.creators.Response.content.length; a++) {
              this.Creators.push(this.creators.Response.content[a]);
              if (this.List.length > 0 && this.currentPage == 1) {
                //window.location.reload();
              }
            }
            this.nftItems.splice(0);
            this.filterAndShowCard(this.Creators, filter);
          } else {
            window.location.reload();
          }
        });
    }
  }

  public getAllNFTs(filter) {
    this.nftItems.splice(0);
    if (!this.loading) {
      this.nextPageLoading = true;
    } else {
      this.responseArrayLength = 0;
    }
    this.nft
      .getNFTpaginated(this.selectedBlockchain, this.currentPage)
      .subscribe(async (data: any) => {
        if (data.Response.content == null) {
          window.location.reload();
        } else {
          this.nfts = data;
          this.nftItems.splice(0);
          this.responseArrayLength += this.nfts.Response.content.length;
          for (let a = 0; a < this.nfts.Response.content.length; a++) {
            if (
              this.nfts.Response.content[a].sellingstatus === 'Minted' ||
              this.nfts.Response.content[a].sellingstatus === 'ON SALE' ||
              this.nfts.Response.content[a].sellingstatus === 'NOTFORSALE'
            ) {
              this.nftItems.push(this.nfts.Response.content[a]);
            }
          }
          this.filterAndShowCard(this.nftItems, filter);
        }
      });
  }

  public getAllNFTsByCollection(filter) {
    this.nftItems.splice(0);
    if (!this.loading) {
      this.nextPageLoading = true;
    } else {
      this.responseArrayLength = 0;
    }
    this.collectionService
      .getAllNFTsByCollection(
        this.collectionName,
        this.selectedBlockchain,
        8,
        this.currentPage
      )
      .subscribe(async (data: any) => {
        if (data.Response.content == null) {
          window.location.reload();
        } else {
          this.nfts = data;
          this.nftItems.splice(0);
          this.responseArrayLength += this.nfts.Response.content.length;
          for (let a = 0; a < this.nfts.Response.content.length; a++) {
            this.nftItems.push(this.nfts.Response.content[a]);
          }
          this.filterAndShowCard(this.nftItems, filter);
        }
      });
  }

  intersectionObserver(filter: string) {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (
          this.nfts.Response.PaginationInfo.nextpage !== 0 &&
          this.paginationflag == false
        ) {
          this.currentPage++;
          this.getAllNFTsByCollection(filter);
        }
      }
    }, option);
  }

  intersectionFilterObserver(filter: string) {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (filter == 'onsale') {
          if (
            this.sales.Response.PaginationInfo.nextpage !== 0 &&
            this.paginationflag == false
          ) {
            this.currentPage++;
            this.Filters(filter);
          }
        } else if (filter == 'hotpicks') {
          if (
            this.hotpicks.Response.PaginationInfo.nextpage !== 0 &&
            this.paginationflag == false
          ) {
            this.currentPage++;
            this.Filters(filter);
          }
        } else if (filter == 'trending') {
          if (
            this.trends.Response.PaginationInfo.nextpage !== 0 &&
            this.paginationflag == false
          ) {
            this.currentPage++;
            this.Filters(filter);
          }
        } else if (filter == 'uptodate') {
          if (
            this.uptodates.Response.PaginationInfo.nextpage !== 0 &&
            this.paginationflag == false
          ) {
            this.currentPage++;
            this.Filters(filter);
          }
        } else if (filter == 'bestcreators') {
          if (
            this.creators.Response.PaginationInfo.nextpage !== 0 &&
            this.paginationflag == false
          ) {
            this.currentPage++;
            this.Filters(filter);
          }
        } else {
          this.snackbarService.openSnackBar('Invalid statement!', 'error');
        }
      }
    }, option);
  }

  public back() {
    this.router.navigate(['/explore/collections']);
  }

  public toggleView(element: any) {
    this.isNftItem = true;
    document.getElementById(element)?.classList.add('overlay-hide');
  }

  public closeFilterDropdown() {
    (
      document.querySelector('.filter-dropdown-content') as HTMLElement
    ).style.display = 'none';
  }

  public openFilterDropdown() {
    (
      document.querySelector('.filter-dropdown-content') as HTMLElement
    ).style.display = 'block';
  }

  public clickedOnDropdown() {
    this.isOnDropdown = true;
  }

  @HostListener('document:click')
  clickedOut() {
    if (!this.isOnDropdown) {
      this.closeFilterDropdown();
    }
    this.isOnDropdown = false;
  }
}
