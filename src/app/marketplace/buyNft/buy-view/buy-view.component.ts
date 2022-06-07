import { Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { FreighterComponent } from './../../../wallet/freighter/freighter.component';
import { UserWallet } from 'src/app/models/userwallet';
import { Component, OnInit } from '@angular/core';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { NFTMarket,SalesBE,BuyNFTGW, GetNFT } from 'src/app/models/nft';
import { environment } from 'src/environments/environment';
import { TrustLineByBuyerServiceService } from 'src/app/services/blockchain-services/stellar-services/trust-line-by-buyer-service.service';
import { BuyNftServiceService } from 'src/app/services/blockchain-services/stellar-services/buy-nft-service.service';
import { Trac2buyerService } from 'src/app/services/blockchain-services/solana-services/trac2buyer.service';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SVG, TXN } from 'src/app/models/minting';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { clusterApiUrl, Connection,Transaction as solanaTransaction } from '@solana/web3.js';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { TransferNftService } from 'src/app/services/blockchain-services/solana-services/transfer-nft.service';

@Component({
  selector: 'app-buy-view',
  templateUrl: './buy-view.component.html',
  styleUrls: ['./buy-view.component.css']
})
export class BuyViewComponent implements OnInit {
  isLoadingPresent: boolean;
  loading:any;
  imageSrc: any;
  NFTList:any;
  nft:NFTMarket=new NFTMarket('','','','','','','','','','','','','','','','','','','','','','','','','')
  saleBE:SalesBE=new SalesBE('','','','','','','')
  buyGW:BuyNFTGW=new BuyNFTGW('','','','')
  nftbe:GetNFT=new GetNFT('','','','','','','','','','','','','','','','','','','','','','','','','')
  signerSK="SBKFJD35H4EZBMBELBB7SZQR4ZZ2H5WMRO4N6KWALXMF63DWJVMR2K5D"
  newATA: any;
  Decryption:any;
  buytxn:any;
  svg:SVG=new SVG('','','NA','')
  txn:TXN = new TXN('','','','','','')
  dec: string;
  transaction:Uint8Array;
  signer:Uint8Array
  constructor(private service:NftServicesService,
    private trust:TrustLineByBuyerServiceService,
    private buyNftService:BuyNftServiceService,
    private ata:Trac2buyerService,
    private _sanitizer: DomSanitizer,
    private emarket:EthereumMarketServiceService,
    private pmarket:PolygonMarketServiceService,
    private apiService:ApiServicesService,
    private transfer:TransferNftService
    ) { }  
  buyNFT():void{
   this.updateBackend();
  }

  async updateBackend():Promise<void>{
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
     
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
      let phantomWallet = new UserWallet()
      phantomWallet = new PhantomComponent(phantomWallet)
      await phantomWallet.initWallelt()

      this.saleBE.SellingType="NFT"
      this.saleBE.MarketContract="Not Applicable"
      this.saleBE.NFTIdentifier=this.NFTList.nftidentifier

      this.transfer.createATA(environment.fromWalletSecret,parseInt(this.NFTList.currentprice),phantomWallet.getWalletaddress(),this.NFTList.nftissuerpk,this.NFTList.nftidentifier).then(async(res:solanaTransaction)=>{
        console.log("result is ",res)
        this.buytxn=res;
        this.saveTXNs()
        this.service.updateNFTStatusBackend(this.saleBE).subscribe();
        this.updateGateway();
        
          
      }
    )

      this.ata.createATA(environment.fromWalletSecret,parseInt(this.NFTList.currentprice),phantomWallet.getWalletaddress(),this.NFTList.nftissuerpk,this.NFTList.nftidentifier).then(async (result:solanaTransaction)=>{
      
        try{
      
            const { signature } = await (window as any).solana.signAndSendTransaction(result);
            await connection.confirmTransaction(signature);
            alert("Sucessfully Bought!!!")
            
        }catch(err){
          alert(err)
        }
        })
       }
    if(this.NFTList.blockchain=='polygon'){
      this.saleBE.MarketContract=environment.contractAddressMKPolygon
      this.saleBE.NFTIdentifier=this.nftbe.NFTIdentifier
      this.saleBE.SellingType=this.NFTList.sellingtype
     
      this.pmarket.BuyNFT(environment.contractAddressNFTPolygon,parseInt(this.NFTList.sellingtype),parseInt(this.NFTList.currentprice)).then(res=>{
        this.buytxn=res.transactionHash;
        this.saveTXNs()
        this.service.updateNFTStatusBackend(this.saleBE).subscribe();
        this.updateGateway();
      })
      
    }
    if(this.NFTList.blockchain=='ethereum'){
      this.saleBE.MarketContract=environment.contractAddressMKEthereum
      this.saleBE.NFTIdentifier=this.nftbe.NFTIdentifier
      this.saleBE.SellingType=this.NFTList.sellingtype
      this.emarket.BuyNFT(environment.contractAddressNFTEthereum,parseInt(this.NFTList.sellingtype),parseInt(this.NFTList.currentprice)).then(res=>{
        this.buytxn=res.transactionHash;
        this.saveTXNs()
        this.service.updateNFTStatusBackend(this.saleBE).subscribe();
        this.updateGateway();
      })
    }
  }

  updateGateway():void{
    this.buyGW.CurrentOwnerNFTPK="0xD85E667594EC848895466Fb702D35F6111f258e8"
    this.buyGW.PreviousOwnerNFTPK=this.NFTList.distributorpk
    this.buyGW.SellingStatus="NOT FOR SALE"
    this.buyGW.NFTTXNhash=this.NFTList.nfttxnhash
    this.service.updateNFTBuyStatusGateway(this.buyGW.SellingStatus,this.buyGW.CurrentOwnerNFTPK,this.buyGW.PreviousOwnerNFTPK,this.buyGW.NFTTXNhash).subscribe()
  }

  saveTXNs():void{
  this.txn.Blockchain=this.NFTList.blockchain;
  this.txn.ImageURL=this.NFTList.imagebase64;
  this.txn.NFTIdentifier=this.NFTList.nftidentifier;
  this.txn.NFTName=this.NFTList.nftname;
  this.txn.NFTTxnHash=this.buytxn;
  this.txn.Status=this.NFTList.sellingstatus;
  
  this.apiService.addTXN(this.txn).subscribe();
  }

  async buyNFTOnStellar():Promise<void>{
    let walletf = new UserWallet()
    walletf = new FreighterComponent(walletf)
    await walletf.initWallelt()
    let userPK =await walletf.getWalletaddress()
     this.trust.trustlineByBuyer(this.NFTList.nftname,this.NFTList.nftissuerpk,userPK,this.NFTList.currentprice).then((transactionResult: any) => {
       if (transactionResult.successful) {
        this.buyNftService.buyNft(//step 2. - mint
         // transactionResult.successful,
          this.NFTList.nftname,
          this.NFTList.nftissuerpk,
          this.NFTList.distributorpk,
          userPK,
          this.NFTList.currentprice
         )
          .then((nft:any) => {
            if (this.isLoadingPresent) {
              this.dissmissLoading();
            }
            this.buytxn=nft.hash;
            this.saveTXNs();
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


  

  dissmissLoading() {
    this.isLoadingPresent = false;
    this.loading.dismiss();
  }


  ngOnInit(): void {
    this.nftbe.Blockchain="solana";
    this.nftbe.NFTIdentifier="ANkqbw8wbZPhffocb28D1Dbjtzd4ctVe1icm5YPqDJfq";
   this.nftbe.SellingStatus="ON SALE";
    if (this.nftbe.NFTIdentifier!=null && this.nftbe.SellingStatus=="ON SALE" && this.nftbe.Blockchain=="solana") {
      this.service.getNFTDetails(this.nftbe.NFTIdentifier,this.nftbe.SellingStatus,this.nftbe.Blockchain).subscribe((data:any)=>{
        this.NFTList=data.Response[0];
        
        if(this.NFTList==null){
          this.ngOnInit()
        }
        this.svg.Hash=this.NFTList.imagebase64
        this.service.getSVGByHash(this.svg.Hash).subscribe((res:any)=>{
          this.Decryption = res.Response.Base64ImageSVG
         this.dec = btoa(this.Decryption);
        var str2 = this.dec.toString(); 
        var str1 = new String( "data:image/svg+xml;base64,"); 
        var src = str1.concat(str2.toString());
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
        })

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
