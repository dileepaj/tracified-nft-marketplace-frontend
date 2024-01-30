import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletComponent } from 'src/app/wallet/wallet.component';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import {
  HomeCard,
  Favourites,
  WatchList,
  NFTCard,
} from 'src/app/models/marketPlaceModel';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { UserWallet } from 'src/app/models/userwallet';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { interval, timer } from 'rxjs';
import { APIConfigENV } from 'src/environments/environment';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { NFT } from 'src/app/models/minting';
import { FirebaseAnalyticsService } from 'src/app/services/firebase/firebase-analytics.service';
import {
  Operation,
  Keypair,
  TransactionBuilder,
  Server,
  Asset,
  Networks,
  Memo,
} from 'stellar-sdk';
import { StellarCommonsService } from 'src/app/services/blockchain-services/stellar-services/stellar-commons.service';
import { blockchainNet } from 'src/app/shared/config';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  @ViewChild('sales', { static: false }) sales: ElementRef;
  @ViewChild('categories', { static: false }) categories: ElementRef;
  List: any[] = [];
  List2: any[] = [];
  Decryption: any;
  dec: string;
  nfts: any;
  imageSrc: any;
  favouritesModel: Favourites = new Favourites('', '', '');
  watchlistModel: WatchList = new WatchList('', '', '');
  backTopVisible: boolean = false;
  newitemflag: boolean = true;
  thumbnailSRC: any;
  net: Networks;
  paginationflag: boolean = false;
  bestPicksLoading: boolean = false;
  trendingLoading: boolean = false;

  bestPicksOverflowing: boolean = false;
  trendingOverflowing: boolean = false;

  bestPicksLeftScroll: boolean = false;
  trendingLeftScroll: boolean = false;

  bestPicksRightScroll: boolean = true;
  trendingRightScroll: boolean = true;

  private readonly tracifiedhelp = APIConfigENV.tracifiedhelpDocsbaseURL;
  readonly helpDocsMK: string = `${this.tracifiedhelp}docs/NFTPlatform/marketplace/introtoMarketplace`;
  constructor(
    private dialogref: MatDialog,
    private nft: NftServicesService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private api: ApiServicesService,
    private snackbarService: SnackbarServiceService,
    private dialogService: DialogService,
    private firebaseanalytics: FirebaseAnalyticsService,
    private network: StellarCommonsService
  ) {
    document.body.className = 'home-body';
  }

  ngOnDestroy() {
    document.body.className = '';
  }

  openDialog() {
    this.dialogref.open(WalletComponent, {
      autoFocus: false,
      panelClass: 'popUpDialog',
    });
  }

  routeToBuy(id: string) {
    let data: any = id;
    this.router.navigate(['./buyNft'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  viewall(status: string) {
    this.router.navigate(['/shownft'], {
      queryParams: { data: status },
    });
  }

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

  viewNFT() {}

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

  routeTo(filter: string) {
    if (filter == '/explore/collections') {
      this.router.navigate([filter]);
    } else if (filter == '/mint') {
      this.router.navigate([filter]);
    } else if (filter == '/explore/collections') {
      this.router.navigate([filter]);
    } else if (filter == '/blogs') {
      this.router.navigate([filter]);
    } else if (filter == '/docs') {
      const link = document.createElement('a');
      link.href = this.helpDocsMK;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } else {
      this.snackbarService.openSnackBar('Invalid page!', 'error');
    }
  }

  ngOnInit(): void {
    this.firebaseanalytics.logEvent('page_load', 'MK_devtest');
    this.List = [];
    this.List2 = [];

    this.getBestPicksNFTs();
    this.getTrendingNFTs();

    window.addEventListener('scroll', () => {
      this.backTopVisible = window.pageYOffset !== 0;
    });
  }

  private isScrollable(ele) {
    const hasScrollableContent =
      document.getElementById(ele)!.scrollWidth >
      document.getElementById(ele)!.clientWidth;

    return hasScrollableContent;
  }

  public goToTop() {
    window.scrollTo(0, 0);
  }

  public scrollLeft(elementId: string) {
    document.getElementById(elementId)!.scrollLeft -= 300;
  }

  public scrollRight(elementId: string) {
    document.getElementById(elementId)!.scrollLeft += 300;
  }

  public viewHotPicks() {
    this.router.navigate(['/shownft'], {
      queryParams: { data: 'hotpicks' },
    });
  }

  public viewTrending() {
    this.router.navigate(['/shownft'], {
      queryParams: { data: 'trending' },
    });
  }

  public getBestPicksNFTs() {
    this.bestPicksLoading = true;
    this.nft.getFilteredNFTs(0, 'hotpicks', 8).subscribe(
      (result: any) => {
        try {
          const curLength = this.List.length;
          const responseArrayLength = result.Response.content.length;
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
              card.Id = cont.Id;
              card.thumbnail = '';
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
              if (this.List.length === responseArrayLength) {
                this.bestPicksLoading = false;
                setTimeout(() => {
                  this.bestPicksOverflowing =
                    this.isScrollable('hot-picks-content');
                  this.listenToScroll('hot-picks-content');
                });
              }
            },
            (err) => {
              this.bestPicksLoading = false;
            }
          );
          let count = 0;
          for (let x = curLength; x < this.List.length; x++) {
            this.thumbnailSRC = '';

            this.nft
              .getThumbnailId(this.List[x].Id)
              .subscribe(async (thumbnail: any) => {
                if (thumbnail == '') {
                  this.thumbnailSRC = this.imageSrc;
                } else {
                  this.thumbnailSRC =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      thumbnail.Response.thumbnail
                    );
                }
                this.List[x].thumbnail = this.thumbnailSRC;

                count++;
              });
          }
        } catch (e) {
          this.bestPicksLoading = false;
        }
      },
      (err) => {
        this.bestPicksLoading = false;
      }
    );
  }

  public getTrendingNFTs() {
    this.trendingLoading = true;
    this.nft.getFilteredNFTs(0, 'trending', 8).subscribe(
      (result: any) => {
        try {
          const curLength = this.List2.length;
          const responseArrayLength = result.Response.content.length;
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
              card.Id = cont.Id;
              card.thumbnail = '';
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
              this.List2.push(card);
              if (this.List2.length === responseArrayLength) {
                this.trendingLoading = false;
                setTimeout(() => {
                  this.trendingOverflowing =
                    this.isScrollable('category-content');
                  this.listenToScroll('category-content');
                }, 1000);
              }
            },
            (err) => {
              this.bestPicksLoading = false;
            }
          );
          let count = 0;
          for (let x = curLength; x < this.List2.length; x++) {
            this.thumbnailSRC = '';

            this.nft
              .getThumbnailId(this.List2[x].Id)
              .subscribe(async (thumbnail: any) => {
                if (thumbnail == '') {
                  this.thumbnailSRC = this.imageSrc;
                } else {
                  this.thumbnailSRC =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      thumbnail.Response.thumbnail
                    );
                }
                this.List2[x].thumbnail = this.thumbnailSRC;

                count++;
              });
          }
        } catch (e) {
          this.trendingLoading = false;
        }
      },
      (err) => {
        this.trendingLoading = false;
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bestPicksOverflowing = this.isScrollable('hot-picks-content');
    this.trendingOverflowing = this.isScrollable('category-content');
  }

  public listenToScroll(el: any) {
    document.getElementById(el)!.addEventListener('scroll', (e: any) => {
      if (e.target.id === 'hot-picks-content') {
        if (e.target.scrollLeft == 0) {
          this.bestPicksLeftScroll = false;
          this.bestPicksRightScroll = true;
        } else if (
          Math.ceil(e.target.scrollLeft) >=
          e.target.scrollWidth - e.target.offsetWidth
        ) {
          this.bestPicksLeftScroll = true;
          this.bestPicksRightScroll = false;
        } else {
          this.bestPicksLeftScroll = true;
          this.bestPicksRightScroll = true;
        }
      }
      if (e.target.id === 'category-content') {
        if (e.target.scrollLeft == 0) {
          this.trendingLeftScroll = false;
          this.trendingRightScroll = true;
        } else if (
          Math.ceil(e.target.scrollLeft) >=
          e.target.scrollWidth - e.target.offsetWidth
        ) {
          this.trendingLeftScroll = true;
          this.trendingRightScroll = false;
        } else {
          this.trendingLeftScroll = true;
          this.trendingRightScroll = true;
        }
      }
    });
  }
}
