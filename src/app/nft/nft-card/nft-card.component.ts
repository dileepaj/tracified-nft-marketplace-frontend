import albedo from '@albedo-link/intent';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { UserWallet } from 'src/app/models/userwallet';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { CreatorViewComponent } from '../creator-view/creator-view.component';

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.css'],
})
export class NftCardComponent implements OnInit {
  @Input() itemId: string;
  @Input() item: any;
  @Input() blockchain: string;
  @Input() creatoruserid: string;
  @Input() sellingstatus: string;
  @Input() currentownerpk: string;
  private isNftItem: boolean = false;
  favouritesModel: Favourites = new Favourites('', '', '');
  watchlistModel: WatchList = new WatchList('', '', '');
  user: string;
  command: any;
  tip: any;

  constructor(
    private router: Router,
    private snackbarService: SnackbarServiceService,
    private api: ApiServicesService,
    public dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    if (this.sellingstatus == 'Minted') {
      this.tip = 'PUT ON SALE';
    } else if (this.sellingstatus == 'ON SALE') {
      this.tip = 'BUY NFT';
    } else if (this.sellingstatus == 'NOTFORSALE') {
      this.tip = 'PUT ON SALE';
    } else {
      this.snackbarService.openSnackBar('Something went wrong!', 'error');
    }
  }

  public async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      if (this.checkIfMobileDevice()) {
        await albedo
          .publicKey({
            require_existing: true,
          })
          .then((res: any) => {
            if (res.pubkey) {
              this.user =
                this.watchlistModel.User =
                this.favouritesModel.User =
                  res.pubkey;
            } else {
              this.snackbarService.openSnackBar(
                'The NFTs are not on sale! Please make sure you have an albedo account or wait for NFT to be on sale',
                'error'
              );
            }
          });
      } else {
        let freighterWallet = new UserWallet();
        freighterWallet = new FreighterComponent(freighterWallet);
        // await freighterWallet.initWallelt();
        if (!freighterWallet) {
          this.snackbarService.openSnackBar(
            'The NFTs are not on sale! Please make sure you have an freighter account or wait for NFT to be on sale',
            'error'
          );
        } else {
          this.user =
            this.watchlistModel.User =
            this.favouritesModel.User =
              await freighterWallet.getWalletaddress();
        }
      }
    }

    if (blockchain == 'solana' || blockchain == 'jpy') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.user =
        this.watchlistModel.User =
        this.favouritesModel.User =
          await phantomWallet.getWalletaddress();
    }

    if (blockchain == 'ethereum' || blockchain == 'polygon') {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.user =
        this.watchlistModel.User =
        this.favouritesModel.User =
          await metamaskwallet.getWalletaddress();
    }
  }

  private checkIfMobileDevice(): boolean {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;

    let isMobileDevice = regexp.test(details);

    if (isMobileDevice) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @function toggleView - Toggle NFT item overlay.
   * @param element - element id
   */
  public toggleView(element: any): void {
    this.isNftItem = true;
    document.getElementById(element)?.classList.add('overlay-hide');
  }

  /**
   * @function addToFavourites - Add NFT to favorites.
   * @param id - NFT Identifier
   */
  public addToFavourites(id: string): void {
    this.retrive(this.blockchain);
    this.favouritesModel.Blockchain = this.blockchain;
    this.favouritesModel.NFTIdentifier = id;
    this.retrive(this.favouritesModel.Blockchain).then((res) => {
      this.api
        .getFavouritebyBlockchainandUserPK(
          this.favouritesModel.Blockchain,
          this.user,
          this.favouritesModel.NFTIdentifier
        )
        .subscribe((favouriteresponse: any) => {
          if (favouriteresponse.user == 'Add to favourite') {
            this.api.addToFavourites(this.favouritesModel).subscribe((res) => {
              this.snackbarService.openSnackBar(
                'Added to favourites',
                'success'
              );
              this.api
                .getFavouritesByBlockchainAndNFTIdentifier(
                  this.favouritesModel.Blockchain,
                  this.favouritesModel.NFTIdentifier
                )
                .subscribe((res) => {});
            });
          } else {
            this.api
              .removeuserfromFavourite(favouriteresponse.id)
              .subscribe((removerst) => {
                this.snackbarService.openSnackBar(
                  'Removed from favourites',
                  'success'
                );
              });
          }
        });
    });
  }

  /**
   * @function addToWatchList - Add NFT to watch list.
   * @param id - NFT Identifier
   */
  public addToWatchList(id: string): void {
    this.retrive(this.blockchain);
    this.watchlistModel.Blockchain = this.blockchain;
    this.watchlistModel.NFTIdentifier = id;
    this.retrive(this.watchlistModel.Blockchain).then((res) => {
      this.api
        .getWatchlistbyBlockchainandUserPK(
          this.watchlistModel.Blockchain,
          this.user,
          this.watchlistModel.NFTIdentifier
        )
        .subscribe((watchlistresponse: any) => {
          if (watchlistresponse.user == 'Add to watch') {
            this.api.addToWatchList(this.watchlistModel).subscribe((res) => {
              this.snackbarService.openSnackBar(
                'Added to watchlists',
                'success'
              );
              this.api
                .getWatchlistByBlockchainAndNFTIdentifier(
                  this.watchlistModel.Blockchain,
                  this.watchlistModel.NFTIdentifier
                )
                .subscribe((res) => {});
            });
          } else {
            this.dialogService
              .confirmDialog({
                title: 'Watchlist removal confirmation.',
                message: 'Do you want to remove this NFT from your watchlist?',
                confirmText: 'Yes',
                cancelText: 'No',
              })
              .subscribe((respoonse) => {
                if (respoonse) {
                  this.api
                    .removeuserfromWatchList(watchlistresponse.id)
                    .subscribe((delresponse) => {
                      this.snackbarService.openSnackBar(
                        'Removed from Watchlist',
                        'success'
                      );
                    });
                }
              });
          }
        });
      return;
    });
  }

  //TO:DO
  viewNFT() {
    this.api.getEndorsement(this.creatoruserid).subscribe((res: any) => {
      const dialogRef = this.dialog.open(CreatorViewComponent, {
        data: {
          Name: res.Name,
          Email: res.Email,
          Contact: res.Contact,
        },
      });
    });
  }

  /**
   * @function routeToBuy - Navigate to buy view.
   * @param id - NFT Identifier
   */
  public routeToBuy(id: string): void {
    if (this.sellingstatus == 'Minted') {
      this.retrive(this.blockchain).then((res) => {
        console.log(this.currentownerpk);
        if (this.user == this.currentownerpk) {
          this.command = false;
          let data: any[] = ['Minted', id, this.blockchain];
          this.router.navigate(['./sell'], {
            queryParams: { data: JSON.stringify(data) },
          });
        } else {
          this.snackbarService.openSnackBar(
            'NFT is yet to be put on sale',
            'info'
          );
          this.command = true;
        }
      });
    } else if (this.sellingstatus == 'ON SALE') {
      this.command = false;
      let data: any[] = [id, this.blockchain];
      this.router.navigate(['./buyNft'], {
        queryParams: { data: JSON.stringify(data) },
      });
    } else if (this.sellingstatus == 'NOTFORSALE') {
      this.retrive(this.blockchain).then((res) => {
        if (this.user == this.currentownerpk) {
          this.command = false;
          let data: any[] = ['NOTFORSALE', id, this.blockchain];
          this.router.navigate(['./sell'], {
            queryParams: { data: JSON.stringify(data) },
          });
        } else {
          this.snackbarService.openSnackBar(
            'NFT is yet to be put on sale',
            'info'
          );
          this.command = true;
        }
      });
    } else {
      this.snackbarService.openSnackBar('Invalid Command!', 'error');
      this.command = true;
    }
  }

  @HostListener('document:click')
  clickedOut() {
    if (this.isNftItem) {
      this.isNftItem = false;
    } else {
      document
        .getElementById('overlay' + this.itemId)
        ?.classList.remove('overlay-hide');
    }
  }

  public openPreview() {
    this.dialogService.openNftPreview({ image: this.item.ImageBase64 });
  }

  public getButtonText(): string {
    let text = 'Buy Now';
    if (this.router.url.includes('user-dashboard')) {
      if (
        this.sellingstatus === 'Minted' ||
        this.sellingstatus === 'NOTFORSALE'
      ) {
        text = 'Sell Now';
      }
    }
    return text;
  }
}
