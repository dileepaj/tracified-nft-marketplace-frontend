import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'src/app/models/marketPlaceModel';
import { UserWallet } from 'src/app/models/userwallet';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  selectedBlockchain: string = '';
  nfts:any;
  Trend:any[]=[];
  HotPick:any[]=[];
  Sale:any[]=[];
  Bought:any[]=[];
  Minted:any[]=[];
  ListSales:any[]=[];
  ListBought:any[]=[];
  ListMinted:any[]=[];
  ListTrends:any[]=[];
  ListHotpicks:any[]=[];
  Decryption: any;
  dec: any;
  imageSrc: any;
  User: string;


  constructor(private route: ActivatedRoute,
     private router: Router,
    private nft: NftServicesService,
    private _sanitizer: DomSanitizer ) {}


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

    goToEdit(user){

      this.router.navigate(['./user-dashboard/edit-profile'],{
        queryParams:{data:JSON.stringify(user)}
        });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedBlockchain = params['blockchain']
      console.log("this blockchain: ",this.selectedBlockchain)

      this.router.navigate(['./user-dashboard'], {
        queryParams: { blockchain: this.selectedBlockchain },
      });

      this.ListBought.splice(0);
      this.ListHotpicks.splice(0);
      this.ListMinted.splice(0);
      this.ListTrends.splice(0);
      this.ListSales.splice(0);
      this.retrive(this.selectedBlockchain).then(res=>{
          this.nft.getNFTByBlockchainandUser(this.selectedBlockchain,this.User).subscribe(async (data) => {
        this.nfts = data;
        if(this.nft==null){
          this.ngOnInit()
        }else{
          for( let x=0; x<(this.nfts.Response.length); x++){

            if(this.nfts.Response[x].sellingstatus=="ON SALE"){
              this.FilterByONSALE(this.nfts.Response[x])
            }

            if(this.nfts.Response[x].sellingstatus=="NOTFORSALE"){
              this.FilterByBoughtNFT(this.nfts.Response[x])
            }

            if(this.nfts.Response[x].sellingstatus=="Minted"){
              this.FilterByMinted(this.nfts.Response[x])
            }

            if(this.nfts.Response[x].trending==true){
              this.FilterByTrending(this.nfts.Response[x])
            }

            if(this.nfts.Response[x].hotpicks==true){
              this.FilterByHotpicks(this.nfts.Response[x])
            }

          }
        }
      });})

    });


  }

  FilterByHotpicks(response:any){
   console.log("hotpick arr: ",response)
      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
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
      this.ListHotpicks.push(card)
      console.log("listing hp: ",this.ListHotpicks)
      })
  }

  FilterByONSALE(response:any){
      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
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
      this.ListSales.push(card)
      })
  }

  FilterByMinted(response:any){
      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
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
      this.ListMinted.push(card)
      })
  }

  FilterByBoughtNFT(response:any){
      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
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
      this.ListBought.push(card)
      })
  }

  FilterByTrending(response:any){
      this.nft.getSVGByHash(response.imagebase64).subscribe((res:any)=>{
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
      this.ListTrends.push(card)
      })
  }

  putToSaleafterMint(id:string){
    console.log("image 64 hash : ",id)
    let data : any[] = ["Minted",id,this.selectedBlockchain]
    this.router.navigate(['./sell'],{
      queryParams:{data:JSON.stringify(data)}
    });
  }

  putToSaleafterBought(id:string){
    console.log("image 64 hash : ",id)
    let data : any[] = ["NOTFORSALE",id,this.selectedBlockchain]
    this.router.navigate(['./sell'],{
      queryParams:{data:JSON.stringify(data)}
    });
  }

  routeToBuy(id:string){
    let data :any[]=[id,this.selectedBlockchain];
    this.router.navigate(['./buyNft'],{
    queryParams:{data:JSON.stringify(data)}
    })
  }

  myCollections(id){
    this.router.navigate(['./mycollections'],{
      queryParams:{data:id}
      })
  }

  viewall(status:string){
    this.router.navigate(['/gridnft'], {
      queryParams: { data: [status,this.selectedBlockchain] },
    });
  }

  public scrollLeft(elementId: string) {
    document.getElementById(elementId)!.scrollLeft -= 300;
  }

  public scrollRight(elementId: string) {
    document.getElementById(elementId)!.scrollLeft += 300;
  }

}
