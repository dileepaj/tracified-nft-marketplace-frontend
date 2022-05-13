import { Component, OnInit } from '@angular/core';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { NFTMarket,SalesBE,BuyNFTGW, GetNFT } from 'src/app/models/nft';
import { environment } from 'src/environments/environment';
import { TrustLineByBuyerServiceService } from 'src/app/services/blockchain-services/stellar-services/trust-line-by-buyer-service.service';
import { BuyNftServiceService } from 'src/app/services/blockchain-services/stellar-services/buy-nft-service.service';
import { Trac2buyerService } from 'src/app/services/blockchain-services/solana-services/trac2buyer.service';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';

@Component({
  selector: 'app-buy-view',
  templateUrl: './buy-view.component.html',
  styleUrls: ['./buy-view.component.css']
})
export class BuyViewComponent implements OnInit {
  isLoadingPresent: boolean;
  loading:any;
  NFTList:any;
  nft:NFTMarket=new NFTMarket('','','','','','','','','','','','','','','','','','','','','','','','','')
  saleBE:SalesBE=new SalesBE('','','','','','','')
  buyGW:BuyNFTGW=new BuyNFTGW('','','','')
  nftbe:GetNFT=new GetNFT('','','','','','','','','','','','','','','','','','','','','','','','','')
  signerSK="SBKFJD35H4EZBMBELBB7SZQR4ZZ2H5WMRO4N6KWALXMF63DWJVMR2K5D"
  newATA: any;
  constructor(private service:NftServicesService,
    private trust:TrustLineByBuyerServiceService,
    private buyNftService:BuyNftServiceService,
    private ata:Trac2buyerService,
    
    private emarket:EthereumMarketServiceService,
    private pmarket:PolygonMarketServiceService,
    ) { }

  buyNFT():void{
    console.log("-------------------inside buynft------------------")
   this.updateBackend();
  

  }

  updateBackend():void{
    console.log("-------------------inside backend------------------")
    this.saleBE.CurrentPrice=this.NFTList.currentprice
    
    this.saleBE.SellingStatus="NOT FOR SALE"
    this.saleBE.Timestamp="2022-04-21:13:41:00"
    this.saleBE.CurrentOwnerPK="GA6KKDBU4S55QV4T5777DGYJ7WULG7K3RPV5RTSYJ37KBQXJ2OKKIFDL"
    
    if(this.NFTList.blockchain=='stellar'){
      this.saleBE.SellingType="NFT"
      this.saleBE.MarketContract="Not Applicable"
      this.saleBE.NFTIdentifier=this.NFTList.nftissuerpk
      this.service.updateNFTStatusBackend(this.saleBE).subscribe();
      this.buyNFTOnStellar();
      
    }
    if(this.NFTList.blockchain=='solana'){
      this.saleBE.SellingType="NFT"
      this.saleBE.MarketContract="Not Applicable"
      this.saleBE.NFTIdentifier=this.NFTList.nftidentifier
      console.log("MintKey",this.NFTList.nftissuerpk,this.NFTList.nftidentifier)
      //const TOWALLETSECRET="[]byte{10, 75, 10, 90, 145, 78, 142, 248, 104, 3, 36, 7, 69, 207, 109, 98, 82, 58, 146, 202, 44, 188, 70, 70, 64, 173, 35, 130, 18, 133, 107, 236, 231, 43, 70, 165, 182, 191, 162, 242, 126, 119, 49, 3, 231, 43, 249, 47, 228, 225, 70, 91, 254, 22, 160, 42, 20, 186, 184, 196, 240, 151, 157, 207}"
      this.ata.createATA(environment.fromWalletSecret,this.NFTList.nftissuerpk,this.NFTList.nftidentifier).then(res=>{
        console.log("New ATA results",res)
        this.newATA =res;
        this.saleBE.NFTIdentifier=this.newATA;
        this.service.updateNFTStatusBackend(this.saleBE).subscribe();
        this.updateGateway();
      })
      
      // .then(res => {
      //   console.log("----------current owner ATA ",res)
      //   this.getATA.findAssociatedTokenAddress(environment.TRACIFIED_MIDDLE_MAN,this.nftbe.NFTIssuerPK).then(ata => {
      //     this.transfer.transferNFT("",ata,res,this.nftbe.NFTIssuerPK,"")
      //   })
       
      // })
      
    }
    if(this.NFTList.blockchain=='polygon'){
      this.saleBE.MarketContract=environment.contractAddressMKPolygon
      this.saleBE.NFTIdentifier=this.nftbe.NFTIdentifier
      this.saleBE.SellingType=this.NFTList.sellingtype
      console.log("-------------price in ts",this.NFTList.currentprice)
      console.log("-------------itemid in ts",this.NFTList.sellingtype)
      // this.pmarket.BuyNFT(environment.contractAddressNFTPolygon,parseInt(this.NFTList.sellingtype),parseInt(this.NFTList.currentprice)).then(res=>{
      //   console.log("Transaction succesful",res)
        this.service.updateNFTStatusBackend(this.saleBE).subscribe();
        this.updateGateway();
      // })
    }
    if(this.NFTList.blockchain=='ethereum'){
      this.saleBE.MarketContract=environment.contractAddressMKEthereum
      this.saleBE.NFTIdentifier=this.nftbe.NFTIdentifier
      this.saleBE.SellingType=this.NFTList.sellingtype
      console.log("-------------price in ts",this.NFTList.currentprice)
      console.log("-------------itemid in ts",this.NFTList.sellingtype)
      this.emarket.BuyNFT(environment.contractAddressNFTEthereum,parseInt(this.NFTList.sellingtype),parseInt(this.NFTList.currentprice)).then(res=>{
        console.log("Transaction successful",res)
        this.service.updateNFTStatusBackend(this.saleBE).subscribe();
      })
    }
  }

  updateGateway():void{
    console.log("Inside gateway controller")
    this.buyGW.CurrentOwnerNFTPK="0xD85E667594EC848895466Fb702D35F6111f258e8"
    this.buyGW.PreviousOwnerNFTPK=this.NFTList.distributorpk
    this.buyGW.SellingStatus="NOT FOR SALE"
    this.buyGW.NFTTXNhash=this.NFTList.nfttxnhash
    this.service.updateNFTBuyStatusGateway(this.buyGW.SellingStatus,this.buyGW.CurrentOwnerNFTPK,this.buyGW.PreviousOwnerNFTPK,this.buyGW.NFTTXNhash).subscribe()
  }


  buyNFTOnStellar():void{
    console.log("-------------buy control ------------------")
    console.log("creating trustline -----------------",this.NFTList.nftname,this.NFTList.nftissuerpk,this.signerSK,this.saleBE.CurrentOwnerPK,this.NFTList.currentprice)
    this.trust.trustlineByBuyer(this.NFTList.nftname,this.NFTList.nftissuerpk,this.signerSK,this.saleBE.CurrentOwnerPK,this.NFTList.currentprice).then((transactionResult: any) => {
      if (transactionResult.successful) {
        this.buyNftService.buyNft(//step 2. - mint
          transactionResult.successful,
          this.NFTList.nftname,
          this.signerSK,
          this.NFTList.nftissuerpk,
          this.NFTList.distributorpk,
          this.NFTList.currentprice
         )
          .then(nft => {
            if (this.isLoadingPresent) {
              this.dissmissLoading();
            }
            this.NFTList.nftname="";
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
   
  } 


  // buyNFTOnSolana():void{
  //   this.ata.createATA(this.nftbe.DistributorPK,this.NFTList.NFTIssuerPK,this.nftbe.DistributorPK).then((transactionResult: any) => {
  //     if (transactionResult.successful) {
  //       this.transfer.transferNFT(//step 2. - mint
  //         transactionResult.successful,
  //         this.nftbe.NFTName,
  //         'signer',
  //         this.nftbe.NFTIssuerPK,
  //         this.nftbe.DistributorPK,
  //        )
  //         .then(nft => {
  //           if (this.isLoadingPresent) {
  //             this.dissmissLoading();
  //           }
  //           this.nft.NftContentName="";
  //         }).catch(error => {
  //           if (this.isLoadingPresent) {
  //             this.dissmissLoading();
  //           }
  //         })
  //     }
  //     else {
  //       if (this.isLoadingPresent) {
  //         this.dissmissLoading();
  //       }
  //     }
  //   })
   
  // } 

  dissmissLoading() {
    this.isLoadingPresent = false;
    this.loading.dismiss();
  }


  ngOnInit(): void {
    console.log("------------------------loading...")
    this.nftbe.Blockchain="solana";
    this.nftbe.NFTIdentifier="9LZCJWkjuecs68RKdvpnG4yckMHKcZ9CGhe9rhgTvyxX";
   this.nftbe.SellingStatus="ON SALE";
    if (this.nftbe.NFTIdentifier!=null && this.nftbe.SellingStatus=="ON SALE" && this.nftbe.Blockchain=="solana") {
      this.service.getNFTDetails(this.nftbe.NFTIdentifier,this.nftbe.SellingStatus,this.nftbe.Blockchain).subscribe((data:any)=>{
        console.log("--------------------------------------------------------------------------------------")
        console.log("Data was retrieved",data.Response[0])
      // console.log("--------------------checking data",data.Response[0])
        this.NFTList=data.Response[0];
        console.log("-----------",this.NFTList.nftidentifier)
      // this.nftbe=this.NFTList//see models here
      // console.log("-----------",this.nftbe.NFTIdentifier)
        if(this.NFTList==null){
          console.log("retrying...")
          this.ngOnInit()
        }
       if(this.NFTList.Blockchain=="stellar") {
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
