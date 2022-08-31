import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { environment } from 'src/environments/environment';
import { SVG, TXN } from '../models/minting';
import { NFTMarket, Sales, SalesBE, SalesGW } from '../models/nft';
import { UserWallet } from '../models/userwallet';
import { ApiServicesService } from '../services/api-services/api-services.service';
import { NftServicesService } from '../services/api-services/nft-services/nft-services.service';
import { Seller2tracService } from '../services/blockchain-services/solana-services/seller2trac.service';
import { SellOfferServiceService } from '../services/blockchain-services/stellar-services/sell-offer-service.service';
import { EthereumMarketServiceService } from '../services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from '../services/contract-services/marketplace-services/polygon-market-service.service';
import { DialogService } from '../services/dialog-services/dialog.service';
import { SnackbarServiceService } from '../services/snackbar-service/snackbar-service.service';
import { FreighterComponent } from '../wallet/freighter/freighter.component';
import { PhantomComponent } from '../wallet/phantom/phantom.component';

@Component({
  selector: 'app-put-on-resale',
  templateUrl: './put-on-resale.component.html',
  styleUrls: ['./put-on-resale.component.css']
})
export class PutOnResaleComponent implements OnInit {
  controlGroupSell: FormGroup;
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
  saleBE: SalesBE = new SalesBE('', '', '', '', '', '', '');
  saleGW: SalesGW = new SalesGW('', '', '', '');
  sale: Sales = new Sales('', '');
  royalty: any;
  firstPrice: any;
  royaltyCharge: any;
  sellingPrice: any;
  data: any;
  signer = 'SAUD6CUMHSDAN2LTOUGLZLSB2N6YDMYUVKP22RYYHEHYUW5M5YKFWUX4';
  tokenid: number;
  itemId: number;
  newATA: any;
  txn: TXN = new TXN('', '', '', '', '', '');
  selltxn: any;
  transaction: Uint8Array;
  imageSrc: any;
  Decryption: any;
  dec: string;

  svg: SVG = new SVG('', '', 'NA');
  constructor(
    private route: ActivatedRoute,
    private service: NftServicesService,
    private stellarService: SellOfferServiceService,
    private middleman: Seller2tracService,
    private emarket: EthereumMarketServiceService,
    private pmarket: PolygonMarketServiceService,
    private apiService: ApiServicesService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private snackbar : SnackbarServiceService,
    private dialogService : DialogService,
  ) { }

  calculatePrice(): void {
    this.royalty = parseInt(this.formValue('Royalty'));
    this.firstPrice = parseInt(this.formValue('Price'));
    this.royaltyCharge = this.firstPrice * (this.royalty / 100);
    this.sellingPrice = this.firstPrice + this.royaltyCharge;
  }

  saveTXNs(): void {
    this.txn.Blockchain = this.data.blockchain;
    this.txn.ImageURL = this.data.imagebase64;
    this.txn.NFTIdentifier = this.data.nftidentifier;
    this.txn.NFTName = this.data.nftname;
    this.txn.NFTTxnHash = this.selltxn;
    this.txn.Status = "ON SALE";

    this.apiService.addTXN(this.txn).subscribe();
  }

  addDBBackend(): void {
    this.saleBE.SellingStatus = 'ON SALE';
    this.saleBE.CurrentPrice = this.sellingPrice.toString();
    this.saleBE.Timestamp = '2022-4-20:17:28';
    this.saleBE.CurrentOwnerPK = this.data.currentownerpk;
    this.service.updateNFTStatusBackend(this.saleBE).subscribe();
  }

  addDBGateway(): void {
    this.saleGW.Status = 'ON SALE';
    this.saleGW.Price = this.sellingPrice.toString();
    this.saleGW.NFTTXNhash = this.data.nfttxnhash;
    this.saleGW.Amount = "1";
    this.service
      .updateNFTStatusGateway(
        this.saleGW.Price,
        this.saleGW.Status,
        this.saleGW.Amount,
        this.saleGW.NFTTXNhash
      )
      .subscribe();
  }

  async Sell(): Promise<void> {
    if (this.data.blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      let signerpK = await freighterWallet.getWalletaddress();
      console.log('user PK: ', signerpK);
      this.saleBE.SellingType = 'NFT';
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.data.nftidentifier;
      this.dialogService.confirmDialog({
        title:"NFT Sale confirmation.",
        message:"Are you sure you want to put this NFT on sale.",
        confirmText:"Yes",
        cancelText:"No"
      }).subscribe(res=>{
        if(res){
          this.calculatePrice();
          this.addDBBackend();
          this.addDBGateway();
          this.stellarService
            .sellNft(
              this.data.nftname,
              this.data.nftissuerpk,
              signerpK,
              '1',
              this.sellingPrice
            )
            .then((res: any) => {
              this.selltxn = res.hash;
              this.saveTXNs();
              this.snackbar.openSnackBar("NFT has successfully been put on sale")
            });
        }
      })
      
    }
    if (this.data.blockchain == 'solana') {
      console.log('Solana going on sale');
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.SellingType = 'NFT';
      this.calculatePrice();

      if (this.data.currentownerpk == this.data.creatoruserid) {
        this.selltxn = this.data.nfttxnhash;
        this.saleBE.NFTIdentifier = this.data.nftidentifier;
        this.addDBBackend();
        this.addDBGateway();
      } else {
        console.log('mint ', this.data.nftissuerpk);
        const connection = new Connection(
          clusterApiUrl('testnet'),
          'confirmed'
        );
        let phantomWallet = new UserWallet();
        phantomWallet = new PhantomComponent(phantomWallet);
        await phantomWallet.initWallelt();
        this.dialogService.confirmDialog({
          title:"NFT Sale confirmation.",
          message:"Are you sure you want to put this NFT on sale.",
          confirmText:"Yes",
          cancelText:"No"
        }).subscribe(res=>{
          if(res){
            this.middleman
            .createATA(
              phantomWallet.getWalletaddress(),
              environment.fromWalletSecret,
              this.data.nftissuerpk
            )
            .then(async (result) => {
              try {
                const signedTransaction = await (
                  window as any
                ).solana.signTransaction(result);
  
                this.transaction = signedTransaction.serialize();
                const signature = await connection.sendRawTransaction(
                  this.transaction
                );
  
                this.snackbar.openSnackBar("NFT has successfully been put on sale")
                this.saleBE.NFTIdentifier = this.data.nftidentifier;
                this.selltxn = signature;
                this.addDBBackend();
                this.addDBGateway();
                this.saveTXNs();
              } catch (err) {
                alert(err);
              }
            });
          }
        })
        
      }
    }
    if (this.data.blockchain == 'polygon') {
      this.saleBE.MarketContract = environment.contractAddressMKPolygon;
      this.saleBE.NFTIdentifier = this.data.nftidentifier;
      this.tokenid = parseInt(this.data.nftidentifier);
      this.dialogService.confirmDialog({
        title:"NFT Sale confirmation.",
        message:"Are you sure you want to put this NFT on sale.",
        confirmText:"Yes",
        cancelText:"No"
      }).subscribe(res=>{
        this.calculatePrice();

        this.pmarket
          .createSaleOffer(
            environment.contractAddressNFTPolygon,
            this.tokenid,
            this.sellingPrice
          )
          .then((res) => {
            this.selltxn = res.transactionHash;
            this.itemId = parseInt(res.logs[3].topics[1]);
            this.saleBE.SellingType = this.itemId.toString();
            this.saveTXNs();
            this.addDBBackend();
            this.addDBGateway();
            this.snackbar.openSnackBar("NFT has successfully been put on sale")
          });
        //this.addDBBackend()
      })
      
    }
    if (this.data.blockchain == 'ethereum') {
      this.saleBE.MarketContract = environment.contractAddressMKEthereum;
      this.saleBE.NFTIdentifier = this.data.nftidentifier;
      this.tokenid = parseInt(this.data.nftidentifier);
      this.dialogService.confirmDialog({
        title:"NFT Sale confirmation.",
        message:"Are you sure you want to put this NFT on sale.",
        confirmText:"Yes",
        cancelText:"No"
      }).subscribe(res=>{
        if(res){
          this.calculatePrice();

          this.emarket
            .createSaleOffer(
              environment.contractAddressNFTEthereum,
              this.tokenid,
              this.sellingPrice
            )
            .then((res) => {
              this.selltxn = res.transactionHash;
              this.itemId = parseInt(res.logs[2].topics[1]);
              this.saleBE.SellingType = this.itemId.toString();
              this.saveTXNs();
              this.addDBBackend();
              this.addDBGateway();
              this.snackbar.openSnackBar("NFT has successfully been put on sale")
            });
        }
      })
      
    }
  }

  showInProfile(){
    let data: any = this.data.blockchain;
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: this.data.blockchain },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('data passed :', this.data);
      this.svg.Hash = this.data.imagebase64;
      console.log('HASH', this.data.Hash);
    });
    this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
      console.log('service res:', res);
      this.Decryption = res.Response.Base64ImageSVG;
      console.log('decrypted sg:', this.Decryption);
      this.dec = btoa(this.Decryption);
      console.log('dec : ', this.dec);
      var str2 = this.dec.toString();
      var str1 = new String('data:image/svg+xml;base64,');
      var src = str1.concat(str2.toString());
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
      console.log('imgsrc', this.imageSrc);
    });

    this.controlGroupSell = new FormGroup({
      Price: new FormControl(this.sale.Price, Validators.required),
      Royalty: new FormControl(this.sale.Royalty, Validators.required),
    });
  }

  private formValue(controlName: string): any {
    return this.controlGroupSell.get(controlName)!.value;
  }

  public goToExplore() {
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: 'ethereum', filter: 'uptodate' },
    });
  }

}
