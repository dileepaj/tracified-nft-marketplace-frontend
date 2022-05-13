import { Component, OnInit } from '@angular/core';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { NFTMarket } from 'src/app/models/nft';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-nft-card',
  templateUrl: './view-nft-card.component.html',
  styleUrls: ['./view-nft-card.component.css']
})
export class ViewNftCardComponent implements OnInit {
NFTList:any;
nft:NFTMarket=new NFTMarket('','','','','','','','','','','','','','','','','','','','','','','','','')
  constructor(private service:NftServicesService,private router:Router) { }
  sendToSellNFT():void{
    let data :any=this.NFTList;
    console.log("Before routing -----------------------",data)
   this.router.navigate(['./sell'],{
   queryParams:{data:JSON.stringify(data)}
   })
  }

 
  
  ngOnInit(): void {
    console.log("------------------------loading...")
    this.nft.InitialDistributorPK="9LZCJWkjuecs68RKdvpnG4yckMHKcZ9CGhe9rhgTvyxX";
    if (this.nft.InitialDistributorPK!=null) {
      this.service.getLastNFTDetails(this.nft.InitialDistributorPK).subscribe((data:any)=>{
        console.log("--------------------------------------------------------------------------------------")
        console.log("Data was retrieved",data)
        this.NFTList=data;
        if(this.NFTList==null){
          console.log("retrying...")
          this.ngOnInit()
        }
       if(this.NFTList.NftIssuingBlockchain=="stellar") {
          this.NFTList.NFTIssuerPK=this.NFTList.NFTIssuerPK
       }
       if(this.NFTList.Blockchain=="solana") {
          this.NFTList.NFTIssuerPK=this.NFTList.MinterPK
      }
      if(this.NFTList.Blockchain=="polygon") {
        this.NFTList.NFTIssuerPK=this.NFTList.MintedContract
      }
      if(this.NFTList.Blockchain=="ethereum") {
        this.NFTList.NFTIssuerPK=this.NFTList.MintedContract
      }
      })
    } else {
      console.log("User PK not connected or not endorsed");
    }
  }

}
