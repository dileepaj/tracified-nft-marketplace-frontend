import { Component, OnInit } from '@angular/core';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { NFTMarket } from 'src/app/models/nft';

@Component({
  selector: 'app-view-nft-card',
  templateUrl: './view-nft-card.component.html',
  styleUrls: ['./view-nft-card.component.css']
})
export class ViewNftCardComponent implements OnInit {
NFTList:any;
nft:NFTMarket=new NFTMarket('','','','','','','','','','','','','','','','','','','','','','','','','')
  constructor(private service:NftServicesService) { }
  sell():void{
    
  }

  getNft():void{}
  
  ngOnInit(): void {
    console.log("------------------------loading...")
    this.nft.Identifier="GZPTCQam8YZVrczgEfDvhQw34zWyohAw9wsqBCMzaVuY";
    if (this.nft.Identifier!=null) {
      this.service.getNFTDetails(this.nft.Identifier).subscribe((data:any)=>{
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
