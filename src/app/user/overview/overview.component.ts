import { PubkeyvalidatorService } from 'src/app/services/common/pubkeyvalidator.service';
import albedo from '@albedo-link/intent';
import { P } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Connection, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';
import { Card, HomeCard, NFTCard } from 'src/app/models/marketPlaceModel';
import { UserWallet } from 'src/app/models/userwallet';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { WalletSidenavService } from 'src/app/services/wallet-sidenav.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { BlockchainConfig } from 'src/environments/environment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  selectedBlockchain: string = '';
  nfts: any;
  Trend: any[] = [];
  HotPick: any[] = [];
  Sale: any[] = [];
  Bought: any[] = [];
  Minted: any[] = [];
  ListSales: any[] = [];
  ListBought: any[] = [];
  ListMinted: any[] = [];
  ListTrends: any[] = [];
  ListHotpicks: any[] = [];
  Decryption: any;
  dec: any;
  imageSrc: any;
  User: string;
  thumbnailSRC: any;
  user: any;
  paginationflag: boolean = false;
  hotPicksLoading: boolean = false;
  mintedLoading: boolean = false;
  favLoading: boolean = false;
  boughtLoading: boolean = false;
  onSaleLoading: boolean = false;
  isToolTipVisible: boolean = false;
  connectedWallet: string = '';
  status: boolean = false;
  countA: number = 0;
  countB: number = 0;
  countC: number = 0;
  countD: number = 0;
  countE: number = 0;
  bccommingsoon: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nft: NftServicesService,
    private _sanitizer: DomSanitizer,
    private walletSideNav: WalletSidenavService,
    private service: ApiServicesService,
    private PubkeyvalidatorService: PubkeyvalidatorService
  ) {}

  ngOnInit(): void {
    if (
      Boolean(sessionStorage.getItem('refreshProfile')) &&
      parseInt(sessionStorage.getItem('refreshProfile')!) === 1
    ) {
      window.location.reload();
      sessionStorage.setItem('refreshProfile', '0');
    }
    this.route.queryParams.subscribe(async (params) => {
      this.selectedBlockchain = params['blockchain'];
      this.user = await this.PubkeyvalidatorService.GetActivePubKey(
        params['user'],
        this.selectedBlockchain
      );
      this.connectedWallet = '';
      //this.getConnectedWallet();
      // this.router.navigate(['/user-dashboard'], {
      //   queryParams: {  user:this.user,blockchain: this.selectedBlockchain },
      // });

      this.ListBought.splice(0);
      this.ListHotpicks.splice(0);
      this.ListMinted.splice(0);
      this.ListTrends.splice(0);
      this.ListSales.splice(0);
      this.getMintedNFTs();
      this.getBoughtNFTs();
      this.getFavouriteNFTs();
      this.getOnSaleNFTs();
      this.getHotpicksNFTs();
    });
  }

  private getMintedNFTs() {
    this.mintedLoading = true;
    this.nft
      .getNFTByBlockchainandUserPaginated(
        this.selectedBlockchain,
        this.user,
        'minted',
        8,
        0
      )
      .subscribe(
        (result: any) => {
          try {
            const curLength = this.ListMinted.length;
            const responseArrayLength = result.Response.content.length;
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
                '',
                false
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
              card.isfiat = cont.isfiat;
              this.ListMinted.push(card);
              if (this.ListMinted.length === responseArrayLength) {
                this.mintedLoading = false;
              }
            });

            let count = 0;
            for (let x = curLength; x < this.ListMinted.length; x++) {
              this.thumbnailSRC = '';

              this.nft
                .getThumbnailId(this.ListMinted[x].Id)
                .subscribe(async (thumbnail: any) => {
                  if (thumbnail == '') {
                    this.thumbnailSRC = this.imageSrc;
                  } else {
                    this.thumbnailSRC =
                      this._sanitizer.bypassSecurityTrustResourceUrl(
                        thumbnail.Response.thumbnail
                      );
                  }
                  this.ListMinted[x].thumbnail = this.thumbnailSRC;

                  count++;
                });
            }
          } catch (e) {
            this.mintedLoading = false;
          }
        },
        (err) => {
          this.mintedLoading = false;
        }
      );
  }

  private getHotpicksNFTs() {
    this.hotPicksLoading = true;
    this.service.getWatchListByUserId(this.user).subscribe(
      (res: any) => {
        if (!Boolean(res)) {
          this.hotPicksLoading = false;
          return;
        }
        for (let x = 0; x < res.length; x++) {
          this.service
            .getNFTIdAndBlockchain(res[x].nftidentifier, res[x].blockchain)
            .subscribe(
              (resx: any) => {
                try {
                  this.nft
                    .getThumbnailId(resx.Response.id)
                    .subscribe(async (thumbnail: any) => {
                      this.paginationflag = true;
                      if (thumbnail == '') {
                        this.thumbnailSRC = this.imageSrc;
                      } else {
                        this.thumbnailSRC =
                          this._sanitizer.bypassSecurityTrustResourceUrl(
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
                    '',
                    false
                  );
                  card.ImageBase64 = this.imageSrc;
                  // card.thumbnail= cont.thumbnail;
                  card.Blockchain = resx.Response.blockchain;
                  card.NFTIdentifier = resx.Response.nftidentifier;
                  card.NFTName = resx.Response.nftname;
                  card.Blockchain = resx.Response.blockchain;
                  card.CreatorUserId = resx.Response.creatoruserid;
                  card.SellingStatus = resx.Response.sellingstatus;
                  card.CurrentOwnerPK = resx.Response.currentownerpk;
                  card.CurrentPrice = resx.Response.currentprice;
                  card.isfiat = resx.Response.isfiat;
                  this.ListHotpicks.push(card);
                  // if (this.ListHotpicks.length === responseArrayLength) {
                  this.hotPicksLoading = false;
                  // }
                } catch (e) {
                  this.hotPicksLoading = false;
                }
              },
              (err) => {
                this.hotPicksLoading = false;
              }
            );
        }
      },
      (err) => {
        this.hotPicksLoading = false;
      }
    );

    //   }
    // );
  }
  private getBoughtNFTs() {
    this.boughtLoading = true;
    this.nft
      .getNFTByBlockchainandUserPaginated(
        this.selectedBlockchain,
        this.user,
        'bought',
        8,
        0
      )
      .subscribe(
        (result: any) => {
          try {
            const curLength = this.ListBought.length;
            const responseArrayLength = result.Response.content.length;
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
                '',
                false
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
              card.isfiat = cont.isfiat;
              this.ListBought.push(card);
              if (this.ListBought.length === responseArrayLength) {
                this.boughtLoading = false;
              }
            });

            let count = 0;
            for (let x = curLength; x < this.ListBought.length; x++) {
              this.thumbnailSRC = '';

              this.nft
                .getThumbnailId(this.ListBought[x].Id)
                .subscribe(async (thumbnail: any) => {
                  if (thumbnail == '') {
                    this.thumbnailSRC = this.imageSrc;
                  } else {
                    this.thumbnailSRC =
                      this._sanitizer.bypassSecurityTrustResourceUrl(
                        thumbnail.Response.thumbnail
                      );
                  }
                  this.ListBought[x].thumbnail = this.thumbnailSRC;

                  count++;
                });
            }
          } catch (e) {
            this.boughtLoading = false;
          }
        },
        (err) => {
          this.boughtLoading = false;
        }
      );
  }
  private getFavouriteNFTs() {
    this.favLoading = true;

    this.service.getFavouritesByUserId(this.user).subscribe(
      (res1: any) => {
        if (!Boolean(res1)) {
          this.favLoading = false;
          return;
        }
        for (let y = 0; y < res1.length; y++) {
          this.service
            .getNFTIdAndBlockchain(res1[y].nftidentifier, res1[y].blockchain)
            .subscribe(
              (resy: any) => {
                // try {

                this.nft
                  .getThumbnailId(resy.Response.id)
                  .subscribe(async (thumbnail: any) => {
                    this.paginationflag = true;
                    if (thumbnail == '') {
                      this.thumbnailSRC = this.imageSrc;
                    } else {
                      this.thumbnailSRC =
                        this._sanitizer.bypassSecurityTrustResourceUrl(
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
                  '',
                  false
                );
                card.ImageBase64 = this.imageSrc;
                // card.thumbnail= cont.thumbnail;
                card.Blockchain = resy.Response.blockchain;
                card.NFTIdentifier = resy.Response.nftidentifier;
                card.NFTName = resy.Response.nftname;
                card.Blockchain = resy.Response.blockchain;
                card.CreatorUserId = resy.Response.creatoruserid;
                card.SellingStatus = resy.Response.sellingstatus;
                card.CurrentOwnerPK = resy.Response.currentownerpk;
                card.CurrentPrice = resy.Response.currentprice;
                card.isfiat = resy.Response.isfiat;

                this.ListTrends.push(card);
                // if (this.ListTrends.length === responseArrayLength) {
                this.favLoading = false;
                // }

                // } catch (e) {
                //   this.favLoading = false;
                // }
              },
              (err) => {
                this.favLoading = false;
              }
            );
        }
      },
      (err) => {
        this.favLoading = false;
      }
    );
    // this.nft
    //   .getNFTByBlockchainandUserPaginated(
    //     this.selectedBlockchain,
    //     this.user,
    //     'favorite',
    //     8,
    //     0
    //   )
    //   .subscribe(
    //     (result: any) => {

    //   },
    //   (err) => {
    //     this.favLoading = false;
    //   }
    // );
  }
  private getOnSaleNFTs() {
    this.onSaleLoading = true;
    this.nft
      .getNFTByBlockchainandUserPaginated(
        this.selectedBlockchain,
        this.user,
        'onsale',
        8,
        0
      )
      .subscribe(
        (result: any) => {
          try {
            const curLength = this.ListSales.length;
            const responseArrayLength = result.Response.content.length;
            result.Response.content.forEach((cont) => {
              if (this.paginationflag == false) {
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
                card.isfiat = cont.isfiat;
                this.ListSales.push(card);
                if (this.ListSales.length === responseArrayLength) {
                  this.onSaleLoading = false;
                }
              }
            });

            let count = 0;
            for (let x = curLength; x < this.ListSales.length; x++) {
              this.thumbnailSRC = '';

              this.nft
                .getThumbnailId(this.ListSales[x].Id)
                .subscribe(async (thumbnail: any) => {
                  if (thumbnail == '') {
                    this.thumbnailSRC = this.imageSrc;
                  } else {
                    this.thumbnailSRC =
                      this._sanitizer.bypassSecurityTrustResourceUrl(
                        thumbnail.Response.thumbnail
                      );
                  }
                  this.ListSales[x].thumbnail = this.thumbnailSRC;

                  count++;
                });
            }
          } catch (e) {
            this.onSaleLoading = false;
          }
        },
        (err) => {
          this.onSaleLoading = false;
        }
      );
  }

  putToSaleafterMint(id: string) {
    let data: any[] = ['Minted', id, this.selectedBlockchain];
    this.router.navigate(['./sell'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  putToSaleafterBought(id: string) {
    let data: any[] = ['NOTFORSALE', id, this.selectedBlockchain];
    this.router.navigate(['./sell'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  routeToBuy(id: string) {
    let data: any[] = [id, this.selectedBlockchain];
    this.router.navigate(['./buyNft'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  myCollections(id) {
    this.router.navigate(['./mycollections'], {
      queryParams: { data: id },
    });
  }

  viewall(status: string) {
    this.router.navigate(['/gridnft'], {
      queryParams: { data: [status, this.selectedBlockchain] },
    });
  }

  public scrollLeft(elementId: string) {
    document.getElementById(elementId)!.scrollLeft -= 300;
  }

  public scrollRight(elementId: string) {
    document.getElementById(elementId)!.scrollLeft += 300;
  }

  public toggleToolTip() {
    this.isToolTipVisible = !this.isToolTipVisible;
  }

  public getConnectedWallet() {
    if (Boolean(this.user)) {
      if (
        this.selectedBlockchain === 'ethereum' ||
        this.selectedBlockchain === 'polygon'
      ) {
        const provider = new ethers.providers.Web3Provider(window.ethereum!);
        provider.listAccounts().then((data) => {
          if (data.length > 0) {
            this.connectedWallet = 'Metamask';
            this.bccommingsoon = '';
          } else {
            this.connectedWallet = '';
          }
        });
      } else if (this.selectedBlockchain === 'stellar') {
        this.bccommingsoon = '';
        if (this.checkIfMobileDevice()) {
          this.connectedWallet = 'Albedo';
        } else {
          (window as any).freighterApi.getPublicKey().then((data) => {
            if (Boolean(data)) {
              this.connectedWallet = 'Freighter';
            } else {
              this.connectedWallet = '';
            }
          });
        }
      } else if (this.selectedBlockchain === 'solana') {
        this.bccommingsoon = '';
        try {
          const connection = new Connection(BlockchainConfig.solananetworkURL);
          const pk = new PublicKey(this.user);
          connection.getAccountInfo(pk).then((data) => {
            this.connectedWallet = 'Phantom';
          });
        } catch (e) {
          this.connectedWallet = '';
        }
      }
    } else {
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

  public openWalletSideBar() {
    this.walletSideNav.setWallet(this.connectedWallet.toLowerCase());
    this.walletSideNav.open();
  }
}
