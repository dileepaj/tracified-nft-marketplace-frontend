import { Blockchain } from './../../collections/create-collection/create-collection.component';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from 'rxjs';
import { NFT, Ownership, tags,Issuer,Minter,StellarTXN,Contracts,TXN, UpdateSVG, SVG} from 'src/app/models/minting';
import { MintService } from 'src/app/services/blockchain-services/mint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrustlinesService } from 'src/app/services/blockchain-services/stellar-services/trustlines.service';
import { Properties } from '../../shared/properties';
import { PolygonMintService } from 'src/app/services/contract-services/polygon-mint.service';
import { environment } from 'src/environments/environment';
import { EthereumMintService } from 'src/app/services/contract-services/ethereum-mint.service';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { UserWallet } from 'src/app/models/userwallet';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';

@Component({
  selector: 'app-mint2',
  providers: [MintService,TrustlinesService,Properties],
  templateUrl: './mint2.component.html',
  styleUrls: ['./mint2.component.css']
})
export class Mint2Component implements OnInit { //declaring models and variables
  stxn:StellarTXN=new StellarTXN('','','')
  contract:Contracts=new Contracts('','','','','','','','','','','',"0",'','','','')
  tag:tags=new tags('','','')
  own:Ownership=new Ownership('','','','',1)
  controlGroup: FormGroup;
  issuer:Issuer=new Issuer('');
  solMinter:any
  List:any;
  addSubscription: Subscription;
  isLoadingPresent: boolean;
  loading:any;
  data:any;
  mint:NFT= new NFT('','','','','','',"0",'','','','','','','','','','','','','','','','','',false,false)
  minter:Minter=new Minter('','','','','')
  tokenId: number;
  txn:TXN=new TXN('','','','','','')
  svgUpdate:UpdateSVG =new UpdateSVG ('','')
  svg:SVG=new SVG('','','NA')
  Decryption: any;
  dec: string;
  imageSrc: any;
  userPK: string;
  distributor: any;

  constructor(private route:ActivatedRoute,
     private service:MintService ,
     private trustService:TrustlinesService,
     private pmint:PolygonMintService,
     private emint:EthereumMintService,
     private apiService:ApiServicesService,
     private _sanitizer:DomSanitizer,
     private nft:NftServicesService,
     private router: Router,
     private loaderService:LoaderService,
     private dialogService : DialogService,
     private snackbar : SnackbarServiceService
     ) { }
  
 sendToMint3():void{//getting form data to mint and post

  this.mint.Collection=this.data.Collection;
  this.mint.Copies=this.formValue('Copies');
  this.mint.Categories=this.formValue('Categories');
  this.mint.Tags=this.formValue('Tags');
  this.mint.ArtistName=this.formValue('ArtistName');
  this.mint.ArtistProfileLink=this.formValue('ArtistProfileLink');
  this.mint.CurrentOwnerPK=this.mint.CreatorUserId;
  this.mint.SellingStatus="Minted";
  this.mint.SellingType="NFT";
  this.mint.DistributorPK=this.mint.CreatorUserId;
  this.mint.Status="Minted";
  this.mint.Trending= false,
  this.mint.HotPicks=false;
  //posting of mint data to backend via service
  if (this.mint.CreatorUserId!=null) {
    this.addSubscription = this.service.addNFTBE(this.mint).subscribe();
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
}
}

pushTag():void{//posting tag data via service to backend
    this.tag.NFTName=this.mint.NFTName;
    this.tag.userId=this.mint.CreatorUserId;
    this.tag.tags=this.mint.Tags;
    this.addSubscription=this.service.addTags(this.tag).subscribe();
}

saveTXNs():void{
this.txn.Blockchain=this.mint.Blockchain;
this.txn.ImageURL=this.mint.Imagebase64;
this.txn.NFTIdentifier=this.mint.NFTIdentifier;
this.txn.NFTName=this.mint.NFTName;
this.txn.NFTTxnHash=this.mint.NFTTxnHash;
this.txn.Status="Minted";

this.apiService.addTXN(this.txn).subscribe();
}

 async getIssuer():Promise<void>{//minting according to blockchain
  console.log("data : ",this.data)
  this.mint.Blockchain=this.formValue('Blockchain');
  this.mint.NFTName=this.data.NFTName;
  this.mint.NftContentURL=this.formValue('NftContentURL');
  this.mint.Imagebase64=this.data.NftContentURL;
  this.mint.Description=this.data.Description;
  this.svgUpdate.Id=this.data.svg.Id;
  console.log("svg ID recived: ",this.svgUpdate.Id)

  if(this.mint.Blockchain =="stellar"){//minting if blockchain == stellar
    this.service.createIssuer().subscribe(async (data:any)=>{
      this.mint.NFTIssuerPK=data.NFTIssuerPK;
      this.mint.NFTIdentifier=this.mint.NFTIssuerPK;
      console.log("stellar NFT issuer : ",this.mint.NFTIssuerPK)
      this.svg = this.data.svg;
      this.svg.blockchain="stellar"
      this.apiService.addSVG(this.svg).subscribe()
      if (this.mint.NFTIssuerPK !=null){
         
         let freighter = new UserWallet();
         freighter = new FreighterComponent(freighter);
         await freighter.initWallelt();
         this.userPK =await freighter.getWalletaddress();
         this.mint.CreatorUserId=this.userPK;
         this.apiService.getEndorsement(this.userPK).subscribe((res:any)=>{
          console.log("result is :", res)
          if(res.Status==null || res.Status==""){
            console.log("--------------------------")
            this.dialogService.confirmDialog({
              title: "Public Key Endorsment",
              message:"Your account is not endorsed. Would you like to get your account Endorsed now",
              confirmText : "Yes",
              cancelText:"No"
            }).subscribe(res=>{
              if(res){
                //alert("You are not endorsed. Get endorsed now")
                this.router.navigate(['./signUp'],{
                  queryParams:{data:JSON.stringify(this.mint.Blockchain)}
                  });
              }
            })
            
          }else{
            this.sendToMint3()
            this.mintNFT(this.userPK)       
          }
         })
        
    }
   })
  }

  if(this.mint.Blockchain =="solana"){//minting if blockchain == solana
    let phantomWallet = new UserWallet();
    phantomWallet = new PhantomComponent(phantomWallet);
    await phantomWallet.initWallelt()
    this.mint.NFTIssuerPK=phantomWallet.getWalletaddress();
    this.mint.NFTIdentifier=this.mint.NFTIssuerPK;
    this.mint.CreatorUserId=this.mint.NFTIssuerPK;
    this.svg = this.data.svg;
    this.svg.blockchain="solana"
    this.apiService.addSVG(this.svg).subscribe()
    //this.apiService.updateSVGBlockchain(this.svgUpdate)
    this.apiService.getEndorsement(this.mint.NFTIssuerPK).subscribe((res:any)=>{
      console.log("result is :", res)
      if(res.Status==null || res.Status==""){
        this.dialogService.confirmDialog({
          title: "Public Key Endorsment",
          message:"Your account is not endorsed. Would you like to get your account Endorsed now",
          confirmText : "Yes",
          cancelText:"No"
        }).subscribe(res=>{
          if(res){
            //alert("You are not endorsed. Get endorsed now")
            this.router.navigate(['./signUp'],{
              queryParams:{data:JSON.stringify(this.mint.Blockchain)}
              });
          }
        })
      }else{
        console.log("------------solananananananana--------------")
        this.sendToMint3()
        this.mintNftSolana(this.mint.NFTIssuerPK)
       
      }
    });
 }


  if(this.mint.Blockchain =="ethereum"){//minting if blockchain == ethereum
    this.loaderService.isLoading.next(true)
    console.log("This is for ethereum")
    let metamask = new UserWallet();
    metamask = new MetamaskComponent(metamask)
    await metamask.initWallelt()
    this.mint.NFTIssuerPK=metamask.getWalletaddress();
    this.mint.DistributorPK=metamask.getWalletaddress();
    this.mint.MintedContract=environment.contractAddressNFTEthereum;
    this.mint.MarketContract=environment.contractAddressMKEthereum;
    this.mint.CreatorUserId=this.mint.DistributorPK;
    this.svg = this.data.svg;
    this.svg.blockchain="ethereum"
    this.apiService.addSVG(this.svg).subscribe()
    this.apiService.getEndorsement(this.mint.DistributorPK).subscribe((res:any)=>{
      console.log("result is :", res)
      if(res.Status==null || res.Status==""){
        this.dialogService.confirmDialog({
          title: "Public Key Endorsment",
          message:"Your account is not endorsed. Would you like to get your account Endorsed now",
          confirmText : "Yes",
          cancelText:"No"
        }).subscribe(res=>{
          if(res){
            //alert("You are not endorsed. Get endorsed now")
            this.router.navigate(['./signUp'],{
              queryParams:{data:JSON.stringify(this.mint.Blockchain)}
              });
          }
        })
      }else{
        this.emint.mintInEthereum(this.mint.NFTIssuerPK,this.mint.NFTName,this.mint.Description,this.mint.NftContentURL,this.mint.Imagebase64,)
        .then(async res => {
          this.mint.NFTTxnHash = res.transactionHash;
          this.tokenId=parseInt(res.logs[0].topics[3]);
          this.mint.NFTIdentifier=this.tokenId.toString() 
          this.sendToMint3();
          this.saveContractInGateway();
          this.saveTXNs()
        })
      }
    });
    
  }

  if(this.mint.Blockchain =="polygon"){//minting if blockchain == polygon
    console.log("This is for polygon")
    let metamask = new UserWallet();
    metamask = new MetamaskComponent(metamask)
    await metamask.initWallelt()
   this.mint.NFTIssuerPK=metamask.getWalletaddress();
   this.mint.DistributorPK=metamask.getWalletaddress();
   this.mint.MintedContract=environment.contractAddressNFTPolygon;
   this.mint.MarketContract=environment.contractAddressMKPolygon;
   this.mint.CreatorUserId=this.mint.DistributorPK;
   console.log("mint polygon contreact: ",this.mint.MintedContract)
   console.log("market polygon contreact: ",this.mint.MarketContract)
   this.svg = this.data.svg;
   this.svg.blockchain="polygon"
   this.apiService.addSVG(this.svg).subscribe()
   this.apiService.getEndorsement(this.mint.DistributorPK).subscribe((res:any)=>{
    console.log("result is :", res)
    if(res.Status==null || res.Status==""){
      this.dialogService.confirmDialog({
        title: "Public Key Endorsment",
        message:"Your account is not endorsed. Would you like to get your account Endorsed now",
        confirmText : "Yes",
        cancelText:"No"
      }).subscribe(res=>{
        if(res){
          //alert("You are not endorsed. Get endorsed now")
          this.router.navigate(['./signUp'],{
            queryParams:{data:JSON.stringify(this.mint.Blockchain)}
            });
        }
      })
    }else{
      this.pmint.mintInPolygon(this.mint.NFTIssuerPK,this.mint.Imagebase64)
      .then(res => {
       this.mint.NFTTxnHash = res.transactionHash;
       this.tokenId=parseInt(res.logs[0].topics[3]);
       this.mint.NFTIdentifier=this.tokenId.toString()
       //this.apiService.updateSVGBlockchain(this.svgUpdate)
      this.sendToMint3();
      this.saveContractInGateway();
      this.saveTXNs()
      this.loaderService.isLoading.next(false)
     })
    }
  });  
  }
  
 }

saveContractInGateway(){
  this.contract.Asset_code=this.mint.NFTName;
  this.contract.ArtistLink=this.mint.ArtistProfileLink;
  this.contract.ArtistName=this.mint.ArtistName;
  this.contract.Categories=this.mint.Categories;
  this.contract.Collection=this.mint.Collection;
  this.contract.Copies=this.mint.Copies;
  this.contract.Description=this.mint.Description;
  this.contract.MarketplaceContract=this.mint.MarketContract;
  this.contract.MintNFTTxn=this.mint.NFTTxnHash;
  this.contract.NFTBlockChain=this.mint.Blockchain;
  this.contract.NFTContract=this.mint.MintedContract;
  this.contract.NFTLinks=this.mint.NftContentURL;
  this.contract.NFTURL=this.mint.Imagebase64;
  this.contract.OwnerPK=this.mint.CreatorUserId;
  this.contract.Tags=this.mint.Tags;
  this.contract.Identifier=this.mint.NFTIdentifier
  this.service.addNFTGW(this.contract).subscribe(res=>{
    this.router.navigate(['./getNft'],{
      queryParams:{data:JSON.stringify( this.mint.MarketContract)}
      });
  });

}

updateMinter():void{
  if (this.minter.NFTIssuerPK!=null){
    this.service.updateNFTSolana(this.minter).subscribe(res=>{
      this.saveTXNs()
      this.router.navigate(['./getNft'],{
        queryParams:{data:JSON.stringify(this.distributor)}
        });
    });
  }else{
  this.Minter()
 }
}

updateStellarTXN():void{
  if (this.stxn.NFTTxnHash!=null){
    this.service.updateTXNStellar(this.stxn).subscribe(res=>{
      this.saveTXNs()
      this.router.navigate(['./getNft'],{
        queryParams:{data:JSON.stringify(this.userPK)}
      });
    });
  }else{
  this.TXNStellar()
 }
}

  Minter():void{
    if(this.mint.Imagebase64!=null){
      this.minter.ImageBase64=this.data.NftContentURL;
      this.minter.Blockchain=this.mint.Blockchain
      this.service.getMinter(this.minter.ImageBase64,this.minter.Blockchain).subscribe((data:any)=>{
      console.log("Solana minter data retreived : ",data)
      if(data==null){
        console.log("NO DATA YET")
        this.Minter()
      }
      this.mint.NFTIssuerPK=data.NFTIssuerPK;
      this.mint.NFTTxnHash=data.NFTTxnHash;
      this.minter.NFTIssuerPK=this.mint.NFTIssuerPK;
      this.minter.NFTTxnHash=this.mint.NFTTxnHash
      this.minter.NFTIdentifier=data.NFTIdentifier;
      this.distributor=data.CreatorUserID
      this.updateMinter()
    })
  }
  }

  TXNStellar():void{
    if(this.mint.Imagebase64!=null){
      this.stxn.ImageBase64=this.data.NftContentURL;
      this.stxn.Blockchain = this.mint.Blockchain;
      this.service.getStellarTXN(this.stxn.ImageBase64,this.stxn.Blockchain).subscribe((txn:any)=>{
      console.log("Stellar Txn mint response : ",txn)
      if(txn==null){
        this.TXNStellar()
      }
      this.mint.NFTTxnHash=txn.NFTTxnHash;
      this.stxn.NFTTxnHash=this.mint.NFTTxnHash
      this.updateStellarTXN()
    })
  }
  }

  mintNFT(userPK:string):void{//minting nft using stellar 
    if (this.mint.CreatorUserId!=null) {//step 1. - change trust by distributor
      this.trustService.changeTrustByDistributor(this.mint.NFTName,this.mint.NFTIssuerPK,userPK).then((transactionResult: any) => {
        if (transactionResult.successful) {
          this.service.minNFTStellar(//step 2. - mint
            transactionResult.successful,
            this.mint.NFTIssuerPK,
            userPK,
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
           ).then(res=>{
            this.TXNStellar()
           })
            .then(nft => {
              if (this.isLoadingPresent) {
                this.dissmissLoading();
              }
              //this.mint.NFTName="";
             
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
    this.data=JSON.parse(params['data']);
    console.log("DATA recived: ",this.data)
    console.log("svg hash: ",this.data.svg.Base64ImageSVG)
    this.List=this.data
    //this.nft.getSVGByHash(this.data.NftContentURL).subscribe((res:any)=>{
      this.Decryption = this.data.svg.Base64ImageSVG
    this.dec = btoa(this.Decryption);
   var str2 = this.dec.toString(); 
   var str1 = new String( "data:image/svg+xml;base64,"); 
   var src = str1.concat(str2.toString());
   this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
  //  })
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

  mintNftSolana(ownerPK : string){
    console.log("before minting and sending gatway", ownerPK)
    return new Promise((resolve, reject) => {
      this.service.minNFTSolana( 
        ownerPK,//distributer Public key
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
          console.log("Starting this.minter()")
          this.Minter()
        }).catch(error => {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
        })
    });
  }

}

