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
    '',
    '',
    ''
  );
  saleBE: SalesBE = new SalesBE('', '', '', '', '', '', '','','','');
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

  svg: SVG = new SVG('', '', 'NA','','');
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

  

  showInProfile(){
    let data: any = this.data.blockchain;
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: this.data.blockchain },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      this.svg.Hash = this.data.imagebase64;
    });
    this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
      this.Decryption = res.Response.Base64ImageSVG;
      if(this.data.attachmenttype == "image/jpeg" || this.data.attachmenttype == "image/jpg" ||this.data.attachmenttype == "image/png"){
        this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
      }else{
        this.dec = btoa(this.Decryption);
    var str2 = this.dec.toString();
    var str1 = new String( "data:image/svg+xml;base64,");
    var src = str1.concat(str2.toString());
    this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
      }
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
