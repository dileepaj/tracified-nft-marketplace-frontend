import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card, Favourites, WatchList } from 'src/app/models/marketPlaceModel';
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
  svg:SVG=new SVG('','','NA')

  imageSrc:any;
  saleNft: any;
  List:any[]=[];
  All:any[]=[];
  Trend:any[]=[];
  HotPick:any[]=[];
  Sale:any[]=[];
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
   /*  const loadingAnimation = this.dialogService.pendingDialog({
      message:"Loading NFTs.."
    }) */

    const timer$ = timer(0,APIConfigENV.homepageIntervalTimer)
    timer$.subscribe(data=>{
      console.log("----------------1")

      this.route.queryParams.subscribe((params) => {
        this.loading = true;
        this.selectedBlockchain = params['blockchain'];
        this.selectedFilter = params['filter'];
        this.List.splice(0);
        this.intersectionObserver();
        this.getAllNFTs();
        });
      interval(APIConfigENV.APIStartDelay).subscribe(data=>{
        this.loading = false;
      })

    })

  }

  public fillCard(){
    for( let x=0; x<(this.nftItems.length); x++){
      this.nft.getSVGByHash(this.nftItems[x].imagebase64).subscribe((res:any)=>{
        this.Decryption = res.Response.Base64ImageSVG
        this.dec = btoa(this.Decryption);
        var str2 = this.dec.toString();
        var str1 = new String( "data:image/svg+xml;base64,");
        var src = str1.concat(str2.toString());
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
        let card:Card= new Card('','','');
        card.ImageBase64=this.imageSrc
        card.NFTIdentifier=this.nftItems[x].nftidentifier
        card.NFTName=this.nftItems[x].nftname
        this.List.push(card);
      })
    }
  }




  public filterAndShowCard(arr:any[]){
    for(let x=0; x<(arr.length);x++){
      this.nft.getSVGByHash(arr[x].imagebase64).subscribe((res:any)=>{
        this.Decryption = res.Response.Base64ImageSVG
        this.dec = btoa(this.Decryption);
      var str2 = this.dec.toString();
      var str1 = new String( "data:image/svg+xml;base64,");
      var src = str1.concat(str2.toString());
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
     let card:Card= new Card('','','');
    card.ImageBase64=this.imageSrc
    card.NFTIdentifier=arr[x].nftidentifier
    card.NFTName=arr[x].nftname
      this.List.push(card)
      })
    }
    this.loading = false;
  }



  public setFilter(filter: string) {
    //this.loading = true;
    //this.List.splice(0);
    this.filterChanged = true;
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: this.selectedBlockchain, filter },
    });
    /* this.nft.getNFTByBlockchain(this.selectedBlockchain).subscribe(async (data) => {
      this.nfts = data;
      console.log(data)

        if(this.selectedFilter=="trending"){
          for( let a=0; a<(this.nfts.Response.length); a++){
            if(this.nfts.Response[a].trending==true){
              this.Trend.push(this.nfts.Response[a])
              this.filterAndShowCard(this.Trend)
            }
          }

        }
        if(this.selectedFilter=="hotpicks"){
          for( let a=0; a<(this.nfts.Response.length); a++){
            if(this.nfts.Response[a].hotpicks==true){
              this.HotPick.push(this.nfts.Response[a])
              this.filterAndShowCard(this.HotPick)
            }
          }

        }
        if(this.selectedFilter=="onsale"){
          this.List.splice(0);
          for( let a=0; a<(this.nfts.Response.length); a++){
            if(this.nfts.Response[a].sellingstatus=='ON SALE'){//chnge to ON SALE
              this.Sale.push(this.nfts.Response[a])
              this.filterAndShowCard(this.Sale)
            }
          }

        }
    }); */
  }

  public getAllNFTs() {
    if(!this.loading) {
      this.nextPageLoading = true;
    }
    this.nft.getNFTpaginated(this.selectedBlockchain, this.currentPage).subscribe(async (data) => {
      console.log("----------------2", data)
          this.nfts = data;
          if(this.filterChanged) {
            this.nftItems = [];
            this.filterChanged = false;
          }
          this.nfts.Response.content.forEach((nft : any) => {

            if(this.selectedFilter === 'onsale') {
              if(nft.sellingstatus === 'ON SALE') {
                this.nftItems.push(nft);
              }
            }
            else if (this.selectedFilter === 'trending'){
              if(nft.trending) {
                this.nftItems.push(nft);
              }
            }
            else if (this.selectedFilter === 'hotpicks'){
              if(nft.hotpicks) {
                this.nftItems.push(nft);
              }
            }else if(this.selectedFilter === 'all') {
              if(nft.sellingstatus === 'Minted') {
                this.nftItems.push(nft);
              }
            }
          })
          if(this.nft==null){
            this.ngOnInit();
          }else{
            this.nextPageLoading = false;
            this.fillCard();
          }
    });
  }

  intersectionObserver() {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.nfts.Response.PaginationInfo.nextpage !== 0) {
          this.currentPage++;
          this.getAllNFTs();
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
