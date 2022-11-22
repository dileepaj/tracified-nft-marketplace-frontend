import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card, Favourites, HomeCard, NFTCard, WatchList } from 'src/app/models/marketPlaceModel';
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

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent implements OnInit, AfterViewInit {
  @ViewChildren('theLastItem', {read : ElementRef}) theLastItem : QueryList<ElementRef>;
  watchlist: any;
  favourites: any;
  uptodates: any;
  defaultResult: any;
  nfts: any;
  Decryption: any;
  loading : boolean = false;

  dec: string;
  svg:SVG=new SVG('','','NA','')

  imageSrc:any;
  saleNft: any;
  List:any[]=[];
  ListNew:any[]=[];
  All:any[]=[];
  Trend:any[]=[];
  HotPick:any[]=[];
  Sale:any[]=[];
  UpToDate:any[]=[];
  Creators:any[]=[];
  favouritesModel: Favourites = new Favourites('', '','');
  watchlistModel: WatchList = new WatchList('', '','');
  selectedFilter: string = 'all';
  selectedBlockchain: string = '';
  nftItems : any = [];
  observer: any;
  currentPage : number = 1;
  nextPageLoading : boolean = false;
  filterChanged : boolean = false;
  isNftItem : boolean = false;
  trends: any;
  hotpicks: any;
  sales: any;
  creators: any;

  constructor(
    private api: ApiServicesService,
    private nft: NftServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _sanitizer: DomSanitizer ,
    private snackbarService:SnackbarServiceService,
    private dialogService: DialogService
  ) {}



  async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      this.favouritesModel.User= await freighterWallet.getWalletaddress();

    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.favouritesModel.User = await phantomWallet.getWalletaddress();

    }

    if (
      blockchain == 'ethereum' ||
      blockchain == 'polygon'
    ) {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.favouritesModel.User = await metamaskwallet.getWalletaddress();

    }

  }

  addToFavourites(id:string) {
    this.favouritesModel.Blockchain = this.selectedBlockchain;
    this.favouritesModel.NFTIdentifier = id;
    this.retrive(this.favouritesModel.Blockchain).then(res=>{
      this.api.addToFavourites(this.favouritesModel).subscribe(res=>{
        this.snackbarService.openSnackBar("Added to favourites")
        this.api.getFavouritesByBlockchainAndNFTIdentifier(this.favouritesModel.Blockchain,this.favouritesModel.NFTIdentifier).subscribe(res=>{
        });
      })


    })

  }

  addToWatchList(id:string) {
    this.watchlistModel.Blockchain = this.selectedBlockchain;
    this.watchlistModel.NFTIdentifier =id;
    this.retrive(this.watchlistModel.Blockchain).then(res=>{
      this.api.addToWatchList(this.watchlistModel).subscribe(res=>{
        this.snackbarService.openSnackBar("Added to watchlists")
        this.api.getWatchlistByBlockchainAndNFTIdentifier(this.watchlistModel.Blockchain,this.watchlistModel.NFTIdentifier).subscribe(res=>{
        });
      })

    })

  }

  routeToBuy(id:string){
    console.log("this bc: ",this.selectedBlockchain)
    let data :any[]=[id,this.selectedBlockchain];
    this.router.navigate(['./buyNft'],{
    queryParams:{data:JSON.stringify(data)}
    })
  }

  viewNFT(){

  }

  ngAfterViewInit() {
    this.theLastItem?.changes.subscribe((d) => {
      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }

  ngOnInit(): void {
   // window.location.reload();
    this.List.splice(0)
   /*  const loadingAnimation = this.dialogService.pendingDialog({
      message:"Loading NFTs.."
    }) */
    console.log("inside on init")
    const timer$ = timer(0,APIConfigENV.homepageIntervalTimer)
    timer$.subscribe(data=>{
      this.Trend.splice(0)
      this.HotPick.splice(0)
      this.UpToDate.splice(0)
      this.Creators.splice(0)
      this.Sale.splice(0)
       this.nftItems.splice(0)
      this.List.splice(0)
  console.log("proceeding................")
      this.route.queryParams.subscribe((params) => {
        this.loading = true;
        this.selectedBlockchain = params['blockchain'];
        this.selectedFilter = params['filter'];
        
        
        if(this.selectedFilter === 'onsale' || this.selectedFilter === 'hotpicks' || this.selectedFilter === 'trending'  || this.selectedFilter === 'bestcreators' || this.selectedFilter === 'uptodate'){
          this.currentPage=1;
          this.intersectionFilterObserver(this.selectedFilter)
          this.List.splice(0)
          this.Filters(this.selectedFilter)
        }else{
          this.currentPage=1;
          this.List.splice(0)
          this.intersectionObserver(this.selectedFilter);
          console.log("bc data and filter: ",this.selectedBlockchain,this.selectedFilter)
          this.getAllNFTs(this.selectedFilter);
        }
       
        });
      interval(APIConfigENV.APIStartDelay).subscribe(data=>{
        this.loading = false;
      })

    })

  }

  public async fillCard(filter:string){
    for( let x=0; x<(this.nftItems.length); x++){
   await this.nft.getSVGByHash(this.nftItems[x].imagebase64).subscribe(async(res:any)=>{
        console.log("svg result is: ",res)
        this.Decryption = res.Response.Base64ImageSVG
        console.log("imageee ",this.nftItems[x].attachmenttype,this.nftItems[x])
        if(this.nftItems[x].attachmenttype == "image/jpeg" || this.nftItems[x].attachmenttype == "image/jpg" || this.nftItems[x].attachmenttype == "image/png"){
         console.log("-------------------------------------",this.imageSrc)
          this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
        }else{
          this.dec = btoa(this.Decryption);
      var str2 = this.dec.toString();
      var str1 = new String( "data:image/svg+xml;base64,");
      var src = str1.concat(str2.toString());
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
        }
        let card:NFTCard= new NFTCard('','','','','','','',false,false);
        card.ImageBase64=this.imageSrc
        card.NFTIdentifier=this.nftItems[x].nftidentifier
        card.NFTName=this.nftItems[x].nftname
        card.Blockchain=this.nftItems[x].blockchain
        card.CreatorUserId=this.nftItems[x].creatoruserid
        card.SellingStatus=this.nftItems[x].sellingstatus
        card.CurrentOwnerPK=this.nftItems[x].currentownerpk
        card.Hotpicks=this.nftItems[x].hotpicks
        card.Trending=this.nftItems[x].trending
        this.List.push(card);
      })
    }
  }




  public filterAndShowCard(arr:any[],filter:string){
    console.log("list is: ",this.List)
    console.log("array: ",arr)
  
    for(let x=0; x<(arr.length);x++){
      console.log
      this.nft.getSVGByHash(arr[x].imagebase64).subscribe(async(res:any)=>{
      console.log("svg result is: ",res)
        this.Decryption = res.Response.Base64ImageSVG
        console.log("imageee ",arr[x].attachmenttype)
        if(arr[x].attachmenttype == "image/jpeg" || arr[x].attachmenttype == "image/jpg" || arr[x].attachmenttype == "image/png"){
          console.log("-------------------------------------",this.imageSrc)
          this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
        }else{
          this.dec = btoa(this.Decryption);
      var str2 = this.dec.toString();
      var str1 = new String( "data:image/svg+xml;base64,");
      var src = str1.concat(str2.toString());
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
        }
     let card:NFTCard= new NFTCard('','','','','','','',false,false);
    card.ImageBase64=this.imageSrc
    card.NFTIdentifier=arr[x].nftidentifier
    card.NFTName=arr[x].nftname
    card.Blockchain=arr[x].blockchain
    card.CreatorUserId=arr[x].creatoruserid
    card.SellingStatus=arr[x].sellingstatus
    card.CurrentOwnerPK=arr[x].currentownerpk
    card.Hotpicks=arr[x].hotpicks
    card.Trending=arr[x].trending
    console.log("current owner and filter: ",arr[x].currentownerpk, filter)
   
    this.List.push(card)
    console.log("list deets : ",this.List)
  
      })
    }
 
  }



  public setFilter(filter: string) {
    this.filterChanged = true;
    this.List.splice(0);
    this.nftItems.splice(0);
    this.Trend.splice(0)
    this.HotPick.splice(0)
    this.UpToDate.splice(0)
    this.Creators.splice(0)
    this.Sale.splice(0)
    console.log("in filter picked bc and filter: ",this.selectedBlockchain,filter)
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: this.selectedBlockchain, filter },
    });
  }

  Filters(filter:string){
    this.Trend.splice(0)
      this.HotPick.splice(0)
      this.UpToDate.splice(0)
      this.Creators.splice(0)
      this.Sale.splice(0)
      this.nftItems.splice(0)
    if(filter === 'onsale'){
      if(!this.loading) {
        this.nextPageLoading = true;
      }
      this.Sale.splice(0);
      console.log("current page: ",this.currentPage)
      this.nft.getNFTpaginatedOnSALE(this.selectedBlockchain,this.currentPage,'ON SALE').subscribe(async(data:any) => {
        console.log("sales data: ",data)
        if(data.Response.content!=null){
        this.sales = data
      
      for(let a=0; a<this.sales.Response.content.length; a++){
        this.Sale.push(this.sales.Response.content[a]);  
        console.log("this sale list: ",this.Sale)
        if(this.List.length>0  && this.currentPage==1){
          window.location.reload();
        }
      }
      this.nextPageLoading = false;
      this.nftItems.splice(0)
      this.filterAndShowCard(this.Sale,filter);  
    }else{
      window.location.reload();
    }
      }) 
    }

    if(filter === 'hotpicks'){
      this.HotPick.splice(0);
      if(!this.loading) {
        this.nextPageLoading = true;
      }
      this.nft.getNFTpaginatedTrendsHotpicks(this.selectedBlockchain,this.currentPage,'hotpicks').subscribe(async(data:any) => {
        console.log("hotpicks data: ",data)
        if(data.Response.content!=null){
        this.hotpicks = data
        console.log("this.List inside hotpicks ,",this.List)
        if(this.List.length>0  && this.currentPage==1){
          window.location.reload();
        }
        
        for(let a=0; a<this.hotpicks.Response.content.length; a++){
          this.HotPick.push(this.hotpicks.Response.content[a]);  
          console.log("this hotpick list: ",this.HotPick)
        }
        this.nextPageLoading = false;
        this.nftItems.splice(0)
        this.filterAndShowCard(this.HotPick,filter);  
      }else{
        window.location.reload();
      }
      })
    }

    if(filter == 'trending'){
      this.Trend.splice(0);
      if(!this.loading) {
        this.nextPageLoading = true;
      }
      this.nft.getNFTpaginatedTrendsHotpicks(this.selectedBlockchain,this.currentPage,'trending').subscribe(async(data:any) => {
        console.log("trends data: ",data)
        if(data.Response.content!=null){
        this.trends = data
        for(let a=0; a<this.trends.Response.content.length; a++){
          this.Trend.push(this.trends.Response.content[a]);  
          console.log("this trends list: ",this.Trend)
          if(this.List.length>0  && this.currentPage==1){
            window.location.reload();
          }
        }
        this.nextPageLoading = false;
        this.nftItems.splice(0)
        this.filterAndShowCard(this.Trend,filter);  
      }else{
        window.location.reload();
      }
      })
    }

    if(filter === 'uptodate'){
      this.UpToDate.splice(0);
      if(!this.loading) {
        this.nextPageLoading = true;
      }
      console.log("current page: ",this.currentPage)
      this.nft.getNFTpaginated(this.selectedBlockchain, this.currentPage).subscribe(async(data:any) => {
        console.log("uptodate data: ",data)
        if(data.Response.content!=null){
        this.uptodates = data
      
     for(let a=0; a<this.uptodates.Response.content.length; a++){
        this.UpToDate.push(this.uptodates.Response.content[a]);  
        console.log("this update list: ",this.UpToDate)
        if(this.List.length>0 && this.currentPage==1 ){
          window.location.reload();
        }
      }
      this.nextPageLoading = false;
      this.nftItems.splice(0)
      this.filterAndShowCard(this.UpToDate,filter);  
    }else{
      window.location.reload();
    }
      }) 
    }

    if(filter=== 'bestcreators'){
      this.Creators.splice(0);
      if(!this.loading) {
        this.nextPageLoading = true;
      }
      this.nft.getBestCreators(this.currentPage, this.selectedBlockchain).subscribe(async(data:any)=>{
        console.log("creators data: ",data)
        if(data.Response.content!=null){
          this.creators = data
          this.Creators.splice(0)
          for(let a=0; a<this.creators.Response.content.length; a++){
             this.Creators.push(this.creators.Response.content[a]);  
             console.log("this update list: ",this.Creators)
             if(this.List.length>0 && this.currentPage==1){
              window.location.reload();
            }
           }
           this.nextPageLoading = false;
           this.nftItems.splice(0)
           this.filterAndShowCard(this.Creators,filter);  
        }else{
          window.location.reload();
        }
      })
    }
  }

  public getAllNFTs(filter) {
   // window.location.reload();
    this.nftItems.splice(0)
    console.log("hwere did this come from------------------")
    if(!this.loading) {
      this.nextPageLoading = true;
    }
    //this.List.splice(0)
   // this.nftItems.splice(0);
    console.log("blockchain is: ",this.selectedBlockchain)
    this.nft.getNFTpaginated(this.selectedBlockchain, this.currentPage).subscribe(async(data:any) => {
      console.log("----------------paginated data", data)
      if(data.Response.content==null){
        console.log("result is null")
         //this.nftItems.splice(0)
        // this.getAllNFTs()
        window.location.reload();
      }else{
        console.log("result is there")
          this.nfts = data;
          // if(this.filterChanged) {
          //   this.nftItems = [];
          //   this.filterChanged = false;
          // }
          this.nftItems.splice(0)
           for(let a=0; a<this.nfts.Response.content.length; a++){
            // if(this.selectedFilter === 'all') {
              if(this.nfts.Response.content[a].sellingstatus === 'Minted' || this.nfts.Response.content[a].sellingstatus === 'ON SALE' || this.nfts.Response.content[a].sellingstatus === 'NOTFORSALE') {
                console.log("minted nft: ",this.nfts.Response.content[a])
                this.nftItems.push(this.nfts.Response.content[a]);
              }
             //}


          }
           console.log("this nft items:", this.nftItems)
          this.nextPageLoading = false;
                this.filterAndShowCard(this.nftItems,filter);
        }
    });
  }

  intersectionObserver(filter:string) {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.nfts.Response.PaginationInfo.nextpage !== 0) {
          this.currentPage++;
          this.getAllNFTs(filter);
        }
      }
    }, option);
  }

  intersectionFilterObserver(filter:string) {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if(filter == 'onsale'){
          if (this.sales.Response.PaginationInfo.nextpage !== 0) {
            this.currentPage++;
            this.Filters(filter);
          }
        }else if(filter == 'hotpicks'){
          if (this.hotpicks.Response.PaginationInfo.nextpage !== 0) {
            this.currentPage++;
            this.Filters(filter);
          }
        }else if(filter == 'trending'){
          if (this.trends.Response.PaginationInfo.nextpage !== 0) {
            this.currentPage++;
            this.Filters(filter);
          }
        }else if(filter == 'uptodate'){
          if (this.uptodates.Response.PaginationInfo.nextpage !== 0) {
            this.currentPage++;
            this.Filters(filter);
          }
        }else if(filter == 'bestcreators'){
          if (this.creators.Response.PaginationInfo.nextpage !== 0) {
            this.currentPage++;
            this.Filters(filter);
          }
        }else{
          alert("Invalid statement!")
        }
        
      }
    }, option);
  }

  public back() {
    this._location.back();
  }

  public toggleView(element : any) {
    this.isNftItem = true;
    document.getElementById(element)?.classList.add('overlay-hide');
  }

  /* @HostListener('document:click')
  clickedOut() {
    if(this.isNftItem) {
      this.isNftItem = false;
    }
    else {
      const arr = document.getElementsByClassName('nft-img-overlay');
      for(let i = 0; i < arr.length; i++) {
        arr[i].classList.remove('overlay-hide');
      }
    }
  } */


}
