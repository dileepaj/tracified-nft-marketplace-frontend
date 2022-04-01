import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import { NFT ,tags} from 'src/app/models/minting';
import { MintService } from 'src/app/services/blockchain-services/mint.service';
import { TrustlinesService } from 'src/app/services/blockchain-services/stellar-services/trustlines.service';
import { Properties } from '../../shared/properties';
// import { TranslateService ,TranslateStore} from '@ngx-translate/core';


@Component({
  selector: 'app-mint3',
  providers: [MintService,TrustlinesService,Properties],
  templateUrl: './mint3.component.html',
  styleUrls: ['./mint3.component.css']
})
export class Mint3Component implements OnInit {
  data:any;
  
  addSubscription: Subscription;
issuer:any;
  isLoadingPresent: boolean;
  loading:any;
  private properties: Properties

  constructor(private service:MintService, private trustService:TrustlinesService) { }
  mint:NFT
  tag:tags
  signerSK ="SAUD6CUMHSDAN2LTOUGLZLSB2N6YDMYUVKP22RYYHEHYUW5M5YKFWUX4"

  


  save(): void {
    console.log("---------------------------------testing inside mint 3 screen ------------------------")
    this.mint.CreatorUserId="A101";
    this.mint.NftContentURL=this.data.nftLinks;
    this.mint.Collection=this.data.collections;
    this.mint.NFTName=this.data.nftname;
    this.mint.Description=this.data.desc;
    this.mint.Blockchain=this.data.blockchain;
    this.mint.Copies=this.data.copies;
    this.mint.Categories=this.data.categories;
    this.mint.Tags=this.data.tags;
    this.mint.Imagebase64="something";
    this.mint.ArtistName=this.data.artistName;
    this.mint.ArtistProfileLink=this.data.artistProfileLink;
    this.tag.NFTName=this.data.nftname;
    this.tag.userId="A101";
    this.tag.tags=this.data.tags;
   
    console.log("---------------------------------testing inside mint 3 screen data retrived------------------------")
    if (this.mint.CreatorUserId!=null) {
      // console.log("----------------------------test 3-------------------------")
      // this.addSubscription = this.service.add(this.mint).subscribe();
      // console.log(this.addSubscription);
      // this.addSubscription=this.service.addTags(this.tag).subscribe();
      console.log("----------------------------------------minting starts now---------------------------")
      this.trustService.changeTrustByDistributor(this.mint.NFTName,this.mint.NFTIssuerPK,this.signerSK).then((transactionResult: any) => {
        if (transactionResult.successful) {
          this.service.minNFTStellar(
            transactionResult.successful,
            this.mint.NFTIssuerPK,
            this.mint.CreatorUserId,
            this.mint.NFTName,
            this.mint.NftContentURL,
            this.mint.Description,
            this.mint.Collection,
            this.mint.Blockchain,
            this.mint.Tags,
            this.mint.Categories,
            this.mint.Copies,
            this.mint.Imagebase64,
            transactionResult.created_at,
            this.mint.ArtistName,
            this.mint.ArtistProfileLink
           )
            .then(nft => {
              if (this.isLoadingPresent) {
                this.dissmissLoading();
              }
              console.log("NFT was created-----------------------------------and minted-----------")
              // this.translate.get(['MINTED', `NFT ${this.mint.NFTName} WAS MINTED`]).subscribe(text => {
              // console.log("NFT ",this.mint.NFTName," was minted ")
              // });
              this.mint.NFTName="";
            }).catch(error => {
              if (this.isLoadingPresent) {
                this.dissmissLoading();
              }
              console.log("----------------------Incorrect Password-------------------------")
              // this.translate.get(['ERROR', 'INCORRECT_PASSWORD']).subscribe(text => {
              //   console.log("ERROR : Incorrect Password ")
              // });
            })
        }
        else {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
          console.log("---------------------------Incorrect Transaction-------------------")
          // this.translate.get(['ERROR', 'INCORRECT_TRANSACTION']).subscribe(text => {
          //   console.log("ERROR: Incorrect Transaction")
          // });
        }
      })
     
    } else {
      console.log("User PK not connected or not endorsed");
    }
  }

  dissmissLoading() {
    this.isLoadingPresent = false;
    this.loading.dismiss();
  }


  

  ngOnInit(): void {
   
    

   // this.nft=this.service.getMintData()
    this.service.createIssuer().subscribe((data:any)=>{
    console.log("Data was retrieved",data)
    this.issuer=data;
   
  })
 
  this.save();
}

}
