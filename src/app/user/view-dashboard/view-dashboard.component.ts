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
  imagePath: any;
  greeting : string = '';

  constructor(
    private api: ApiServicesService,
    private _sanitizer: DomSanitizer,
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

  async ngOnInit(): Promise<void> {

    // this.route.queryParams.subscribe((params) => {
    //   this.User = params['user']
    //   console.log("--------------user passed ",this.User)
    // })
    this.route.queryParams.subscribe((params) => {
      this.selectedBlockchain = params['blockchain']
      this.User = params['user']
      console.log("--------------bc passed ",this.selectedBlockchain)
      console.log("--------------bc passed user ",this.User)
      this.retrive(this.selectedBlockchain,this.User);
})

  
    this.setGreeting();
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

  private setGreeting () {
    const date = new Date().toLocaleString('en-US', {hour : 'numeric', hour12 : false});
    let time = Number(date);
    if(time >= 1 && time < 12 || time == 24) {
      this.greeting = 'Good Morning';
    }
    else if(time >= 12 && time < 16) {
      this.greeting = 'Good Afternoon';
    }
    else {
      this.greeting = 'Good Evening';
    }
  }


  async retrive(blockchain: string,user:string) {
    console.log("ON IN IT 2 ")
    if (blockchain == 'stellar') {
      let details = navigator.userAgent;
      console.log("user agent: ",details)
      
      /* Creating a regular expression
      containing some mobile devices keywords
      to search it in details string*/
      let regexp = /android|iphone|kindle|ipad/i;
      console.log("-------------------------this is in user dash")
      /* Using test() method to search regexp in details
      it returns boolean value*/
      let isMobileDevice = regexp.test(details);
      
      if(isMobileDevice) {
          console.log("Its a Mobile Device ----------------------------------------------------------!");

          // await albedo.publicKey({require_existing:true}).then( re1s => {
          //     console.log("-----yyyyyyyyyyyyyyyyyyyyyy-----------result---------",re1s)
       
              console.log("==================start albedo profile======================",user)
            
             this.api.getEndorsement(user).subscribe((res: any) => {
            console.log("==================start profile======================", res);
            if (res.profilepic != "") {
              this.imagePath = res.profilepic;
            } else {
              this.imagePath = "../../../assets/images/default_profile.png";
            }
            this.Name = res.Name;
          })
           
        }else{
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      freighterWallet.initWallelt();
      this.User= freighterWallet.getWalletaddress();
      this.api.getEndorsement(this.User).subscribe((res:any)=>{
        if(res.profilepic!=""){
          this.imagePath = res.profilepic
        }else{
          this.imagePath = "../../../assets/images/default_profile.png"
        }
        this.Name=res.Name
      })
    }
    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      phantomWallet.initWallelt();
      this.User = phantomWallet.getWalletaddress();
      this.api.getEndorsement(this.User).subscribe((res:any)=>{
        if(res.profilepic!=""){
          this.imagePath = res.profilepic
        }else{
          this.imagePath = "../../../assets/images/default_profile.png"
        }
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
      metamaskwallet.initWallelt();
      this.User = metamaskwallet.getWalletaddress();
      this.api.getEndorsement(this.User).subscribe((res:any)=>{
        if(res.profilepic!=""){
          this.imagePath = res.profilepic
        }else{
          this.imagePath = "../../../assets/images/default_profile.png"
        }
        this.Name=res.Name
      })
    }

  }

  goToEdit(user:any){

    this.router.navigate(['./user-dashboard/edit-profile'],{
      queryParams:{data:JSON.stringify(user),blockchain:this.selectedBlockchain}
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
    this.router.navigate(['./user-dashboard/mycollections'],{
      queryParams:{data:id,blockchain:this.selectedBlockchain}
      })
      this.closeSideNav();
  }

  public closeSideNav() {
    if(this.smallScreen) {
      this.opened = false;
    }
  }
  backtoHome(){
    this.router.navigate(['/user-dashboard/overview'], {
      queryParams: { blockchain: this.selectedBlockchain },
    });
  }
}
