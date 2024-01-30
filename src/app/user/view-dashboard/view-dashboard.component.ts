import { Component, HostListener, OnInit } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { DomSanitizer } from '@angular/platform-browser';
import albedo from '@albedo-link/intent';
import { PubkeyvalidatorService } from 'src/app/services/common/pubkeyvalidator.service';
import { Connection, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';
import { BlockchainConfig } from 'src/environments/environment';
import { WalletSidenavService } from 'src/app/services/wallet-sidenav.service';
@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.css'],
})
export class ViewDashboardComponent implements OnInit {
  userId: any;
  nfts: any;
  mywatchlist: any;
  myfavourites: any;
  collectionList: any;
  opened: boolean = true;
  sideNavOpened: boolean = false;
  accListExpanded: boolean = false;
  data: any;
  EndorseList: any;
  selectedBlockchain: any;
  User: string;
  Name: any;
  smallScreen: boolean = false;
  imagePath: any;
  greeting: string = '';
  pk: any;
  connectedWallet: string = '';
  bccommingsoon: string;

  constructor(
    private api: ApiServicesService,
    private _sanitizer: DomSanitizer,
    private nft: NftServicesService,
    private collection: CollectionService,
    private router: Router,
    private route: ActivatedRoute,
    private validatorService: PubkeyvalidatorService,
    private walletSideNav: WalletSidenavService
  ) {}

  goToOverview() {
    this.router.navigate(['./user-dashboard/overview'], {
      queryParams: { user: this.pk, blockchain: this.selectedBlockchain },
    });
    this.sideNavOpened = false;
    this.accListExpanded = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.selectedBlockchain = params['blockchain'];
      let pkBlockchain = this.selectedBlockchain;
      if (this.selectedBlockchain === 'jpy') {
        pkBlockchain = 'solana';
      }
      this.pk = await this.validatorService.GetActivePubKey(
        params['user'],
        pkBlockchain
      );
      this.retrive(this.selectedBlockchain, this.pk).then((res) => {
        this.setGreeting();
        if (window.innerWidth < 1280) {
          this.opened = false;
          this.smallScreen = true;
        } else {
          this.opened = true;
          this.smallScreen = false;
        }
      });
      this.connectedWallet = '';
      this.Name = '';
      this.getConnectedWallet();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 1280) {
      this.opened = false;
      this.smallScreen = true;
    } else {
      this.opened = true;
      this.smallScreen = false;
    }
  }

  private setGreeting() {
    const date = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      hour12: false,
    });
    let time = Number(date);
    if ((time >= 1 && time < 12) || time == 24) {
      this.greeting = 'Good Morning';
    } else if (time >= 12 && time < 16) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  async retrive(blockchain: string, pk: string) {
    if (blockchain == 'stellar') {
      let details = navigator.userAgent;

      let regexp = /android|iphone|kindle|ipad/i;

      let isMobileDevice = regexp.test(details);

      if (isMobileDevice) {
        this.api.getEndorsement(pk).subscribe((res: any) => {
          if (res.Name != '') {
            if (res.profilepic != '') {
              this.imagePath = res.profilepic;
            } else {
              this.imagePath = '../../../assets/images/default_profile.png';
            }
            this.Name = res.Name;
          } else {
            this.Name = 'New User';
            this.imagePath = '../../../assets/images/default_profile.png';
          }
        });
      } else {
        this.api.getEndorsement(pk).subscribe((res: any) => {
          if (res.Name != '') {
            if (res.profilepic != '') {
              this.imagePath = res.profilepic;
            } else {
              this.imagePath = '../../../assets/images/default_profile.png';
            }
            this.Name = res.Name;
          } else {
            this.Name = 'New User';
            this.imagePath = '../../../assets/images/default_profile.png';
          }
        });
      }
    }

    if (blockchain == 'solana' || blockchain == 'jpy') {
      this.api.getEndorsement(pk).subscribe((res: any) => {
        if (res.Name != '') {
          if (res.profilepic != '') {
            this.imagePath = res.profilepic;
          } else {
            this.imagePath = '../../../assets/images/default_profile.png';
          }
          this.Name = res.Name;
        } else {
          this.Name = 'New User';
          this.imagePath = '../../../assets/images/default_profile.png';
        }
      });
    }

    if (
      blockchain == 'ethereum' ||
      blockchain == 'polygon' ||
      blockchain == 'ethereum or polygon'
    ) {
      this.api.getEndorsement(pk).subscribe((res: any) => {
        if (res.Name != '') {
          if (res.profilepic != '') {
            this.imagePath = res.profilepic;
          } else {
            this.imagePath = '../../../assets/images/default_profile.png';
          }
          this.Name = res.Name;
        } else {
          this.Name = 'New User';
          this.imagePath = '../../../assets/images/default_profile.png';
        }
      });
    }
  }

  goToEdit(user: any) {
    this.router.navigate(['/user-dashboard/edit-profile'], {
      queryParams: { user: user, blockchain: this.selectedBlockchain },
    });

    this.closeSideNav();
  }

  public toggleSidenav() {
    this.opened = !this.opened;
  }

  public currentRoute(): string {
    return this.router.url;
  }

  myCollections(id: any) {
    this.router.navigate(['./user-dashboard/mycollections'], {
      queryParams: { user: id, blockchain: this.selectedBlockchain },
    });
    this.closeSideNav();
  }

  myItems(id: any) {
    this.router.navigate(['./user-dashboard/myitems'], {
      queryParams: {
        user: id,
        blockchain: this.selectedBlockchain,
        filter: 'All',
      },
    });
    this.closeSideNav();
  }

  myWatchlist(id: any) {
    this.router.navigate(['./user-dashboard/watchlist'], {
      queryParams: { user: id, blockchain: this.selectedBlockchain },
    });
    this.closeSideNav();
  }

  myFavourites(id: any) {
    this.router.navigate(['./user-dashboard/favourites'], {
      queryParams: { user: id, blockchain: this.selectedBlockchain },
    });
    this.closeSideNav();
  }

  public closeSideNav() {
    if (this.smallScreen) {
      this.opened = false;
    }
  }
  backtoHome() {
    this.router.navigate(['/user-dashboard/overview'], {
      queryParams: { user: this.pk, blockchain: this.selectedBlockchain },
    });
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

  public async getConnectedWallet() {
    if (Boolean(this.pk)) {
      if (
        this.selectedBlockchain === 'ethereum' ||
        this.selectedBlockchain === 'polygon'
      ) {
        let metmaskWallet = new UserWallet();
        metmaskWallet = new MetamaskComponent(metmaskWallet);

        metmaskWallet.initWallelt((address: string) => {
          console.log(address);
          const user = address;

          if (user !== '' && user !== undefined) {
            this.connectedWallet = 'Metamask';
            this.bccommingsoon = '';
          } else {
            this.connectedWallet = '';
          }
        });
        /* const provider = new ethers.providers.Web3Provider(window.ethereum!);
        provider.listAccounts().then((data) => {
          if (data.length > 0) {
            this.connectedWallet = 'Metamask';
            this.bccommingsoon = '';
          } else {
            this.connectedWallet = '';
          }
        }); */
      } else if (this.selectedBlockchain === 'stellar') {
        this.bccommingsoon = '';
        if (this.checkIfMobileDevice()) {
          this.connectedWallet = 'Albedo';
        } else {
          let freighterWallet = new UserWallet();
          freighterWallet = new FreighterComponent(freighterWallet);
          freighterWallet.initWallelt();
          const userPK = await freighterWallet.getWalletaddress();

          if (userPK !== '' && userPK !== undefined) {
            this.connectedWallet = 'Freighter';
          } else {
            this.connectedWallet = '';
          }
        }
      } else if (
        this.selectedBlockchain === 'solana' ||
        this.selectedBlockchain === 'jpy'
      ) {
        this.bccommingsoon = '';
        try {
          const connection = new Connection(BlockchainConfig.solananetworkURL);
          const pk = new PublicKey(this.pk);
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

  public openWalletSideBar() {
    this.walletSideNav.setWallet(this.connectedWallet.toLowerCase());
    this.walletSideNav.open();
  }

  public isActiveRoute(route: string): boolean {
    if (this.router.url.includes(route)) {
      return true;
    } else {
      return false;
    }
  }
}
