import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from 'rxjs';
import { NFT, Ownership, tags,Issuer,Minter} from 'src/app/models/minting';
import { MintService } from 'src/app/services/blockchain-services/mint.service';
import { ActivatedRoute } from '@angular/router';
import { TrustlinesService } from 'src/app/services/blockchain-services/stellar-services/trustlines.service';
import { Properties } from '../../shared/properties';
import { PolygonMintService } from 'src/app/services/contract-services/polygon-mint.service';
import { environment } from 'src/environments/environment';
import { EthereumMintService } from 'src/app/services/contract-services/ethereum-mint.service';


@Component({
  selector: 'app-mint2',
  providers: [MintService,TrustlinesService,Properties],
  templateUrl: './mint2.component.html',
  styleUrls: ['./mint2.component.css']
})
export class Mint2Component implements OnInit { //declaring models and variables
  tag:tags=new tags('','','')
  own:Ownership=new Ownership('','','','',1)
  controlGroup: FormGroup;
  issuer:Issuer=new Issuer('');
  solMinter:any
  addSubscription: Subscription;
  isLoadingPresent: boolean;
  loading:any;
  signerSK ="SAUD6CUMHSDAN2LTOUGLZLSB2N6YDMYUVKP22RYYHEHYUW5M5YKFWUX4"
  data:any;
  mint:NFT= new NFT('','','','','','',0,'','','','','','','','','','','','','','','','')
  minter:Minter=new Minter('','')

  constructor(private route:ActivatedRoute, private service:MintService ,private trustService:TrustlinesService,private pmint:PolygonMintService,private emint:EthereumMintService) { }
  
 sendToMint3():void{//getting form data to mint and post

  this.mint.Collection=this.data.Collection;
  this.mint.Copies=this.formValue('Copies');
  this.mint.Categories=this.formValue('Categories');
  this.mint.Tags=this.formValue('Tags');
  this.mint.ArtistName=this.formValue('ArtistName');
  this.mint.ArtistProfileLink=this.formValue('ArtistProfileLink');
  this.mint.NFTIdentifier="";
  this.mint.CreatorUserId="A101";
  this.mint.CurrentOwnerPK=this.mint.CreatorUserId;
  this.mint.SellingStatus="";
  this.mint.SellingType="NFT";
  this.mint.DistributorPK=this.mint.CreatorUserId;
  this.mint.Status=""
 
  console.log(this.mint)

  //posting of mint data to backend via service
  if (this.mint.CreatorUserId!=null) {
    this.addSubscription = this.service.addNFT(this.mint).subscribe();
    console.log(this.addSubscription);

 }
 this.pushOwner()//calling function
 this.pushTag()//calling fnction
}

pushOwner():void{//posting owner data via service to backend
this.own.NFTIdentifier=this.mint.NFTIdentifier;
this.own.CurentOwnerPK=this.mint.CurrentOwnerPK;
this.own.PreviousOwnerPK="none";
this.own.Status=this.mint.Status;
this.own.OwnerRevisionID=1;
if (this.mint.CreatorUserId!=null) {
  this.addSubscription = this.service.addOwner(this.own).subscribe();
  console.log(this.addSubscription);
}
}

pushTag():void{//posting tag data via service to backend
    this.tag.NFTName=this.mint.NFTName;
    this.tag.userId=this.mint.CreatorUserId;
    this.tag.tags=this.mint.Tags;
    this.addSubscription=this.service.addTags(this.tag).subscribe();
    console.log(this.addSubscription);
}

 getIssuer():void{//minting according to blockchain
  this.mint.Blockchain=this.formValue('Blockchain');
  this.mint.NFTName=this.data.NFTName;
  this.mint.NftContentURL=this.formValue('NftContentURL');
  this.mint.Imagebase64="sonewwllpl16909022j";
  this.mint.Description=this.data.Description;
  if(this.mint.Blockchain =="stellar"){//minting if blockchain == stellar
  
    this.service.createIssuer().subscribe((data:any)=>{
      console.log("Data was retrieved",data)
      this.mint.NFTIssuerPK=data.NFTIssuerPK;
      if (this.mint.NFTIssuerPK !=null){
         console.log("-----------------------Stellar Issuer---------------------------",this.mint.NFTIssuerPK)
         this.sendToMint3()
         this.mintNFT()
     }
    })
  }

  if(this.mint.Blockchain =="solana"){//minting if blockchain == solana
    console.log("This is for solana")
    this.mint.NFTIssuerPK="still to be generated as minter token";
    this.sendToMint3()
    this.mintNftSolana()
 }

  if(this.mint.Blockchain =="ethereum"){//minting if blockchain == ethereum
    console.log("This is for ethereum")
    this.mint.NFTIssuerPK="0x999C020c60CFE6d1BCA6C4d540FA9Dac1F16C163";
    this.mint.DistributorPK="0xD85E667594EC848895466Fb702D35F6111f258e8";
    this.mint.MintedContract=environment.contractAddressNFTEthereum;
    this.emint.mintInEthereum(this.mint.DistributorPK,this.mint.NFTName,this.mint.NftContentURL,this.mint.Description,this.mint.NftContentURL);
    this.sendToMint3();
  }

  if(this.mint.Blockchain =="polygon"){//minting if blockchain == polygon
    console.log("This is for polygon")
   this.mint.NFTIssuerPK="0x999C020c60CFE6d1BCA6C4d540FA9Dac1F16C163";
   this.mint.DistributorPK="0xD85E667594EC848895466Fb702D35F6111f258e8";
   this.mint.MintedContract=environment.contractAddressNFTPolygon;
   this.mint.MarketContract=environment.contractAddressMKPolygon;
   this.pmint.mintInPolygon(this.mint.DistributorPK,this.mint.Imagebase64);
   this.sendToMint3();
  }
  
 }

updateMinter():void{
  if (this.minter.NFTIssuerPK!=null){
    console.log("this minter -------whats sent---------",this.minter)
    this.service.updateNFT(this.minter).subscribe();
  }else{
  this.Minter()
  console.log("Retrying....")
 }
}

  Minter():void{
    if(this.mint.Imagebase64!=null){
      this.minter.ImageBase64=this.mint.Imagebase64;
      this.service.getMinter(this.minter.ImageBase64).subscribe((data:any)=>{
      console.log("Data was retrieved",data)
      this.mint.NFTIssuerPK=data;
      this.minter.NFTIssuerPK=this.mint.NFTIssuerPK;
      this.updateMinter()
    })
  }
  }

  mintNFT():void{//minting nft using stellar 
    if (this.mint.CreatorUserId!=null) {//step 1. - change trust by distributor
      this.trustService.changeTrustByDistributor(this.mint.NFTName,this.mint.NFTIssuerPK,this.signerSK).then((transactionResult: any) => {
        if (transactionResult.successful) {
          this.service.minNFTStellar(//step 2. - mint
            transactionResult.successful,
            this.mint.NFTIssuerPK,
            'GALRVGEUDFELLDOXNAFNZVY4TPB3THXPJQUY3ZRIYE4YAHE7BAG22YFZ',
            this.mint.NFTName,
            this.mint.Imagebase64,
            this.mint.Description,
            this.mint.Collection,
            this.mint.Blockchain,
            this.mint.Tags,
            this.mint.Categories,
            this.mint.Copies,
            this.mint.NftContentURL,
            transactionResult.created_at,
            this.mint.ArtistName,
            this.mint.ArtistProfileLink
           )
            .then(nft => {
              if (this.isLoadingPresent) {
                this.dissmissLoading();
              }
              this.mint.NFTName="";
            }).catch(error => {
              if (this.isLoadingPresent) {
                this.dissmissLoading();
              }
            })
        }
        else {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
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


  ngOnInit(): void {//retrieving data from mint component
   this.route.queryParams.subscribe((params)=>{
    console.log(params);
    this.data=JSON.parse(params['data']);
    console.log("---------------------",this.data)
   })
   
    this.controlGroup = new FormGroup({//validation
      Blockchain: new FormControl(this.mint.Blockchain, Validators.required),
      Categories: new FormControl(this.mint.Categories, Validators.required),
      Copies:new FormControl(this.mint.Copies,Validators.required),
      Tags: new FormControl(this.mint.Tags, Validators.required),
      NftContentURL:new FormControl(this.mint.NftContentURL,Validators.required),
      ArtistName:new FormControl(this.mint.ArtistName,Validators.required),
     ArtistProfileLink: new FormControl(this.mint.ArtistProfileLink,Validators.required),
    });
}

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  mintNftSolana(){
    return new Promise((resolve, reject) => {
      this.service.minNFTSolana( 
        'GALRVGEUDFELLDOXNAFNZVY4TPB3THXPJQUY3ZRIYE4YAHE7BAG22YFZ',
        this.mint.NFTName,
        this.mint.Imagebase64,
        this.mint.Description,
        this.mint.Collection,
        this.mint.Blockchain,
        this.mint.Tags,
        this.mint.Categories,
        this.mint.Copies,
        this.mint.NftContentURL,
        this.mint.ArtistName,
        this.mint.ArtistProfileLink)
         .then(nft => {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          } 
          this.mint.NFTName="";
          this.Minter()
        }).catch(error => {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
        })
    });
  }

}

