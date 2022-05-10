import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NFTMarket ,SalesBE,SalesGW,Sales} from 'src/app/models/nft';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { SellOfferServiceService } from 'src/app/services/blockchain-services/stellar-services/sell-offer-service.service';
import { CreateAssociateTokenAccountService } from 'src/app/services/blockchain-services/solana-services/create-associate-token-account.service';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { GetAssociatedTokenAccountService } from 'src/app/services/blockchain-services/solana-services/get-associated-token-account.service';
import { TransferNftService } from 'src/app/services/blockchain-services/solana-services/transfer-nft.service';
@Component({
  selector: 'app-sell-nft',
  templateUrl: './sell-nft.component.html',
  styleUrls: ['./sell-nft.component.css']
})
export class SellNftComponent implements OnInit {
  controlGroupSell: FormGroup;
  nft:NFTMarket=new NFTMarket('','','','','','','','','','','','','','','','','','','','','','','','','')
  saleBE:SalesBE=new SalesBE('','','','','','','')
  saleGW:SalesGW=new SalesGW('','','','')
  sale:Sales=new Sales('','')
  royalty:any;
  firstPrice:any;
  royaltyCharge:any;
  sellingPrice:any;
  data: any;
  signer="SAUD6CUMHSDAN2LTOUGLZLSB2N6YDMYUVKP22RYYHEHYUW5M5YKFWUX4"
  tokenid: number;
  itemId: number;
  constructor(private route:ActivatedRoute,
    private service:NftServicesService,
    private stellarService:SellOfferServiceService,
    private middleman:CreateAssociateTokenAccountService,
    private emarket:EthereumMarketServiceService,
    private pmarket:PolygonMarketServiceService,
    private getATA:GetAssociatedTokenAccountService,
    private transfer :TransferNftService) { }

  calculatePrice():void{
    this.royalty=parseInt(this.formValue('Royalty'));
    this.firstPrice=parseInt(this.formValue('Price'));
    this.royaltyCharge=this.firstPrice*(this.royalty/100)
    this.sellingPrice=this.firstPrice+this.royaltyCharge;
    console.log("---------------------selling price-----------",this.sellingPrice)
  }

  addDBBackend():void{
    //this.nft.SellingStatus="ON SALE"
    this.saleBE.SellingStatus="ON SALE"
    this.saleBE.CurrentPrice=this.sellingPrice.toString();
    
    this.saleBE.Timestamp="2022-4-20:17:28"
    this.saleBE.CurrentOwnerPK=this.data.OriginPK
   
    this.service.updateNFTStatusBackend(this.saleBE).subscribe();
    

  }

  addDBGateway():void{
    this.saleGW.Status="ON SALE"
     this.saleGW.Price=this.sellingPrice.toString();
     this.saleGW.NFTTXNhash=this.data.NFTTXNhash
     this.saleGW.Amount=this.data.Copies
     this.service.updateNFTStatusGateway(this.saleGW.Price,this.saleGW.Status,this.saleGW.Amount,this.saleGW.NFTTXNhash).subscribe();
    
  }


Sell():void{
    if(this.data.NftIssuingBlockchain=='stellar'){
      this.saleBE.SellingType="NFT"
      this.saleBE.MarketContract="Not Applicable"
      this.saleBE.NFTIdentifier=this.data.Identifier
      this.calculatePrice()
      this.addDBBackend()
      this.addDBGateway()
      this.stellarService.sellNft(
        this.data.NftContentName,
        this.data.InitialIssuerPK,
        this.signer,
        '1',
        this.sellingPrice)
    }
    if(this.data.NftIssuingBlockchain=='solana'){
      this.saleBE.MarketContract="Not Applicable"
      this.saleBE.SellingType="NFT"
      this.calculatePrice()
      this.saleBE.NFTIdentifier=this.data.Identifier
      if(this.data.CurrentOwnerNFTPK==this.data.OriginPK){
          console.log("Already set for sale")
      }else{
          this.getATA.findAssociatedTokenAddress(environment.TRACIFIED_MIDDLE_MAN,this.data.InitialIssuerPK).then(res=>{
            this.getATA.findAssociatedTokenAddress("owner",this.data.InitialIssuerPK).then(ata=>{
              this.transfer.transferNFT("",res,ata,this.nft.InitialIssuerPK,"").then(res=>{
              //  this.addDB()
              })
            })
           
          })
         
      }
      //this.middleman.createATA(environment.TRACIFIED_MIDDLE_MAN,this.nft.InitialIssuerPK,environment.TRACIFIED_MIDDLE_MAN)

    }
    if(this.data.NftIssuingBlockchain=='polygon'){
      this.saleBE.MarketContract=environment.contractAddressMKPolygon
      this.saleBE.NFTIdentifier=this.data.Identifier
      this.tokenid=parseInt(this.data.Identifier)
      this.calculatePrice()
      
      console.log("-----------------parameters-------",environment.contractAddressNFTPolygon,this.data.ImageBase64,this.sellingPrice)
      this.pmarket.createSaleOffer(environment.contractAddressNFTPolygon,this.tokenid,this.sellingPrice)
      .then(res=>{
        console.log("inside the controller item id",parseInt(res.logs[3].topics[1]))
        this.itemId=parseInt(res.logs[3].topics[1])
        this.saleBE.SellingType=this.itemId.toString();
        this.addDBBackend()
      this.addDBGateway()
      })
    }
    if(this.data.NftIssuingBlockchain=='ethereum'){
      this.saleBE.MarketContract=environment.contractAddressMKEthereum
      this.saleBE.NFTIdentifier=this.data.Identifier
      this.tokenid=parseInt(this.data.Identifier)
      this.calculatePrice()
     
      this.emarket.createSaleOffer(environment.contractAddressNFTEthereum,this.tokenid,this.sellingPrice).then(res=>{
        console.log("inside the controller item id",parseInt(res.logs[2].topics[1]))
        this.itemId=parseInt(res.logs[2].topics[1])
        this.saleBE.SellingType=this.itemId.toString();
        this.addDBBackend()
        this.addDBGateway()
      })
    }
  }
    

  
 

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      console.log(params);
      this.data=JSON.parse(params['data']);
      console.log("---------------------",this.data)
     })

    this.controlGroupSell = new FormGroup({
      Price: new FormControl(this.sale.Price, Validators.required),
      Royalty:new FormControl(this.sale.Royalty,Validators.required),
      //SellingStatus:new FormControl(this.nft.SellingStatus,Validators.required),
    });
  }

  private formValue(controlName: string): any {
    return this.controlGroupSell.get(controlName)!.value;
  }

}
