import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Card, Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { SVG } from 'src/app/models/minting';
import { NFTMarket } from 'src/app/models/nft';
import { UserWallet } from 'src/app/models/userwallet';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { MintService } from 'src/app/services/blockchain-services/mint.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nftgrid',
  templateUrl: './nftgrid.component.html',
  styleUrls: ['./nftgrid.component.css']
})
export class NftgridComponent implements OnInit {

  Decryption: any;
  NFTList: any;
  List:any[]=[];
  svg: SVG = new SVG('', '', 'NA');
  favouritesModel: Favourites = new Favourites('', '','');
  watchlistModel: WatchList = new WatchList('', '','');
  nft: NFTMarket = new NFTMarket(
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );
  imageSrc: any;
  dec: string;
  data: any;
  blockchain: any;
  status: any;
  User: string;
  nfts:any;
  constructor(
    private api: ApiServicesService,
    private service: NftServicesService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private route:ActivatedRoute,
    private snackbarService:SnackbarServiceService,
    private mint:MintService,
    private _location: Location,
  ) {}

  async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      this.User= await freighterWallet.getWalletaddress();
     
    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.User = await phantomWallet.getWalletaddress();
     
    }

    if (
      blockchain == 'ethereum' ||
      blockchain == 'polygon'
    ) {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.User = await metamaskwallet.getWalletaddress();
     
    }

  }

  addToWatchList(id:string) {
    this.watchlistModel.Blockchain = this.blockchain;
    this.watchlistModel.NFTIdentifier =id;
    this.retrive(this.watchlistModel.Blockchain).then(res=>{
      this.api.addToWatchList(this.watchlistModel).subscribe(res=>{
        this.snackbarService.openSnackBar("Added to watchlists")
        this.api.getWatchlistByBlockchainAndNFTIdentifier(this.watchlistModel.Blockchain,this.watchlistModel.NFTIdentifier).subscribe(res=>{
        });
      })
     
    })
   
  }

  addToFavourites(id:string) {
    this.favouritesModel.Blockchain = this.blockchain;
    this.favouritesModel.NFTIdentifier = id;
    this.retrive(this.favouritesModel.Blockchain).then(res=>{
      this.api.addToFavourites(this.favouritesModel).subscribe(res=>{
        this.snackbarService.openSnackBar("Added to favourites")
        this.api.getFavouritesByBlockchainAndNFTIdentifier(this.favouritesModel.Blockchain,this.favouritesModel.NFTIdentifier).subscribe(res=>{
        });
      })
     
      
    })
   
  }

  viewNFT(){

  }

  routeToBuy(id:string){
    let data :any[]=[id,this.blockchain];
    this.router.navigate(['./buyNft'],{
    queryParams:{data:JSON.stringify(data)}
    })
  }


  public back() {
    this._location.back();
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = params['data']
      console.log("this data: ",this.data)
      this.status=this.data[0]
      this.blockchain = this.data[1]
      console.log("this data: ",this.blockchain, this.status)

      this.retrive(this.blockchain).then(res=>{ 
        console.log("this data: -----------------------------")
        this.service.getNFTByBlockchainandUser(this.blockchain,this.User).subscribe(async (data) => {
      this.nfts = data;
      console.log("data : ",this.nfts)
      if(this.nft==null){
        this.ngOnInit()
      }else{
        for( let x=0; x<(this.nfts.Response.length); x++){
if(this.status=='Sale'){
  if(this.nfts.Response[x].sellingstatus=="ON SALE"){
    this.Filter(this.nfts.Response[x])
  }
}
        
if(this.status=='Bought'){
          if(this.nfts.Response[x].sellingstatus=="NOTFORSALE"){
            this.Filter(this.nfts.Response[x])
          }
        }

        if(this.status=='Mints'){
          if(this.nfts.Response[x].sellingstatus=="Minted"){
            this.Filter(this.nfts.Response[x])
          }
        }

        if(this.status=='Favourites'){
          if(this.nfts.Response[x].trending==true){
            this.Filter(this.nfts.Response[x])
          }
        }

        if(this.status=='Hotpicks'){
          if(this.nfts.Response[x].hotpicks==true){
            this.Filter(this.nfts.Response[x])
          }
        }

        }
      }
    });})
  })

}

Filter(response:any){
  console.log("hotpick arr: ",response)
     this.service.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
       this.Decryption = res.Response.Base64ImageSVG
       this.dec = btoa(this.Decryption);
     var str2 = this.dec.toString(); 
     var str1 = new String( "data:image/svg+xml;base64,"); 
     var src = str1.concat(str2.toString());
     this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
    let card:Card= new Card('','','');
   card.ImageBase64=this.imageSrc
   card.NFTIdentifier=response.nftidentifier
   card.NFTName=response.nftname
     this.List.push(card)
     console.log("listing hp: ",this.List)
     })
 }

//  FilterByONSALE(response:any){
//      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
//        this.Decryption = res.Response.Base64ImageSVG
//        this.dec = btoa(this.Decryption);
//      var str2 = this.dec.toString(); 
//      var str1 = new String( "data:image/svg+xml;base64,"); 
//      var src = str1.concat(str2.toString());
//      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
//     let card:Card= new Card('','','');
//    card.ImageBase64=this.imageSrc
//    card.NFTIdentifier=response.nftidentifier
//    card.NFTName=response.nftname
//      this.ListSales.push(card)
//      })
//  }

//  FilterByMinted(response:any){
//      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
//        this.Decryption = res.Response.Base64ImageSVG
//        this.dec = btoa(this.Decryption);
//      var str2 = this.dec.toString(); 
//      var str1 = new String( "data:image/svg+xml;base64,"); 
//      var src = str1.concat(str2.toString());
//      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
//     let card:Card= new Card('','','');
//    card.ImageBase64=this.imageSrc
//    card.NFTIdentifier=response.nftidentifier
//    card.NFTName=response.nftname
//      this.ListMinted.push(card)
//      })
//  }

//  FilterByBoughtNFT(response:any){
//      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
//        this.Decryption = res.Response.Base64ImageSVG
//        this.dec = btoa(this.Decryption);
//      var str2 = this.dec.toString(); 
//      var str1 = new String( "data:image/svg+xml;base64,"); 
//      var src = str1.concat(str2.toString());
//      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
//     let card:Card= new Card('','','');
//    card.ImageBase64=this.imageSrc
//    card.NFTIdentifier=response.nftidentifier
//    card.NFTName=response.nftname
//      this.ListBought.push(card)
//      })
//  }

//  FilterByTrending(response:any){
//      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
//        this.Decryption = res.Response.Base64ImageSVG
//        this.dec = btoa(this.Decryption);
//      var str2 = this.dec.toString(); 
//      var str1 = new String( "data:image/svg+xml;base64,"); 
//      var src = str1.concat(str2.toString());
//      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
//     let card:Card= new Card('','','');
//    card.ImageBase64=this.imageSrc
//    card.NFTIdentifier=response.nftidentifier
//    card.NFTName=response.nftname
//      this.ListTrends.push(card)
//      })
//  }


}
