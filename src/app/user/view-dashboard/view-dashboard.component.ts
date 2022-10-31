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
  smallScreen : boolean = false;

  constructor(
    private api: ApiServicesService,
    private nft: NftServicesService,
    private collection: CollectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}



  goToOverview(){
    this.router.navigate(['./user-dashboard/overview'], {
      queryParams: { blockchain: this.selectedBlockchain },
    });
    this.sideNavOpened = false;
    this.accListExpanded = false;

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedBlockchain = params['blockchain']
      console.log("this blockchain: ",this.selectedBlockchain)})
    this.retrive(this.selectedBlockchain);

    if (window.innerWidth < 1280) {
      this.opened = false;
      this.smallScreen = true;
    } else {
      this.opened = true;
      this.smallScreen = false;
    }

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


  async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      this.User= await freighterWallet.getWalletaddress();
      this.api.getEndorsement(this.User).subscribe((res:any)=>{
        console.log("data is: ",res)
        this.Name=res.Name
      })

    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.User = await phantomWallet.getWalletaddress();
      this.api.getEndorsement(this.User).subscribe((res:any)=>{
        console.log("data is: ",res)
        this.Name=res.Name
      })

    }

    if (
      blockchain == 'ethereum' ||
      blockchain == 'polygon' ||
      blockchain=='ethereum or polygon'
    ) {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.User = await metamaskwallet.getWalletaddress();
      this.api.getEndorsement(this.User).subscribe((res:any)=>{
        console.log("data is: ",res)
        this.Name=res.Name
      })
    }

  }

  goToEdit(user:any){

    this.router.navigate(['./user-dashboard/edit-profile'],{
      queryParams:{data:JSON.stringify(user)}
      });

      this.closeSideNav();
}

  public toggleSidenav() {
    this.opened = !this.opened;
  }

  public currentRoute(): string {
    return this.router.url;
  }

  myCollections(id:any){
    console.log("Id: ",id)
    this.router.navigate(['./user-dashboard/mycollections'],{
      queryParams:{data:id}
      })
      this.closeSideNav();
  }

  public closeSideNav() {
    if(this.smallScreen) {
      this.opened = false;
    }
  }
}
