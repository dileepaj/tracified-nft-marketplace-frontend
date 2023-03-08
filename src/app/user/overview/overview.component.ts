import albedo from '@albedo-link/intent';
import { P } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Connection, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';
import { Card, HomeCard, NFTCard } from 'src/app/models/marketPlaceModel';
import { UserWallet } from 'src/app/models/userwallet';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nft: NftServicesService,
    private _sanitizer: DomSanitizer,
    private walletSideNav: WalletSidenavService
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
      this.hotPicksLoading = true;
      this.mintedLoading = true;
      this.favLoading = true;
      this.boughtLoading = true;
      this.onSaleLoading = true;
      this.nft
        .getNFTByBlockchainandUser(this.selectedBlockchain, this.user)
        .subscribe(async (data) => {
          this.nfts = data;
          if (this.nft == null) {
            this.ngOnInit();
          } else {
            for (let x = 0; x < this.nfts.Response.length; x++) {
              if (
                this.nfts.Response[x].sellingstatus == 'ON SALE' &&
                this.paginationflag == false
              ) {
                this.FilterByONSALE(this.nfts.Response[x]);
              }

              if (
                this.nfts.Response[x].sellingstatus == 'NOTFORSALE' &&
                this.paginationflag == false
              ) {
                this.FilterByBoughtNFT(this.nfts.Response[x]);
              }

              if (
                this.nfts.Response[x].sellingstatus == 'Minted' &&
                this.paginationflag == false
              ) {
                this.FilterByMinted(this.nfts.Response[x]);
              }

              if (
                this.nfts.Response[x].trending == true &&
                this.paginationflag == false
              ) {
                this.FilterByTrending(this.nfts.Response[x]);
              }

              if (
                this.nfts.Response[x].hotpicks == true &&
                this.paginationflag == false
              ) {
                this.FilterByHotpicks(this.nfts.Response[x]);
              }
            }
            this.hotPicksLoading = false;
            this.mintedLoading = false;
            this.favLoading = false;
            this.boughtLoading = false;
            this.onSaleLoading = false;
          }
        });
    });
  }

  FilterByHotpicks(response: any) {
    this.nft.getSVGByHash(response.imagebase64).subscribe((res: any) => {
      this.Decryption = res.Response.Base64ImageSVG;
      if (
        response.attachmenttype == 'image/jpeg' ||
        response.attachmenttype == 'image/jpg' ||
        response.attachmenttype == 'image/png'
      ) {
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
          this.Decryption.toString()
        );
      } else {
        this.dec = btoa(this.Decryption);
        var str2 = this.dec.toString();
        var str1 = new String('data:image/svg+xml;base64,');
        var src = str1.concat(str2.toString());
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
      }
      this.nft.getThumbnailId(response.id).subscribe(async (thumbnail: any) => {
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
        false,
        false
      );
      card.ImageBase64 = this.imageSrc;
      // card.thumbnail=this.thumbnailSRC
      card.NFTIdentifier = response.nftidentifier;
      card.NFTName = response.nftname;
      card.Blockchain = response.blockchain;
      card.CreatorUserId = response.creatoruserid;
      card.SellingStatus = response.sellingstatus;
      card.CurrentOwnerPK = response.currentownerpk;
      this.ListHotpicks.push(card);
    });
  }

  FilterByONSALE(response: any) {
    this.nft.getSVGByHash(response.imagebase64).subscribe((res: any) => {
      this.Decryption = res.Response.Base64ImageSVG;
      if (
        response.attachmenttype == 'image/jpeg' ||
        response.attachmenttype == 'image/jpg' ||
        response.attachmenttype == 'image/png'
      ) {
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
          this.Decryption.toString()
        );
      } else {
        this.dec = btoa(this.Decryption);
        var str2 = this.dec.toString();
        var str1 = new String('data:image/svg+xml;base64,');
        var src = str1.concat(str2.toString());
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
      }
      this.nft.getThumbnailId(response.id).subscribe(async (thumbnail: any) => {
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
        false,
        false
      );
      card.ImageBase64 = this.imageSrc;
      //  card.thumbnail=this.thumbnailSRC
      card.NFTIdentifier = response.nftidentifier;
      card.NFTName = response.nftname;
      card.Blockchain = response.blockchain;
      card.CreatorUserId = response.creatoruserid;
      card.SellingStatus = response.sellingstatus;
      card.CurrentOwnerPK = response.currentownerpk;
      this.ListSales.push(card);
    });
  }

  FilterByMinted(response: any) {
    this.nft.getSVGByHash(response.imagebase64).subscribe((res: any) => {
      this.Decryption = res.Response.Base64ImageSVG;
      if (
        response.attachmenttype == 'image/jpeg' ||
        response.attachmenttype == 'image/jpg' ||
        response.attachmenttype == 'image/png'
      ) {
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
          this.Decryption.toString()
        );
      } else {
        this.dec = btoa(this.Decryption);
        var str2 = this.dec.toString();
        var str1 = new String('data:image/svg+xml;base64,');
        var src = str1.concat(str2.toString());
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
      }
      this.nft.getThumbnailId(response.id).subscribe(async (thumbnail: any) => {
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
        false,
        false
      );
      card.ImageBase64 = this.imageSrc;
      // card.thumbnail=this.thumbnailSRC
      card.NFTIdentifier = response.nftidentifier;
      card.NFTName = response.nftname;
      card.Blockchain = response.blockchain;
      card.CreatorUserId = response.creatoruserid;
      card.SellingStatus = response.sellingstatus;
      card.CurrentOwnerPK = response.currentownerpk;
      this.ListMinted.push(card);
    });
  }

  FilterByBoughtNFT(response: any) {
    this.nft.getSVGByHash(response.imagebase64).subscribe((res: any) => {
      this.Decryption = res.Response.Base64ImageSVG;
      if (
        response.attachmenttype == 'image/jpeg' ||
        response.attachmenttype == 'image/jpg' ||
        response.attachmenttype == 'image/png'
      ) {
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
          this.Decryption.toString()
        );
      } else {
        this.dec = btoa(this.Decryption);
        var str2 = this.dec.toString();
        var str1 = new String('data:image/svg+xml;base64,');
        var src = str1.concat(str2.toString());
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
      }
      this.nft.getThumbnailId(response.id).subscribe(async (thumbnail: any) => {
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
        false,
        false
      );
      card.ImageBase64 = this.imageSrc;
      // card.thumbnail=this.thumbnailSRC
      card.NFTIdentifier = response.nftidentifier;
      card.NFTName = response.nftname;
      card.Blockchain = response.blockchain;
      card.CreatorUserId = response.creatoruserid;
      card.SellingStatus = response.sellingstatus;
      card.CurrentOwnerPK = response.currentownerpk;
      this.ListBought.push(card);
    });
  }

  FilterByTrending(response: any) {
    this.nft.getSVGByHash(response.imagebase64).subscribe((res: any) => {
      this.Decryption = res.Response.Base64ImageSVG;
      if (
        response.attachmenttype == 'image/jpeg' ||
        response.attachmenttype == 'image/jpg' ||
        response.attachmenttype == 'image/png'
      ) {
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
          this.Decryption.toString()
        );
      } else {
        this.dec = btoa(this.Decryption);
        var str2 = this.dec.toString();
        var str1 = new String('data:image/svg+xml;base64,');
        var src = str1.concat(str2.toString());
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
      }
      this.nft.getThumbnailId(response.id).subscribe(async (thumbnail: any) => {
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
        false,
        false
      );
      card.ImageBase64 = this.imageSrc;
      //  card.thumbnail=this.thumbnailSRC
      card.NFTIdentifier = response.nftidentifier;
      card.NFTName = response.nftname;
      card.Blockchain = response.blockchain;
      card.CreatorUserId = response.creatoruserid;
      card.SellingStatus = response.sellingstatus;
      card.CurrentOwnerPK = response.currentownerpk;
      this.ListTrends.push(card);
    });
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
          } else {
            this.connectedWallet = '';
          }
        });
      } else if (this.selectedBlockchain === 'stellar') {
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
