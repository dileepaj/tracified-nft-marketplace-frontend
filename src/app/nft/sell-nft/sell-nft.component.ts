import { FreighterComponent } from './../../wallet/freighter/freighter.component';
import { UserWallet } from 'src/app/models/userwallet';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NFTMarket, SalesBE, SalesGW, Sales,ContractStatus } from 'src/app/models/nft';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { SellOfferServiceService } from 'src/app/services/blockchain-services/stellar-services/sell-offer-service.service';
import { Seller2tracService } from 'src/app/services/blockchain-services/solana-services/seller2trac.service';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { Ownership, SVG, Track, TXN } from 'src/app/models/minting';
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
  SelectWalletText,
  SnackBarText,
} from 'src/app/models/confirmDialog';
import { BlockchainConfig } from 'src/environments/environment';
import { id } from 'ethers/lib/utils';
import albedo from '@albedo-link/intent';
import { SaleOfferService } from 'src/app/services/blockchain-services/stellar-services/albedo-transactions/sale-offer.service';
import { MintService } from 'src/app/services/blockchain-services/mint.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase/firebase-analytics.service';
import { CurrencyConverterService } from 'src/app/services/api-services/crypto-currency-converter/currency-converter.service';

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
    '',
    ''
  );
  saleBE: SalesBE = new SalesBE('', '', '', '', '', '', '', '', '', '');
  saleGW: SalesGW = new SalesGW('', '', '', '');
  sale: Sales = new Sales('', '');
  own: Ownership = new Ownership('', '', '', '', 1);
  statuscontract: ContractStatus=new ContractStatus('','','')
  royalty: any;
  firstPrice: any;
  royaltyCharge: any;
  sellingPrice: any;
  data: any;
  signer = 'SAUD6CUMHSDAN2LTOUGLZLSB2N6YDMYUVKP22RYYHEHYUW5M5YKFWUX4';
  tokenid: number;
  itemId: number;
  newATA: any;
  txn: TXN = new TXN('', '', '', '', '', '', '');
  selltxn: any;
  transaction: Uint8Array;
  imageSrc: any;
  Decryption: any;
  dec: string;
  List: any[] = [];
  svg: SVG = new SVG('', '', 'NA', '', '');
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
  royaltyamount = 0;
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  maincontent: any;
  readonly network: any = BlockchainConfig.solananetworkURL;
  wallet: any;
  signerpK: string;
  commission: string;
  Royalty: any;
  value: boolean;
  number: number;
  price: number;
  commissionforNonContracts: number;
  sellingPriceForNonContracts: any;
  servicecommission: number;
  sellingPriceUSD: number = 0;
  royaltyPriceUSD: number = 0;
  addSubscription: any;
  storyAvailable: boolean = false;
  userprofileURL:string="";
  nftContentURL:string="";
  usercontentURLFlag: boolean=false;
  nftcontentURLFlag: boolean=false;
  currencyRate: any = 0.0;
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
    public emint: EthereumMintService,
    public pmint: PolygonMintService,
    private albedosale: SaleOfferService,
    private servicemint: MintService,
    private firebaseanalytics: FirebaseAnalyticsService,
    private currencyConverter:CurrencyConverterService
  ) { }

  validateDecimal(input) {
    // Get the value of the input box and convert it to a number with 6 decimal places
    const value = parseFloat(input.value).toFixed(4);
    
    // Check if the value in the input box is the same as the rounded value
    if (value !== input.value) {
      // If the value is different, set the input box value to the rounded value
      input.value = value;
    }
  }

  calculatePrice(): void {
    if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
      //might be distributor
      this.Royalty = this.NFTList.royalty;
      this.royalty = parseFloat(this.Royalty);
      // this.royalty = parseFloat(this.formValue('Royalty'));
      // this.royaltyamount = this.royalty;
      this.firstPrice = parseFloat(this.formValue('Price'));
      this.royaltyCharge = (
        this.firstPrice *
        (this.royalty / 100.0)
      ).toPrecision(6);
      this.sellingPrice = this.firstPrice;
      this.commissionforNonContracts =
        parseFloat(this.formValue('Price')) * (5.0 / 100.0);
      this.commission = (this.firstPrice * (5.0 / 100.0))
        .toPrecision(6)
        .toString();
      this.sellingPriceForNonContracts =
      (parseFloat(this.firstPrice )+ parseFloat(this.royaltyCharge) + parseFloat(this.commission)).toPrecision(6);
      this.value = true;
    } else {
      this.royalty = parseFloat(this.Royalty);
      this.firstPrice = parseFloat(this.formValue('Price'));
      this.royaltyCharge = (
        this.firstPrice *
        (this.royalty / 100.0)
      ).toPrecision(6);
      this.sellingPrice = this.firstPrice;
      this.commission = (this.firstPrice * (2.5 / 100.0))
        .toPrecision(6)
        .toString();
      this.commissionforNonContracts =
        parseFloat(this.formValue('Price')) * (2.5 / 100.0);
      this.value = true;
      this.sellingPriceForNonContracts =
     ( parseFloat(this.firstPrice )+ parseFloat(this.royaltyCharge) + parseFloat(this.commission)).toPrecision(6);
    }
  }

  public openDialog() {
    if (
      this.NFTList.attachmenttype == 'image/jpeg' ||
      this.NFTList.attachmenttype == 'image/jpg' ||
      this.NFTList.attachmenttype == 'image/png'
    ) {
      this.dialogService.openNftPreview({ image: this.maincontent });
    } else {
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
    this.txn.Time = new Date().toString();

    this.apiService.addTXN(this.txn).subscribe();
  }

  addDBBackend(): void {
    this.saleBE.SellingStatus = 'ON SALE';
    this.saleBE.CurrentPrice = this.sellingPrice.toString();
    this.saleBE.Commission = this.commission.toString();
    this.saleBE.Timestamp = new Date().toString();
    this.saleBE.CurrentOwnerPK = this.NFTList.currentownerpk;
    this.saleBE.Royalty = this.royalty.toString();
    this.saveTXNs();
    this.service.updateNFTStatusBackend(this.saleBE).subscribe(res=>{
      this.addDBGateway();
      this.pushOwner();
     this.snackbarService.openSnackBar(
                         SnackBarText.SALE_SUCCESS_MESSAGE,
                         'success'
                       );
      this.showInProfile();
    }
  ); 
  }

  pushOwner(): void {
    //posting owner data via service to backend
    this.own.NFTIdentifier = this.NFTList.nftidentifier;
    this.own.CurentOwnerPK = this.NFTList.currentownerpk;
    this.own.PreviousOwnerPK = this.NFTList.distributorpk;
    this.own.Status = 'ON SALE';
    this.own.OwnerRevisionID = 2;
    if (this.NFTList.distributorpk != null) {
      this.addSubscription = this.servicemint.addOwner(this.own).subscribe();
    }
  }

  addDBGateway(): void {
    this.saleGW.Status = 'ON SALE';
    if (
      this.NFTList.blockchain == 'ethereum' ||
      this.NFTList.blockchain == 'polygon'
    ) {
      this.saleBE.CurrentPrice = this.sellingPrice.toString();
    } else {
      this.saleBE.CurrentPrice = this.sellingPriceForNonContracts.toString();
    }
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
    this.firebaseanalytics.logEvent('button_clicked', {
      button_name: 'sell now',
    });
    this.firstPrice =this.formValue('Price');
    this.royaltyamount = (this.royalty);
    const priceRejex  = /^(?=\d)(\d*(\.\d{1,4})?)$/;
   
    if (isNaN(this.firstPrice) || parseFloat(this.firstPrice) <= 0 || !priceRejex.test(this.firstPrice)) {
      this.snackbarService.openSnackBar
        (
          "Please enter a positive number for the price, with up to four decimal places.",
          "info"
        )
      return
    }
    if (isNaN(+this.royaltyamount) ) {
      this.snackbarService.openSnackBar(
        'Price must be entered as a number',
        'info'
      );
      return;
    }
    if (this.royaltyamount < 0 || this.royaltyamount > 100) {
      this.snackbarService.openSnackBar(
        'Royalty must be between 1 to 100%',
        'info'
      );
      return;
    }
    if (this.NFTList.blockchain == 'stellar') {
      let details = navigator.userAgent;

      let regexp = /android|iphone|kindle|ipad/i;

      let isMobileDevice = await regexp.test(details);

      if (isMobileDevice) {
        await albedo
          .publicKey({
            require_existing: true,
          })
          .then((res: any) => {
            this.signerpK = res.pubkey;

            this.saleBE.SellingType = 'NFT';
            this.saleBE.MarketContract = 'Not Applicable';
            this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
            this.saleBE.Blockchain = this.NFTList.blockchain;
            if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
              //might be distributor
              this.royaltyamount = parseFloat(this.royalty);
              if (isNaN(+this.royaltyamount)) {
                this.snackbarService.openSnackBar(
                  'Royality must be entered as a number',
                  'info'
                );
                return;
              }
              if (this.royaltyamount < 0 || this.royaltyamount > 100) {
                this.snackbarService.openSnackBar(
                  'Royalty must be between 1 to 100%',
                  'info'
                );
                return;
              }
            } else {
              this.royaltyamount = this.Royalty;
            }
            this.calculatePrice();
            this.dialogService
              .confirmMintDialog2({
                promtHeading: 'You are Selling',
                nftName: this.NFTList.nftname,
                thumbnail: this.NFTList.thumbnail,
                feeTypeName: 'Commission Fee ',
                serviceFee: parseFloat(this.commission),
                total: this.sellingPrice,
                blockchain: this.NFTList.blockchain,
                buttonAction: 'Sell Now',
                royalty:'Royalty Fee',
                royaltyfee: this.royaltyCharge,
                grandTotal:'Total',
                grandTotalfee: parseFloat(this.sellingPriceForNonContracts),
              })
              .subscribe((res) => {
                if (res) {
                  const loadingAnimation = this.dialogService.mintingDialog(
                    {
                      processTitle: 'Selling',
                      message: PendingDialogText.MINTING_IN_PROGRESS,
                      nftName: this.NFTList.nftname,
                      thumbnail: this.NFTList.thumbnail,
                    }
                  );

                  this.albedosale
                    .sellNft(
                      this.NFTList.nftname,
                      this.NFTList.nftissuerpk,
                      this.signerpK,
                      '1',
                      this.sellingPrice,
                      () => {
                        this.snackbarService.openSnackBar("Please check balance and network in the wallet", "error");
                        loadingAnimation.close();
                      }
                    )
                    .then((res: any) => { 
                      try {
                        this.selltxn = res.tx_hash;
                        this.addDBBackend();
                        loadingAnimation.close();
                      } catch (err) {
                        this.firebaseanalytics.logEvent('error', {
                          reason: 'Failed to put NFT on sale',
                          wallet: this.wallet,
                          trigger_at: 'sell screen',
                        });
                        loadingAnimation.close();
                        this.snackbarService.openSnackBar(
                          'Something went wrong, please try again! More information: ' +
                          err,
                          'error'
                        );
                      }
                    });
                }
              });
          });

      } else {
        let freighterWallet = new UserWallet();
        freighterWallet = new FreighterComponent(freighterWallet);
        await freighterWallet.initWallelt();
        this.signerpK = await freighterWallet.getWalletaddress();

        this.saleBE.SellingType = 'NFT';
        this.saleBE.MarketContract = 'Not Applicable';
        this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
        this.saleBE.Blockchain = this.NFTList.blockchain;
        this.royaltyamount = parseFloat(this.royalty);
        if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
          //might be distributor
          this.royaltyamount = parseFloat(this.royalty);
          if (isNaN(+this.royaltyamount)) {
            this.snackbarService.openSnackBar(
              'Royality must be entered as a number',
              'info'
            );
            return;
          }
          if (this.royaltyamount < 0 || this.royaltyamount > 100) {
            this.snackbarService.openSnackBar(
              'Royalty must be between 1 to 100%',
              'info'
            );
            return;
          }
        } else {
          this.royaltyamount = this.Royalty;
        }
        this.calculatePrice();
        this.dialogService
          .confirmMintDialog2({
            promtHeading: 'You are Selling',
            nftName: this.NFTList.nftname,
            thumbnail: this.NFTList.thumbnail,
            feeTypeName: 'Commission Fee ',
            serviceFee: parseFloat(this.commission),
            total: this.sellingPrice,
            blockchain: this.NFTList.blockchain,
            buttonAction: 'Sell Now',
            royalty:'Royalty Fee',
            royaltyfee: this.royaltyCharge,
            grandTotal:'Total',
            grandTotalfee: parseFloat(this.sellingPriceForNonContracts),
          })
          .subscribe((res) => {
            if (res) {
              const loadingAnimation = this.dialogService.mintingDialog({
                processTitle: 'Selling',
                message: PendingDialogText.MINTING_IN_PROGRESS,
                nftName: this.NFTList.nftname,
                thumbnail: this.NFTList.thumbnail,
              });

              this.stellarService
                .sellNft(
                  this.NFTList.nftname,
                  this.NFTList.nftissuerpk,
                  this.signerpK,
                  '1',
                  this.sellingPrice,
                  () => {
                    loadingAnimation.close();
                    this.snackbarService.openSnackBar("Please check balance and network in the wallet", "error");
                  }
                )
                .then((res: any) => {
                  try {
                    this.saleBE.Timestamp = new Date().toString();
                    this.selltxn = res.hash;
                    this.addDBBackend();
                    loadingAnimation.close();
                  } catch (err) {
                    this.firebaseanalytics.logEvent('error', {
                      reason: 'Failed to put NFT on sale',
                      wallet: this.wallet,
                      trigger_at: 'sell screen',
                    });
                    loadingAnimation.close();
                    this.snackbarService.openSnackBar(
                      'Something went wrong, please try again! More information: ' +
                      err,
                      'error'
                    );
                  }
                });
            }
          });
      }
    }
    if (this.NFTList.blockchain == 'solana') {
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.SellingType = 'NFT';
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.saleBE.Blockchain = this.NFTList.blockchain;

      const connection = new Connection(this.network);
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
        //might be distributor
        this.royaltyamount = parseFloat(this.royalty);
        if (isNaN(+this.royaltyamount)) {
          this.snackbarService.openSnackBar(
            'Royality must be entered as a number',
            'info'
          );
          return;
        }
        if (this.royaltyamount < 0 || this.royaltyamount > 100) {
          this.snackbarService.openSnackBar(
            'Royalty must be between 1 to 100%',
            'info'
          );
          return;
        }
      } else {
        this.royaltyamount = this.Royalty;
      }
      this.calculatePrice();
      this.dialogService
        .confirmMintDialog2({
          promtHeading: 'You are Selling',
          nftName: this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName: 'Commission Fee ',
          serviceFee: parseFloat(this.commission),
          total: this.sellingPrice,
          blockchain: this.NFTList.blockchain,
          buttonAction: 'Sell Now',
          royalty:'Royalty Fee',
          royaltyfee: this.royaltyCharge,
          grandTotal:'Total',
          grandTotalfee:parseFloat(this.sellingPriceForNonContracts),
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle: 'Selling',
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
              thumbnail: this.NFTList.thumbnail,
            });

            this.middleman
              .createATAforSellar(
                phantomWallet.getWalletaddress(),
                environment.fromWallet,
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
                  this.saleBE.Timestamp = new Date().toString();
                  this.selltxn = signature;
                  if(this.selltxn!=null){
                    this.addDBBackend();
                    loadingAnimation.close();
                  }
               
                } catch (err) {
                  this.firebaseanalytics.logEvent('error', {
                    reason: 'Failed to put NFT on sale',
                    wallet: this.wallet,
                    trigger_at: 'sell screen',
                  });
                  loadingAnimation.close();
                  this.snackbarService.openSnackBar(
                    'Something went wrong, please try again! More information: ' +
                    err,
                    'error'
                  );
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
      if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
        //might be distributor
        this.royaltyamount = parseFloat(this.royalty);
        if (isNaN(+this.royaltyamount)) {
          this.firebaseanalytics.logEvent('error', {
            reason: 'Invalid data typed entered for royalty',
            data_entered: this.royaltyamount,
            wallet: this.wallet,
            trigger_at: 'sell screen',
          });
          this.snackbarService.openSnackBar(
            'Royality must be entered as a number',
            'info'
          );
          return;
        }
        if (this.royaltyamount < 0 || this.royaltyamount > 100) {
          this.firebaseanalytics.logEvent('error', {
            reason: 'Invalid range entered for royalty',
            data_entered: this.royaltyamount,
            wallet: this.wallet,
            trigger_at: 'sell screen',
          });
          this.snackbarService.openSnackBar(
            'Royalty must be between 1 to 100%',
            'info'
          );
          return;
        }
      } else {
        this.royaltyamount = this.Royalty;
      }
      this.calculatePrice();
      this.dialogService
        .confirmMintDialog2({
          promtHeading: 'You are Selling',
          nftName: this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName: 'Commission Fee ',
          serviceFee: parseFloat(this.commission),
          total: this.sellingPrice,
          blockchain: this.NFTList.blockchain,
          buttonAction: 'Sell Now',
          royalty:'Royalty Fee',
          royaltyfee: this.royaltyCharge,
          grandTotal:'Total',
          grandTotalfee: parseFloat(this.sellingPriceForNonContracts),
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle: 'Selling',
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
              thumbnail: this.NFTList.thumbnail,
            });
            this.pmarket.getListingID().then((id:any)=>{
              this.saleBE.SellingType = parseInt(id._hex).toString();
            })
                try {
                  this.pmarket
                    .createSaleOffer(
                     this.NFTList.imagebase64,
                     this.firstPrice,
                     this.commission,
                      () => {
                        this.snackbarService.openSnackBar("Something went wrong ", "error")
                        loadingAnimation.close();
                      }
                    )
                    .then((res) => {
                      try {
                        this.saleBE.Timestamp = new Date().toString();
                        this.selltxn = res.transactionHash;
                       // this.saleBE.SellingType = (1 + parseInt(this.NFTList.sellingtype)).toString();
                       // this.saveTXNs();
                        this.addDBBackend();
                      //  this.addDBGateway();
                        loadingAnimation.close();
                        this.snackbarService.openSnackBar(
                          SnackBarText.SALE_SUCCESS_MESSAGE,
                          'success'
                        );
                       // this.showInProfile();
                      } catch (err) {
                        this.firebaseanalytics.logEvent('error', {
                          reason: 'Failed to put NFT on sale',
                          wallet: this.wallet,
                          trigger_at: 'sell screen',
                        });
                        loadingAnimation.close();
                        this.snackbarService.openSnackBar(
                          'Something went wrong, please try again! More information: ' +
                          err,
                          'error'
                        );
                      }
                    });
                } catch (err) {
                  this.firebaseanalytics.logEvent('error', {
                    reason: 'Failed to put NFT on sale',
                    wallet: this.wallet,
                    trigger_at: 'sell screen',
                  });
                  loadingAnimation.close();
                  this.snackbarService.openSnackBar(
                    'Something went wrong, please try again! More information: ' +
                    err,
                    'error'
                  );
                }
              // });
          }
        });
    }
    if (this.NFTList.blockchain == 'ethereum') {
      this.saleBE.MarketContract = environment.contractAddressMKEthereum;
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.tokenid = parseInt(this.NFTList.nftidentifier);
      if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
        //might be distributor

        this.royaltyamount = parseFloat(this.royalty);
        if (isNaN(+this.royaltyamount)) {
          this.firebaseanalytics.logEvent('error', {
            reason: 'Invalid data type entered for royalty',
            wallet: this.wallet,
            trigger_at: 'sell screen',
          });
          this.snackbarService.openSnackBar(
            'Royality must be entered as a number',
            'info'
          );
          return;
        }
        if (this.royaltyamount < 0 || this.royaltyamount > 100) {
          this.firebaseanalytics.logEvent('error', {
            reason: 'Invalid royalty entered',
            wallet: this.wallet,
            trigger_at: 'sell screen',
          });
          this.snackbarService.openSnackBar(
            'Royalty must be between 1 to 100%',
            'info'
          );
          return;
        }
      } else {
        this.royaltyamount = this.Royalty;
      }
      this.calculatePrice();
      this.dialogService
        .confirmMintDialog2({
          promtHeading: 'You are Selling',
          nftName: this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName: 'Commission Fee ',
          serviceFee: parseFloat(this.commission),
          total: this.sellingPrice,
          blockchain: this.NFTList.blockchain,
          buttonAction: 'Sell Now',
          royalty:'Royalty Fee',
          royaltyfee: this.royaltyCharge,
          grandTotal:'Total',
          grandTotalfee: parseFloat(this.sellingPriceForNonContracts),
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle: 'Selling',
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
              thumbnail: this.NFTList.thumbnail,
            });

          this.emarket.getListingID().then((id:any)=>{
            this.saleBE.SellingType = parseInt(id._hex).toString();
          })
                try {
                  this.emarket
                    .createSaleOffer(
                      this.NFTList.imagebase64,
                      this.firstPrice,
                      this.commission,
                      () => {
                        this.snackbarService.openSnackBar("Something went wrong ", "error")
                        loadingAnimation.close();
                      }
                    )
                    .then((res) => {
                      try {
                        this.saleBE.Timestamp = new Date().toString();
                        this.selltxn = res.transactionHash;
                       // this.itemId = parseInt(res.logs[2].topics[1]);
                       // this.saveTXNs();
                        this.addDBBackend();
                       // this.addDBGateway();
                        loadingAnimation.close();
                        this.snackbarService.openSnackBar(
                          SnackBarText.SALE_SUCCESS_MESSAGE,
                          'success'
                        );
                       // this.showInProfile();
                      } catch (err) {
                        this.firebaseanalytics.logEvent('error', {
                          reason: 'Failed to put NFT on sale',
                          wallet: this.wallet,
                          trigger_at: 'sell screen',
                        });
                        loadingAnimation.close();
                        this.snackbarService.openSnackBar(
                          'Something went wrong, please try again! More information: ' +
                          err,
                          'error'
                        );
                      }
                    });
                } catch (err) {
                  this.firebaseanalytics.logEvent('error', {
                    reason: 'Failed to put NFT on sale',
                    wallet: this.wallet,
                    trigger_at: 'sell screen',
                  });
                  loadingAnimation.close();
                  this.snackbarService.openSnackBar(
                    'Something went wrong, please try again! More information: ' +
                    err,
                    'error'
                  );
                }
          }
        });
    }
  }

  showInProfile() {
    this.firebaseanalytics.logEvent('put_on_sale_success', {
      operation_result: 'success',
    });
    let data: any = this.NFTList.blockchain;
    sessionStorage.setItem('refreshProfile', '1');
    this.router.navigate(['/user-dashboard'], {
      queryParams: { user: this.NFTList.currentownerpk, blockchain: data },
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
      this.setCurrency();
    });
    this.isLoading = true;
    if (this.data != null) {
      this.firebaseanalytics.logEvent('page_load', {
        page_name: 'put_NFT_on_Sale',
      });
      this.service
        // 1:nft identifer , 2:blockchain, 0:selling status
        .getNFTDetails(this.data[1], this.data[0], this.data[2])
        .subscribe((data: any) => {
          this.NFTList = data.Response[0];
          this.getCurrencyRate()
          // this.currencyRate=0.1;
          if (this.NFTList == null) {
            this.ngOnInit();
          }
          if (this.data[0] == 'Minted') {
            this.prevOwner = 'None - Genesis';
          } else {
            this.prevOwner = this.NFTList.distributorpk;
          }

          if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
            //might be distributor
            this.Royalty = this.NFTList.royalty;
            this.value = false;
          } else {
            this.Royalty = this.NFTList.royalty;

            this.value = true;
          }
          if(this.NFTList.artistprofilelink!=""){
            this.usercontentURLFlag=true;
            this.userprofileURL=this.NFTList.artistprofilelink;
          }
          if(this.NFTList.nftcontenturl!=""){
            this.nftcontentURLFlag=true;
            this.nftContentURL=this.NFTList.nftcontenturl
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
          this.apiService
            .getAllStoryByNFTIdAndBlockchain(
              this.NFTList.nftidentifier,
              this.NFTList.blockchain
            )
            .subscribe((data) => {
              if (!!data) {
                this.htmStr = atob(data.Response[0].NFTStory);
                this.storyAvailable = Boolean(data.Response[0].NFTStory);
                const content = this.htmStr;
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
                this.html = html;
                this.populateIframe(this.iframe.nativeElement, html);
              }
            });
          this.firebaseanalytics.logEvent('NFT_details_tobeputonsale', {
            blockchain: this.NFTList.blockchain,
            attachment_type: this.NFTList.attachmenttype,
          });
          if (this.NFTList.blockchain == 'ethereum') {
            this.image = '../../../assets/images/blockchain-icons/ethereum.png';
          }
          if (this.NFTList.blockchain == 'polygon') {
            this.image = '../../../assets/images/polygon-dd.png';
          }
          if (this.NFTList.blockchain == 'stellar') {
            this.image = '../../../assets/images/stellar-dd.png';
          }
          if (this.NFTList.blockchain == 'solana') {
            this.image = '../../../assets/images/solana-dd.png';
          }

          this.service
            .getSVGByHash(this.NFTList.imagebase64)
            .subscribe((res: any) => {
              this.Decryption = res.Response.Base64ImageSVG;
              if (
                this.NFTList.attachmenttype == 'image/jpeg' ||
                this.NFTList.attachmenttype == 'image/jpg' ||
                this.NFTList.attachmenttype == 'image/png'
              ) {
                if (this.NFTList.thumbnail == '') {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.Decryption.toString()
                    );
                  this.maincontent =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.Decryption.toString()
                    );
                } else {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.NFTList.thumbnail
                    );
                  this.maincontent =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.Decryption.toString()
                    );
                }
              } else {
                this.dec = btoa(this.Decryption);
                var str2 = this.dec.toString();
                var str1 = new String('data:image/svg+xml;base64,');
                var src = str1.concat(str2.toString());
                if (this.NFTList.thumbnail == '') {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(src);
                } else {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.NFTList.thumbnail
                    );
                  this.maincontent =
                    this._sanitizer.bypassSecurityTrustResourceUrl(src);
                }
              }
            });

          this.service
            .getTXNByBlockchainandIdentifier(
              this.NFTList.nftidentifier,
              this.NFTList.blockchain
            )
            .subscribe((txn: any) => {
              for (let x = 0; x < txn.Response.length; x++) {
                let card: Track = new Track('', '', '', '');
                card.NFTName = txn.Response[x].NFTName;
                card.Status = txn.Response[x].Status;
                card.Time = txn.Response[x].Time
                const unwantedText = 'GMT+0530 (India Standard Time)';
                card.Time = card.Time.replace(
                  unwantedText,
                  ''
                );
                if (txn.Response[x].Blockchain == 'ethereum') {
                  card.NFTTxnHash =
                    'https://etherscan.io/tx/' + txn.Response[x].NFTTxnHash;
                }
                if (txn.Response[x].Blockchain == 'polygon') {
                  card.NFTTxnHash =
                    'https://polygonscan.com/tx/' + txn.Response[x].NFTTxnHash;
                }
                if (txn.Response[x].Blockchain == 'stellar') {
                  card.NFTTxnHash =
                    'https://stellar.expert/explorer/public/tx/' +
                    txn.Response[x].NFTTxnHash;
                }
                if (txn.Response[x].Blockchain == 'solana') {
                  card.NFTTxnHash =
                    'https://solscan.io/tx/' + txn.Response[x].NFTTxnHash;
                }

                this.List.push(card);
              }
            });
          this.isLoading = false;
        });
    } else {
      this.firebaseanalytics.logEvent('error', {
        reason: 'account not endorserd',
        trigger_location: 'sell screen',
      });
      this.snackbarService.openSnackBar(
        'User PK not connected or not endorsed',
        'info'
      );
    }

    this.controlGroupSell = new FormGroup({
      Price: new FormControl(this.sale.Price, [Validators.pattern(/^\d+(\.\d{1,6})?$/)]),
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
    let data: any[] = [this.NFTList.nftidentifier, this.NFTList.blockchain];
    this.router.navigate(['./createblog'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  public populateIframe(iframe: any, data: string) {
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(data);
    iframe.contentWindow.document.close();
    this.loaded = false;
  }

  public convertToUSD(event: any, type: string) {
    if (type === 'selling') {
      // `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${this.NFTList.blockchain}`
      fetch(
        'api.coincap.io/v2/rates/'
      )
        .then((res) => res.json())
        .then((res) => {
          const rate = res[5].id;
          this.currencyRate = rate;
          const amount = parseFloat(event.target.value);
          this.sellingPriceUSD = amount * rate;
          if (Number.isNaN(this.sellingPriceUSD)) {
            this.sellingPriceUSD = 0;
          }
          this.calculateRoyaltyPriceUSD();
        })
        .catch(() => {
          this.sellingPriceUSD = 0;
        });
    } else {
      this.calculateRoyaltyPriceUSD();
    }
  }
  public convertToUSDv2(event: any, type: string) {
    if (type === 'selling') {
          const amount = parseFloat(event.target.value);
          this.sellingPriceUSD = amount * this.currencyRate;
          if (Number.isNaN(this.sellingPriceUSD)) {
            this.sellingPriceUSD = 0;
          }
          this.calculateRoyaltyPriceUSD();
    } else {
      this.calculateRoyaltyPriceUSD();
    }
  }

  public getCurrencyRate(){
    this.currencyConverter.GetUSDratebyBC(this.NFTList.blockchain).subscribe(res=>{
      this.currencyRate=res.data.priceUsd;
    })
  }

  public calculateRoyaltyPriceUSD() {
    this.calculatePrice();
        let amount = this.royaltyCharge;
        if (amount === 'NaN') {
          amount = 0;
        }
        this.royaltyPriceUSD = amount * this.currencyRate;

  }
}
