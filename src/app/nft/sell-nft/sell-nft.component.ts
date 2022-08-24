import { FreighterComponent } from './../../wallet/freighter/freighter.component';
import { UserWallet } from 'src/app/models/userwallet';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NFTMarket, SalesBE, SalesGW, Sales } from 'src/app/models/nft';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { SellOfferServiceService } from 'src/app/services/blockchain-services/stellar-services/sell-offer-service.service';
import { Seller2tracService } from 'src/app/services/blockchain-services/solana-services/seller2trac.service';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { SVG, TXN } from 'src/app/models/minting';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sell-nft',
  templateUrl: './sell-nft.component.html',
  styleUrls: ['./sell-nft.component.css'],
})
export class SellNftComponent implements OnInit {
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
    private router: Router
  ) {}

  calculatePrice(): void {
    this.royalty = parseInt(this.formValue('Royalty'));
    this.firstPrice = parseInt(this.formValue('Price'));
    this.royaltyCharge = this.firstPrice * (this.royalty / 100);
    this.sellingPrice = this.firstPrice + this.royaltyCharge;
  }

  saveTXNs(): void {
    this.txn.Blockchain = this.data.NftIssuingBlockchain;
    this.txn.ImageURL = this.data.ImageBase64;
    this.txn.NFTIdentifier = this.data.Identifier;
    this.txn.NFTName = this.data.NftContentName;
    this.txn.NFTTxnHash = this.selltxn;
    this.txn.Status ='ON SALE';

    this.apiService.addTXN(this.txn).subscribe();
  }

  addDBBackend(): void {
    this.saleBE.SellingStatus = 'ON SALE';
    this.saleBE.CurrentPrice = this.sellingPrice.toString();
    this.saleBE.Timestamp = '2022-4-20:17:28';
    this.saleBE.CurrentOwnerPK = this.data.OriginPK;
    this.service.updateNFTStatusBackend(this.saleBE).subscribe();
  }

  addDBGateway(): void {
    this.saleGW.Status = 'ON SALE';
    this.saleGW.Price = this.sellingPrice.toString();
    this.saleGW.NFTTXNhash = this.data.NFTTXNhash;
    this.saleGW.Amount = this.data.Copies;
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
    if (this.data.NftIssuingBlockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      let signerpK = await freighterWallet.getWalletaddress();
      console.log('user PK: ', signerpK);
      this.saleBE.SellingType = 'NFT';
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.data.Identifier;
      this.calculatePrice();
      this.addDBBackend();
      this.addDBGateway();
      this.stellarService
        .sellNft(
          this.data.NftContentName,
          this.data.InitialIssuerPK,
          signerpK,
          '1',
          this.sellingPrice
        )
        .then((res: any) => {
          this.selltxn = res.hash;
          this.saveTXNs();
        });
    }
    if (this.data.NftIssuingBlockchain == 'solana') {
      console.log('Solana going on sale');
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.SellingType = 'NFT';
      this.calculatePrice();

      if (this.data.InitialDistributorPK == this.data.OriginPK) {
        this.selltxn = this.data.NFTTxnHash;
        this.saleBE.NFTIdentifier = this.data.Identifier;
        this.addDBBackend();
        this.addDBGateway();
      } else {
        console.log('mint ', this.data.InitialIssuerPK);
        const connection = new Connection(
          clusterApiUrl('testnet'),
          'confirmed'
        );
        let phantomWallet = new UserWallet();
        phantomWallet = new PhantomComponent(phantomWallet);
        await phantomWallet.initWallelt();
        this.middleman
          .createATA(
            phantomWallet.getWalletaddress(),
            environment.fromWalletSecret,
            this.data.InitialIssuerPK
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

              alert('successfully sold!');
              this.selltxn = signature;
              this.addDBBackend();
              this.addDBGateway();
              this.saveTXNs();
            } catch (err) {
              alert(err);
            }
          });
      }
    }
    if (this.data.NftIssuingBlockchain == 'polygon') {
      this.saleBE.MarketContract = environment.contractAddressMKPolygon;
      this.saleBE.NFTIdentifier = this.data.Identifier;
      this.tokenid = parseInt(this.data.Identifier);
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
        });
      //this.addDBBackend()
    }
    if (this.data.NftIssuingBlockchain == 'ethereum') {
      this.saleBE.MarketContract = environment.contractAddressMKEthereum;
      this.saleBE.NFTIdentifier = this.data.Identifier;
      this.tokenid = parseInt(this.data.Identifier);
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
        });
    }
  }

  showInProfile(){
    let data: any = this.data.NftIssuingBlockchain;
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: this.data.NftIssuingBlockchain },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('data passed :', this.data);
      this.svg.Hash = this.data.ImageBase64;
      console.log('HASH', this.svg.Hash);
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
