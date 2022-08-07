import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent implements OnInit {
  watchlist: any;
  favourites: any;
  uptodates: any;
  defaultResult: any;
  nfts: any;
  Decryption: any;
 
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

  constructor(
    private api: ApiServicesService,
    private nft: NftServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _sanitizer: DomSanitizer 
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
        alert("Added to Favourites!")
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
        alert("Added to WatchList!")
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

  ngOnInit(): void {

    
    this.route.queryParams.subscribe((params) => {
      this.selectedBlockchain = params['blockchain'];
      this.List.splice(0);
    
      this.nft.getNFTByBlockchain(this.selectedBlockchain).subscribe(async (data) => {
            this.nfts = data;
            if(this.nft==null){
              this.ngOnInit()
            }else{
                this.fillCard() 
            }
          });
    });
  }

  public fillCard(){
    for( let x=0; x<(this.nfts.Response.length); x++){
 this.nft.getSVGByHash(this.nfts.Response[x].imagebase64).subscribe((res:any)=>{
      this.Decryption = res.Response.Base64ImageSVG
    this.dec = btoa(this.Decryption);
   var str2 = this.dec.toString(); 
   var str1 = new String( "data:image/svg+xml;base64,"); 
   var src = str1.concat(str2.toString());
   this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
   let card:Card= new Card('','','');
   card.ImageBase64=this.imageSrc
   card.NFTIdentifier=this.nfts.Response[x].nftidentifier
   card.NFTName=this.nfts.Response[x].nftname
     this.List.push(card)
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
  }

  

  public setFilter(filter: string) {
    this.List.splice(0);
    this.selectedFilter = filter;
    this.nft.getNFTByBlockchain(this.selectedBlockchain).subscribe(async (data) => {
      this.nfts = data;
     
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
    });
  }

  public back() {
    this._location.back();
  }

  
}
