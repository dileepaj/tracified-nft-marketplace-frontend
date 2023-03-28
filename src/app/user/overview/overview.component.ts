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
import { BlockchainConfig } from 'src/environments/environment.qa';

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
  bccommingsoon:string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nft: NftServicesService,
    private _sanitizer: DomSanitizer,
    private walletSideNav: WalletSidenavService,
    private service:ApiServicesService
  ) {}

  ngOnInit(): void {
    if (
      Boolean(sessionStorage.getItem('refreshProfile')) &&
      parseInt(sessionStorage.getItem('refreshProfile')!) === 1
    ) {
      window.location.reload();
      sessionStorage.setItem('refreshProfile', '0');
    }
    this.route.queryParams.subscribe((params) => {
      this.selectedBlockchain = params['blockchain'];
      this.user = params['user'];
      this.connectedWallet = '';
      this.getConnectedWallet(); 
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
            const responseArrayLength = result.Response.content.length;
            result.Response.content.forEach((cont) => {
              if (this.paginationflag == false) {
                this.nft
                  .getSVGByHash(cont.imagebase64)
                  .subscribe((res: any) => {
                    this.Decryption = res.Response.Base64ImageSVG;
                    if (
                      cont.attachmenttype == 'image/jpeg' ||
                      cont.attachmenttype == 'image/jpg' ||
                      cont.attachmenttype == 'image/png'
                    ) {
                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(
                          this.Decryption.toString()
                        );
                    } else {
                      this.dec = btoa(this.Decryption);
                      var str2 = this.dec.toString();
                      var str1 = new String('data:image/svg+xml;base64,');
                      var src = str1.concat(str2.toString());

                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(src);
                      // if(cont.thumbnail == "") {
                      //   cont.thumbnail = this.imageSrc;
                      // }
                    }

                    this.nft
                      .getThumbnailId(cont.Id)
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
                      false,
                      false
                    );
                    card.ImageBase64 = this.imageSrc;
                    // card.thumbnail= cont.thumbnail;
                    card.Blockchain = cont.blockchain;
                    card.NFTIdentifier = cont.nftidentifier;
                    card.NFTName = cont.nftname;
                    card.Blockchain = cont.blockchain;
                    card.CreatorUserId = cont.creatoruserid;
                    card.SellingStatus = cont.sellingstatus;
                    card.CurrentOwnerPK = cont.currentownerpk;
                    this.ListMinted.push(card);
                    if (this.ListMinted.length === responseArrayLength) {
                      this.mintedLoading = false;
                    }
                  });
              }
            });
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
    this.service.getWatchListByUserId(this.user).subscribe((res:any)=>{
      for(let x=0;x<res.length;x++){
         this.service.getNFTIdAndBlockchain(res[x].nftidentifier,res[x].blockchain).subscribe((resx:any)=>{
          try {
                this.nft
                  .getSVGByHash(resx.Response.imagebase64)
                  .subscribe((res: any) => {
                    this.Decryption = res.Response.Base64ImageSVG;
                    if (
                      resx.Response.attachmenttype == 'image/jpeg' ||
                      resx.Response.attachmenttype == 'image/jpg' ||
                      resx.Response.attachmenttype == 'image/png'
                    ) {
                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(
                          this.Decryption.toString()
                        );
                    } else {
                      this.dec = btoa(this.Decryption);
                      var str2 = this.dec.toString();
                      var str1 = new String('data:image/svg+xml;base64,');
                      var src = str1.concat(str2.toString());

                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(src);
                      // if(cont.thumbnail == "") {
                      //   cont.thumbnail = this.imageSrc;
                      // }
                    }

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
                      false,
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
                    this.ListHotpicks.push(card);
                    // if (this.ListHotpicks.length === responseArrayLength) {
                       this.hotPicksLoading = false;
                    // }
            });
          } catch (e) {
            this.hotPicksLoading = false;
          }
         })
      }
      
    })
         
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
            const responseArrayLength = result.Response.content.length;
            result.Response.content.forEach((cont) => {
              if (this.paginationflag == false) {
                this.nft
                  .getSVGByHash(cont.imagebase64)
                  .subscribe((res: any) => {
                    this.Decryption = res.Response.Base64ImageSVG;
                    if (
                      cont.attachmenttype == 'image/jpeg' ||
                      cont.attachmenttype == 'image/jpg' ||
                      cont.attachmenttype == 'image/png'
                    ) {
                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(
                          this.Decryption.toString()
                        );
                    } else {
                      this.dec = btoa(this.Decryption);
                      var str2 = this.dec.toString();
                      var str1 = new String('data:image/svg+xml;base64,');
                      var src = str1.concat(str2.toString());

                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(src);
                      // if(cont.thumbnail == "") {
                      //   cont.thumbnail = this.imageSrc;
                      // }
                    }

                    this.nft
                      .getThumbnailId(cont.Id)
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
                      false,
                      false
                    );
                    card.ImageBase64 = this.imageSrc;
                    // card.thumbnail= cont.thumbnail;
                    card.Blockchain = cont.blockchain;
                    card.NFTIdentifier = cont.nftidentifier;
                    card.NFTName = cont.nftname;
                    card.Blockchain = cont.blockchain;
                    card.CreatorUserId = cont.creatoruserid;
                    card.SellingStatus = cont.sellingstatus;
                    card.CurrentOwnerPK = cont.currentownerpk;
                    this.ListBought.push(card);
                    if (this.ListBought.length === responseArrayLength) {
                      this.boughtLoading = false;
                    }
                  });
              }
            });
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
    
    this.service.getFavouritesByUserId(this.user).subscribe((res1:any)=>{
      for(let y=0;y<res1.length;y++){
        this.service.getNFTIdAndBlockchain(res1[y].nftidentifier,res1[y].blockchain).subscribe((resy:any)=>{
          // try {
                this.nft
                  .getSVGByHash(resy.Response.imagebase64)
                  .subscribe((res: any) => {
                    this.Decryption = res.Response.Base64ImageSVG;
                    if (
                      resy.Response.attachmenttype == 'image/jpeg' ||
                      resy.Response.attachmenttype == 'image/jpg' ||
                      resy.Response.attachmenttype == 'image/png'
                    ) {
                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(
                          this.Decryption.toString()
                        );
                    } else {
                      this.dec = btoa(this.Decryption);
                      var str2 = this.dec.toString();
                      var str1 = new String('data:image/svg+xml;base64,');
                      var src = str1.concat(str2.toString());

                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(src);
                      // if(cont.thumbnail == "") {
                      //   cont.thumbnail = this.imageSrc;
                      // }
                    }

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
                      false,
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
                    this.ListTrends.push(card);
                    // if (this.ListTrends.length === responseArrayLength) {
                       this.favLoading = false;
                    // }
                  });
          // } catch (e) {
          //   this.favLoading = false;
          // }
        })
      }
    })
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
            const responseArrayLength = result.Response.content.length;
            result.Response.content.forEach((cont) => {
              if (this.paginationflag == false) {
                this.nft
                  .getSVGByHash(cont.imagebase64)
                  .subscribe((res: any) => {
                    this.Decryption = res.Response.Base64ImageSVG;
                    if (
                      cont.attachmenttype == 'image/jpeg' ||
                      cont.attachmenttype == 'image/jpg' ||
                      cont.attachmenttype == 'image/png'
                    ) {
                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(
                          this.Decryption.toString()
                        );
                    } else {
                      this.dec = btoa(this.Decryption);
                      var str2 = this.dec.toString();
                      var str1 = new String('data:image/svg+xml;base64,');
                      var src = str1.concat(str2.toString());

                      this.imageSrc =
                        this._sanitizer.bypassSecurityTrustResourceUrl(src);
                      // if(cont.thumbnail == "") {
                      //   cont.thumbnail = this.imageSrc;
                      // }
                    }

                    this.nft
                      .getThumbnailId(cont.Id)
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
                      false,
                      false
                    );
                    card.ImageBase64 = this.imageSrc;
                    // card.thumbnail= cont.thumbnail;
                    card.Blockchain = cont.blockchain;
                    card.NFTIdentifier = cont.nftidentifier;
                    card.NFTName = cont.nftname;
                    card.Blockchain = cont.blockchain;
                    card.CreatorUserId = cont.creatoruserid;
                    card.SellingStatus = cont.sellingstatus;
                    card.CurrentOwnerPK = cont.currentownerpk;
                    this.ListSales.push(card);
                    if (this.ListSales.length === responseArrayLength) {
                      this.onSaleLoading = false;
                    }
                  });
              }
            });
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
            this.bccommingsoon="Ethtereum/Polygon NFTs coming soon!"
          } else {
            this.connectedWallet = '';
          }
        });
      } else if (this.selectedBlockchain === 'stellar') {
        this.bccommingsoon=""
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
        this.bccommingsoon="Solana NFTs coming soon!"
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
