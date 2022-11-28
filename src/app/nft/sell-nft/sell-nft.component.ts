import { FreighterComponent } from './../../wallet/freighter/freighter.component';
import { UserWallet } from 'src/app/models/userwallet';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NFTMarket, SalesBE, SalesGW, Sales } from 'src/app/models/nft';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { SellOfferServiceService } from 'src/app/services/blockchain-services/stellar-services/sell-offer-service.service';
import { Seller2tracService } from 'src/app/services/blockchain-services/solana-services/seller2trac.service';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { SVG, Track, TXN } from 'src/app/models/minting';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { CodeviewComponent } from '../codeview/codeview.component';
import { MatDialog } from '@angular/material/dialog';
import { EthereumMintService } from 'src/app/services/contract-services/ethereum-mint.service';
import { PolygonMintService } from 'src/app/services/contract-services/polygon-mint.service';
import {
  ConfirmDialogText,
  PendingDialogText,
  SnackBarText,
} from 'src/app/models/confirmDialog';

@Component({
  selector: 'app-sell-nft',
  templateUrl: './sell-nft.component.html',
  styleUrls: ['./sell-nft.component.css'],
})
export class SellNftComponent implements OnInit {
  selectedTab: number = 0;
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
    ''
  );
  saleBE: SalesBE = new SalesBE('', '', '', '', '', '', '', '', '');
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
  List: any[] = [];
  svg: SVG = new SVG('', '', 'NA','','');
  NFTList: any;
  prevOwner: string;
  watchlist: any;
  favorites: any;
  image: any;
  html: any;
  currency: string;
  isLoading: boolean = false;
  public loaded = false;
  private htmStr: string;
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  maincontent: any;

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
    private dialogService: DialogService,
    private snackbarService: SnackbarServiceService,
    private api: ApiServicesService,
    public dialog: MatDialog,
    public emint:EthereumMintService,
    public pmint:PolygonMintService
  ) {}

  calculatePrice(): void {
    this.royalty = parseFloat(this.formValue('Royalty'));
    this.firstPrice = parseFloat(this.formValue('Price'));
    console.log('Price and Royalty is : ', this.royalty, this.firstPrice);
    this.royaltyCharge = this.firstPrice * (this.royalty / 100.0);
    this.sellingPrice = this.firstPrice + this.royaltyCharge;
    console.log('Calculation done: ', this.sellingPrice, this.royaltyCharge);
  }

  public openDialog() {
    if(this.NFTList.attachmenttype == "image/jpeg" || this.NFTList.attachmenttype == "image/jpg" || this.NFTList.attachmenttype == "image/png"){
      this.dialogService.openNftPreview({image:this.maincontent})
    }else{
      this.dialogService.openCodeView(this.Decryption);
    }
  }
  saveTXNs(): void {
    this.txn.Blockchain = this.NFTList.blockchain;
    this.txn.ImageURL = this.NFTList.imagebase64;
    this.txn.NFTIdentifier = this.NFTList.nftidentifier;
    this.txn.NFTName = this.NFTList.nftname;
    this.txn.NFTTxnHash = this.selltxn;
    this.txn.Status = 'ON SALE';

    this.apiService.addTXN(this.txn).subscribe();
  }

  addDBBackend(): void {
    this.saleBE.SellingStatus = 'ON SALE';
    this.saleBE.CurrentPrice = this.sellingPrice.toString();
    this.saleBE.Timestamp = '2022-4-20:17:28';
    this.saleBE.CurrentOwnerPK = this.NFTList.currentownerpk;
    this.saleBE.Royalty = this.royaltyCharge.toString();
    console.log('--------------: ', this.saleBE);
    this.service.updateNFTStatusBackend(this.saleBE).subscribe();
  }

  addDBGateway(): void {
    this.saleGW.Status = 'ON SALE';
    this.saleGW.Price = this.sellingPrice.toString();
    this.saleGW.NFTTXNhash = this.NFTList.nfttxnhash;
    this.saleGW.Amount = '1';
    this.service
      .updateNFTStatusGateway(
        this.saleGW.Price,
        this.saleGW.Status,
        this.saleGW.Amount,
        this.saleGW.NFTTXNhash
      )
      .subscribe();
  }

  dataURItoBlob(dataURI, type) {
    // const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(dataURI.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < dataURI.length; i++) {
      int8Array[i] = dataURI.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  async Sell(): Promise<void> {
    if (this.NFTList.blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      let signerpK = await freighterWallet.getWalletaddress();
      this.saleBE.SellingType = 'NFT';
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.dialogService
        .confirmDialog({
          title: ConfirmDialogText.SELL_VIEW_SELL_NFT_TITLE,
          message: ConfirmDialogText.SELL_VIEW_SELL_NFT_MESSAGE,
          confirmText: ConfirmDialogText.CONFIRM_BTN,
          cancelText: ConfirmDialogText.CANCEL_BTN,
        })
        .subscribe((res) => {
          if (res) {
            const dialog = this.dialogService.pendingDialog({
              message: PendingDialogText.SELL_VIEW_CLICKED_SALE,
            });
            this.calculatePrice();
            this.addDBBackend();
            this.addDBGateway();
            this.stellarService
              .sellNft(
                this.NFTList.nftname,
                this.NFTList.nftissuerpk,
                signerpK,
                '1',
                this.sellingPrice,
                this.royaltyCharge
              )
              .then((res: any) => {
                this.selltxn = res.hash;
                this.saveTXNs();
                dialog.close();
                this.snackbarService.openSnackBar(
                  SnackBarText.SALE_SUCCESS_MESSAGE
                );
                this.showInProfile();
              });
          }
        });
    }
    if (this.NFTList.blockchain == 'solana') {
      console.log('Solana going on sale');
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.SellingType = 'NFT';
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.calculatePrice();
      // if (this.NFTList.sellingstatus == 'Minted') {
      //   this.selltxn = this.NFTList.nfttxnhash;
      //   this.addDBBackend();
      //   this.addDBGateway();
      //   this.snackbarService.openSnackBar(
      //     'NFT has successfully been put on sale'
      //   );
      //   this.showInProfile()
      // } else {
        console.log('mint ', this.NFTList.nftissuerpk);
        const connection = new Connection(
          clusterApiUrl('devnet'),
          'confirmed'
        );
        let phantomWallet = new UserWallet();
        phantomWallet = new PhantomComponent(phantomWallet);
        await phantomWallet.initWallelt();
        this.dialogService
          .confirmDialog({
            title: ConfirmDialogText.SELL_VIEW_SELL_NFT_TITLE,
            message: ConfirmDialogText.SELL_VIEW_SELL_NFT_MESSAGE,
            confirmText: ConfirmDialogText.CONFIRM_BTN,
            cancelText: ConfirmDialogText.CANCEL_BTN,
          })
          .subscribe((res) => {
            if (res) {
              const dialog = this.dialogService.pendingDialog({
                message: PendingDialogText.SELL_VIEW_CLICKED_SALE,
              });
              this.middleman
                .createATA(
                  phantomWallet.getWalletaddress(),
                  environment.fromWalletSecret,
                  this.NFTList.nftissuerpk
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
                  dialog.close();
                  this.snackbarService.openSnackBar(
                    SnackBarText.SALE_SUCCESS_MESSAGE
                  );
                  this.showInProfile();
                } catch (err) {
                  alert(err);
                }
              });
          }
        });
      //}
    }
    if (this.NFTList.blockchain == 'polygon') {
      this.saleBE.MarketContract = environment.contractAddressMKPolygon;
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.tokenid = parseInt(this.NFTList.nftidentifier);
      this.dialogService
        .confirmDialog({
          title: ConfirmDialogText.SELL_VIEW_SELL_NFT_TITLE,
          message: ConfirmDialogText.SELL_VIEW_SELL_NFT_MESSAGE,
          confirmText: ConfirmDialogText.CONFIRM_BTN,
          cancelText: ConfirmDialogText.CANCEL_BTN,
        })
        .subscribe((res) => {
          if (res) {
            const dialog = this.dialogService.pendingDialog({
              message: PendingDialogText.SELL_VIEW_CLICKED_SALE,
            });
            this.calculatePrice();
            if(this.NFTList.sellingstatus=='Minted'){

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
                dialog.close();
                this.snackbarService.openSnackBar(
                  SnackBarText.SALE_SUCCESS_MESSAGE
                );
                this.showInProfile();
              });
            }else{
              console.log("bfore approval")
              this.pmint.approveContract(this.tokenid).then((res:any)=>{
                console.log("transaction result is: ",res)
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
                  dialog.close();
                  this.snackbarService.openSnackBar(
                    SnackBarText.SALE_SUCCESS_MESSAGE
                  );
                  this.showInProfile();
                });
              })
             
            }
          }
        });
    }
    if (this.NFTList.blockchain == 'ethereum') {
      this.saleBE.MarketContract = environment.contractAddressMKEthereum;
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.tokenid = parseInt(this.NFTList.nftidentifier);
      console.log('STARTING ETH SELL');
      this.dialogService
        .confirmDialog({
          title: ConfirmDialogText.SELL_VIEW_SELL_NFT_TITLE,
          message: ConfirmDialogText.SELL_VIEW_SELL_NFT_MESSAGE,
          confirmText: ConfirmDialogText.CONFIRM_BTN,
          cancelText: ConfirmDialogText.CANCEL_BTN,
        })
        .subscribe((res) => {
          if (res) {
            const dialog = this.dialogService.pendingDialog({
              message: PendingDialogText.SELL_VIEW_CLICKED_SALE,
            });
            this.calculatePrice();
            if(this.NFTList.sellingstatus=='Minted'){
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
                dialog.close();
                this.snackbarService.openSnackBar(
                  SnackBarText.SALE_SUCCESS_MESSAGE
                );
                this.showInProfile();
              });
            }else{
              console.log("bfore approval")
              this.emint.approveContract(this.tokenid).then((res:any)=>{
                console.log("transaction is approved: ",res)
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
                  dialog.close();
                  this.snackbarService.openSnackBar(
                    SnackBarText.SALE_SUCCESS_MESSAGE
                  );
                  this.showInProfile();
                });
              })
            }
          }
        });
    }
  }

  showInProfile() {
    let data: any = this.NFTList.blockchain;
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: data },
    });
  }

  public setCurrency() {
    if (this.data[2].toLowerCase().trim() === 'ethereum') {
      this.currency = 'ETH';
    } else if (this.data[2].toLowerCase().trim() === 'polygon') {
      this.currency = 'MATIC';
    } else if (this.data[2].toLowerCase().trim() === 'solana') {
      this.currency = 'SOL';
    } else if (this.data[2].toLowerCase().trim() === 'stellar') {
      this.currency = 'XLM';
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('DATA recived: ', this.data);
      this.setCurrency();
    });
    this.isLoading = true;
    if (this.data != null) {
      this.service
        // 1:nft identifer , 2:blockchain, 0:selling status
        .getNFTDetails(this.data[1], this.data[0], this.data[2])
        .subscribe((data: any) => {
          console.log('data: ', data);
          this.NFTList = data.Response[0];
          if (this.NFTList == null) {
            console.log('retrying...');
            this.ngOnInit();
          }
          if (this.data[0] == 'Minted') {
            this.prevOwner = 'None - Genesis';
          } else {
            this.prevOwner = this.NFTList.distributorpk;
          }

          this.api
            .findWatchlistByBlockchainAndNFTIdentifier(
              this.NFTList.blockchain,
              this.NFTList.nftidentifier
            )
            .subscribe((res: any) => {
              if (res.Response != null) {
                this.watchlist = res.Response.length;
              } else {
                this.watchlist = 0;
              }
            });

          this.api
            .findFavouritesByBlockchainAndNFTIdentifier(
              this.NFTList.blockchain,
              this.NFTList.nftidentifier
            )
            .subscribe((res: any) => {
              if (res.Response != null) {
                this.favorites = res.Response.length;
              } else {
                this.favorites = 0;
              }
            });
          console.log(
            'MAIN DATA :',
            this.NFTList.nftidentifier,
            this.NFTList.blockchain
          );
          this.apiService
            .getAllStoryByNFTIdAndBlockchain(
              this.NFTList.nftidentifier,
              this.NFTList.blockchain
            )
            .subscribe((data) => {
              if (!!data) {
                this.htmStr = atob(data.Response[0].NFTStory);
                const content = this.htmStr;
                console.log('HTML STRING: ', this.htmStr);
                let style = `<style>table, td, th {border: 1px solid white;}table {border-collapse: collapse;}
                ::-webkit-scrollbar {
                  width: 5px;
                  height: 5px;
                }
                ::-webkit-scrollbar-track {
                  background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                  background: rgba(136, 136, 136, 0.549);
                  border-radius: 50px;
                }
                ::-webkit-scrollbar-thumb:hover {
                  background: #888;
                }</style>`;
                let link =
                  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" >';
                let htmlHead = '<html><head>';
                let htmlopen: string =
                  '</head><body style="color:white;font-family:Inter;">';
                let htmlclose: string = '</body></html>';
                let html: string =
                  htmlHead + link + style + htmlopen + content + htmlclose;
                console.log('HTML OUT PUT :', html);
                this.html = html;
                this.populateIframe(this.iframe.nativeElement, html);
              }
            });

          if (this.NFTList.blockchain == 'ethereum') {
            this.image = '../../../assets/images/blockchain-icons/ethereum.png';
          }
          if (this.NFTList.blockchain == 'polygon') {
            this.image = '../../../assets/images/blockchain-icons/polygon.PNG';
          }
          if (this.NFTList.blockchain == 'stellar') {
            this.image = '../../../assets/images/blockchain-icons/stellar.PNG';
          }
          if (this.NFTList.blockchain == 'solana') {
            this.image = '../../../assets/images/blockchain-icons/solana.PNG';
          }

          this.service
            .getSVGByHash(this.NFTList.imagebase64)
            .subscribe((res: any) => {
              console.log('service res:', this.NFTList);
              this.Decryption = res.Response.Base64ImageSVG;
              console.log('decrypted sg:', this.Decryption);
              if(this.NFTList.attachmenttype == "image/jpeg" || this.NFTList.attachmenttype == "image/jpg" ||this.NFTList.attachmenttype == "image/png"){
                console.log("its an image",this.Decryption)
                if(this.NFTList.thumbnail==""){
                  this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
                  this.maincontent=this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())     

                }else{
                  this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.NFTList.thumbnail);
                  this.maincontent=this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())     
                }
               
              }else{
                this.dec = btoa(this.Decryption);
            var str2 = this.dec.toString();
            var str1 = new String( "data:image/svg+xml;base64,");
            var src = str1.concat(str2.toString());
            if(this.NFTList.thumbnail==""){
              this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(src)
              
            }else{
              this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.NFTList.thumbnail);
              this.maincontent=this._sanitizer.bypassSecurityTrustResourceUrl(src) 
            }
              }
            });

          this.service
            .getTXNByBlockchainandIdentifier(
              this.NFTList.nftidentifier,
              this.NFTList.blockchain
            )
            .subscribe((txn: any) => {
              console.log('TXNS :', txn);
              for (let x = 0; x < txn.Response.length; x++) {
                let card: Track = new Track('', '', '');
                card.NFTName = txn.Response[x].NFTName;
                card.Status = txn.Response[x].Status;
                if (txn.Response[x].Blockchain == 'ethereum') {
                  card.NFTTxnHash =
                    'https://goerli.etherscan.io/tx/' +
                    txn.Response[x].NFTTxnHash;
                }
                if (txn.Response[x].Blockchain == 'polygon') {
                  card.NFTTxnHash =
                    'https://mumbai.polygonscan.com/tx/' +
                    txn.Response[x].NFTTxnHash;
                }
                if (txn.Response[x].Blockchain == 'stellar') {
                  card.NFTTxnHash =
                    'https://stellar.expert/explorer/testnet/tx/' +
                    txn.Response[x].NFTTxnHash;
                }
                if (txn.Response[x].Blockchain == 'solana') {
                  card.NFTTxnHash =
                    'https://solscan.io/tx/' +
                    txn.Response[x].NFTTxnHash +
                    '?cluster=testnet';
                }

                this.List.push(card);
              }
            });
          this.isLoading = false;
        });
    } else {
      console.log('User PK not connected or not endorsed');
    }

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
      queryParams: { blockchain: this.NFTList.blockchain, filter: 'all' },
    });
  }

  public sellNow() {
    this.selectedTab = 1;
  }
  public prevTab() {
    this.selectedTab = 0;
    setTimeout(() => {
      this.populateIframe(this.iframe.nativeElement, this.html);
    }, 100);
  }
  createStory() {
    console.log('Data list:', this.NFTList);
    console.log(
      'Data passed to create story:',
      this.NFTList.nftidentifier,
      this.NFTList.blockchain
    );
    let data: any[] = [this.NFTList.nftidentifier, this.NFTList.blockchain];
    this.router.navigate(['./createblog'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }
  public populateIframe(iframe: any, data: string) {
    console.log('CALL STARTED');

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(data);
    iframe.contentWindow.document.close();
    this.loaded = false;
  }
}
