import { Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { FreighterComponent } from './../../../wallet/freighter/freighter.component';
import { UserWallet } from 'src/app/models/userwallet';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import {
  NFTMarket,
  SalesBE,
  BuyNFTGW,
  GetNFT,
  ReviewsCard,
  Reviews,
} from 'src/app/models/nft';
import {
  APIConfigENV,
  BlockchainConfig,
  environment,
} from 'src/environments/environment';
import { TrustLineByBuyerServiceService } from 'src/app/services/blockchain-services/stellar-services/trust-line-by-buyer-service.service';
import { Trac2buyerService } from 'src/app/services/blockchain-services/solana-services/trac2buyer.service';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Ownership, SVG, Track, TXN } from 'src/app/models/minting';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import {
  clusterApiUrl,
  Connection,
  Transaction as solanaTransaction,
} from '@solana/web3.js';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { TransferNftService } from 'src/app/services/blockchain-services/solana-services/transfer-nft.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TrustByBuyerService } from 'src/app/services/blockchain-services/stellar-services/albedo-transactions/trust-by-buyer.service';
import {
  ConfirmDialogText,
  PendingDialogText,
  SelectWalletText,
  SnackBarText,
} from 'src/app/models/confirmDialog';
import { catchError, interval, throwError, timer } from 'rxjs';
import albedo from '@albedo-link/intent';
import { Float } from '@solana/buffer-layout';
import { MintService } from 'src/app/services/blockchain-services/mint.service';
import { Seller2tracService } from 'src/app/services/blockchain-services/solana-services/seller2trac.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase/firebase-analytics.service';
import { QueueNFT } from 'src/app/models/nft';
import { StellarUtilService } from 'src/app/services/blockchain-services/stellar-services/stellar-util.service';
import { WalletType } from 'src/app/models/enums/wallets';
import { TransactionBuilderService } from 'src/app/services/blockchain-services/stellar-services/transaction-builder.service';
import { StellarNFTOperationType } from 'src/app/models/enums/blockchain';
import { error } from 'console';

@Component({
  selector: 'app-buy-view',
  templateUrl: './buy-view.component.html',
  styleUrls: ['./buy-view.component.css'],
})
export class BuyViewComponent implements OnInit {
  selectedTab: number = 0;
  filter: string = 'newest';
  isLoadingPresent: boolean;
  loading: any;
  imageSrc: any;
  rating: any = 'checked';
  NFTList: any;
  List: any[] = [];
  ReviewList: any[] = [];
  reviews: Reviews = new Reviews('', '', '', 0.0, '', '');
  controlGroup: FormGroup;
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
  buyGW: BuyNFTGW = new BuyNFTGW('', '', '', '');
  own: Ownership = new Ownership('', '', '', '', 1);
  nftbe: GetNFT = new GetNFT(
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
    '',
    ''
  );
  signerSK = 'SBKFJD35H4EZBMBELBB7SZQR4ZZ2H5WMRO4N6KWALXMF63DWJVMR2K5D';
  newATA: any;
  Decryption: any;
  buytxn: any;
  data: any;
  svg: SVG = new SVG('', '', 'NA', '', '');
  txn: TXN = new TXN('', '', '', '', '', '', '');
  queue: QueueNFT = new QueueNFT('', '', '', '', '', '');
  dec: string;
  transaction: Uint8Array;
  signer: Uint8Array;
  userPK: string;
  watchlist: any;
  favorites: any;
  image: string;
  list: any;
  public loaded = false;
  private htmStr: string;
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  price: any;
  conversion: any;
  icon: string;
  crypto: string;
  currentPage: number = 1;
  observer: IntersectionObserver;
  review: any;
  loadingn: boolean = false;
  nextPageLoading: boolean = false;
  filterChanged: boolean = false;
  hasStory: boolean = true;
  maincontent: any;
  isLoading: boolean = false;
  readonly network: any = BlockchainConfig.solananetworkURL;
  wallet: any;
  total: number;
  commission: string;
  royalty: number;
  serviceCharge: string;
  services: number;
  commissionForNonContracts: string;
  royaltyCharge: any;
  fullTotal: string;
  contractTotal: number;
  totals: number;
  royaltyR: number;
  royaltyCharges: number;
  servicess: number;
  commissions: string;
  R: number;
  addSubscription: any;
  atastatus: string;
  storyAvailable: boolean = false;
  usercontentURLFlag: boolean = false;
  nftcontentURLFlag: boolean = false;
  userprofileURL: string = '';
  nftcontentURL: string = '';
  count: number = 0;

  constructor(
    private service: NftServicesService,
    private trust: TrustLineByBuyerServiceService,
    private trustalbedo: TrustByBuyerService,
    private ata: Trac2buyerService,
    private _sanitizer: DomSanitizer,
    private emarket: EthereumMarketServiceService,
    private pmarket: PolygonMarketServiceService,
    private apiService: ApiServicesService,
    private transfer: TransferNftService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private snackbar: SnackbarServiceService,
    public dialog: MatDialog,
    private servicemint: MintService,
    private servicesell: Seller2tracService,
    private firebaseanalytics: FirebaseAnalyticsService,
    private stellarUtilService: StellarUtilService,
    private StellarTransactionBuilder: TransactionBuilderService
  ) { }

  public async getDeviceType(): Promise<boolean> {
    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    let isMobileDevice = await regexp.test(details);
    return isMobileDevice;
  }

  async buyNFT(): Promise<void> {
    this.firebaseanalytics.logEvent('button clicked', {
      button_name: 'buy now',
    });

    if (this.nftbe.Blockchain == 'stellar') {
      let details = navigator.userAgent;

      let regexp = /android|iphone|kindle|ipad/i;

      let isMobileDevice = await regexp.test(details);
      if (isMobileDevice) {
        await albedo
          .publicKey({
            require_existing: true,
          })
          .then((res: any) => {
            this.userPK = res.pubkey;
          });
      } else {
        let walletf = new UserWallet();
        walletf = new FreighterComponent(walletf);
        await walletf.initWallelt();
        this.userPK = await walletf.getWalletaddress();
      }
    } else if (this.nftbe.Blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.userPK = phantomWallet.getWalletaddress();
    } else if (
      this.nftbe.Blockchain == 'ethereum' ||
      this.nftbe.Blockchain == 'polygon'
    ) {
      let walletMetamask = new UserWallet();
      walletMetamask = new MetamaskComponent(walletMetamask);
      await walletMetamask.initWallelt();
      this.userPK = await walletMetamask.getWalletaddress();
    }
    this.updateBackend(this.userPK);
  }

  calculateCommision() {
    if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
      this.total = parseFloat(this.NFTList.currentprice);
      this.royalty = parseFloat(this.NFTList.royalty);
      this.royaltyCharge = (this.total * (this.royalty / 100.0)).toPrecision(6);
      this.services = parseFloat(this.NFTList.commission);
      this.commission = this.services.toString(); //(((this.total) * (5.00/100.00))).toString()
      this.contractTotal = this.total + this.royaltyCharge;
    } else {
      this.total = parseFloat(this.NFTList.currentprice);
      this.royalty = parseFloat(this.NFTList.royalty);
      this.services = parseFloat(this.NFTList.commission);
      this.royaltyCharge = (this.total * (this.royalty / 100.0)).toPrecision(6);
      this.commission = this.services.toString(); //((this.total * (2.00/100.00))).toString()
    }
  }

  async updateBackend(user: string): Promise<void> {
    this.saleBE.CurrentPrice = this.NFTList.currentprice;
    this.saleBE.Royalty = this.NFTList.royalty;
    this.saleBE.SellingStatus = 'NOTFORSALE';
    this.saleBE.Commission = this.NFTList.commission;

    if (this.NFTList.blockchain == 'stellar') {
      this.saleBE.SellingType = 'NFT';
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftissuerpk;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.calculateCommision();
      this.dialogService
        .confirmMintDialog({
          promtHeading: 'You are Buying',
          nftName: this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName: 'NFT Price',
          serviceFee: parseFloat(this.fullTotal),
          total: parseFloat(this.fullTotal),
          blockchain: this.NFTList.blockchain,
          buttonAction: 'Buy Now',
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle: 'Buying',
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
              thumbnail: this.NFTList.thumbnail,
            });
            this.buyNFTOnStellar(this.userPK, () => {
              loadingAnimation.close();
              return;
            });
          }
        });
    }
    if (this.NFTList.blockchain == 'solana') {
      this.calculateCommision();
      const connection = new Connection(this.network);
      this.userPK = user;
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.saleBE.SellingType = 'NFT';
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.dialogService
        .confirmMintDialog({
          promtHeading: 'You are Buying',
          nftName: this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName: 'NFT Price',
          serviceFee: parseFloat(this.fullTotal),
          total: parseFloat(this.fullTotal),
          blockchain: this.NFTList.blockchain,
          buttonAction: 'Buy Now',
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle: 'Buying',
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
              thumbnail: this.NFTList.thumbnail,
            });

            this.servicesell
              .findATA(user, this.NFTList.nftissuerpk)
              .then((resAta: any) => {
                if (resAta == null) {
                  this.atastatus = '0';
                } else {
                  this.atastatus = '1';
                }
              })
              .then((res) => {
                this.saleBE.Timestamp = new Date().toString();
                this.ata
                  .createATAforBuyer(
                    this.total,
                    user,
                    this.royaltyCharge,
                    this.NFTList.creatoruserid,
                    this.NFTList.currentownerpk,
                    this.services.toString()
                  )
                  .then(async (result: solanaTransaction) => {
                    try {
                      let isMobile = await this.getDeviceType();
                      let tx;
                      if (isMobile) {
                        const { signature } = await (
                          window as any
                        ).solana.signAndSendTransaction(result, ['finalized']);
                        await connection.confirmTransaction(signature);
                      } else {
                        const { signature } = await (
                          window as any
                        ).solana.signAndSendTransaction(result);
                        tx = await connection.confirmTransaction(signature);
                      }
                      if (tx != null) {
                        //check
                        this.transfer
                          .createServiceATAforTransfer(
                            environment.fromWallet,
                            user,
                            this.NFTList.nftissuerpk
                          )

                          .subscribe(async (res: any) => {
                            try {
                              loadingAnimation.close();
                              this.buytxn = res;
                              this.saveTXNs();
                              this.service
                                .updateNFTStatusBackend(this.saleBE)
                                .subscribe((res) => {
                                  this.updateGateway();
                                  this.snackbar.openSnackBar(
                                    SnackBarText.BOUGHT_SUCCESS_MESSAGE,
                                    'success'
                                  );
                                  //this.showInProfile();
                                });
                            } catch (err) {
                              this.snackbar.openSnackBar(
                                'Something went wrong, please try again! More information: ' +
                                err,
                                'error'
                              );
                            }
                          });
                      }
                    } catch (err) {
                      this.snackbar.openSnackBar(
                        'Something went wrong, please try again! More information: ' +
                        err,
                        'error'
                      );
                    }
                  });
              });
          }
        });
    }
    if (this.NFTList.blockchain == 'polygon') {
      this.saleBE.MarketContract = environment.contractAddressMKPolygon;
      this.saleBE.NFTIdentifier = this.nftbe.NFTIdentifier;
      this.saleBE.SellingType = this.NFTList.sellingtype;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.saleBE.SellingStatus = 'NOTFORSALE';
      this.calculateCommision();
      this.userPK = user;
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.dialogService
        .confirmMintDialog({
          promtHeading: 'You are Buying',
          nftName: this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName: 'NFT Price',
          serviceFee: parseFloat(this.fullTotal),
          total: parseFloat(this.fullTotal),
          blockchain: this.NFTList.blockchain,
          buttonAction: 'Buy Now',
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle: 'Buying',
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
              thumbnail: this.NFTList.thumbnail,
            });
            this.pmarket
              .BuyNFT(this.NFTList.sellingtype, this.total.toString(), () => {
                loadingAnimation.close();
              })
              .then((res) => {
                try {
                  this.saleBE.Timestamp = new Date().toString();
                  this.buytxn = res.transactionHash;
                  this.saveTXNs();
                  this.service.updateNFTStatusBackend(this.saleBE).subscribe();
                  this.updateGateway();
                  loadingAnimation.close();
                  this.snackbar.openSnackBar(
                    SnackBarText.BOUGHT_SUCCESS_MESSAGE,
                    'success'
                  );
                  this.showInProfile();
                } catch (err) {
                  this.snackbar.openSnackBar(
                    'Something went wrong, please try again! More information: ' +
                    err,
                    'error'
                  );
                }
              });
          }
        });
    }
    if (this.NFTList.blockchain == 'ethereum') {
      this.saleBE.MarketContract = environment.contractAddressMKEthereum;
      this.saleBE.NFTIdentifier = this.nftbe.NFTIdentifier;
      this.saleBE.SellingType = this.NFTList.sellingtype;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.saleBE.SellingStatus = 'NOTFORSALE';
      this.calculateCommision();
      this.userPK = user;
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.dialogService
        .confirmMintDialog({
          promtHeading: 'You are Buying',
          nftName: this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName: 'NFT Price',
          serviceFee: parseFloat(this.fullTotal),
          total: parseFloat(this.fullTotal),
          blockchain: this.NFTList.blockchain,
          buttonAction: 'Buy Now',
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle: 'Buying',
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
              thumbnail: this.NFTList.thumbnail,
            });
            this.emarket
              .BuyNFT(this.NFTList.sellingtype, this.total.toString(), () => {
                loadingAnimation.close();
              })
              .then((res) => {
                try {
                  this.saleBE.Timestamp = new Date().toString();
                  this.buytxn = res.transactionHash;
                  this.saveTXNs();
                  this.service.updateNFTStatusBackend(this.saleBE).subscribe();
                  this.updateGateway();
                  loadingAnimation.close();
                  this.snackbar.openSnackBar(
                    SnackBarText.BOUGHT_SUCCESS_MESSAGE,
                    'success'
                  );
                  this.showInProfile();
                } catch (err) {
                  this.snackbar.openSnackBar(
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

  updateGateway(): void {
    this.buyGW.CurrentOwnerNFTPK = this.userPK;
    this.buyGW.PreviousOwnerNFTPK = this.NFTList.distributorpk;
    this.buyGW.SellingStatus = 'NOT FOR SALE';
    this.buyGW.NFTTXNhash = this.NFTList.nfttxnhash;
    this.pushOwner();
    this.service
      .updateNFTBuyStatusGateway(
        this.buyGW.SellingStatus,
        this.buyGW.CurrentOwnerNFTPK,
        this.buyGW.PreviousOwnerNFTPK,
        this.buyGW.NFTTXNhash
      )
      .subscribe((r) => {
        this.showInProfile();
      });
  }

  pushOwner(): void {
    //posting owner data via service to backend
    this.own.NFTIdentifier = this.NFTList.nftidentifier;
    this.own.CurentOwnerPK = this.userPK;
    this.own.PreviousOwnerPK = this.NFTList.distributorpk;
    this.own.Status = 'BOUGHT';
    this.own.OwnerRevisionID = 3;
    if (this.NFTList.distributorpk != null) {
      this.addSubscription = this.servicemint.addOwner(this.own).subscribe();
    }
  }

  saveTXNs(): void {
    this.txn.Blockchain = this.NFTList.blockchain;
    this.txn.ImageURL = this.NFTList.imagebase64;
    this.txn.NFTIdentifier = this.NFTList.nftidentifier;
    this.txn.NFTName = this.NFTList.nftname;
    this.txn.NFTTxnHash = this.buytxn;
    this.txn.Status = 'BOUGHT';
    this.txn.Time = new Date().toString();

    this.apiService.addTXN(this.txn).subscribe();
  }

  async buyNFTOnStellar(user: string, _callback?: any): Promise<void> {
    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    let isMobileDevice = await regexp.test(details);
    if (isMobileDevice) {
      this.userPK = user;

      this.StellarTransactionBuilder.purchaseNFT(
        this.NFTList.nftname,
        this.NFTList.nftissuerpk,
        this.userPK,
        this.NFTList.currentprice,
        this.NFTList.distributorpk,
        this.royaltyCharge.toString(),
        this.commission,
        true,
        WalletType.ALBEDO_WALLET,
      ).then((resultXDR) => {
        this.stellarUtilService.SubmitXDRToGateway(resultXDR, StellarNFTOperationType.BUY).subscribe({
          next: (rst:any) => {
            if (rst.hash != "" && rst.account !="") {
              try {
                this.snackbar.openSnackBar(
                  SnackBarText.BOUGHT_SUCCESS_MESSAGE,
                  'success'
                );
                this.buytxn = rst.hash;
                this.saleBE.CurrentOwnerPK = rst.account;
                this.saveTXNs();
                this.service
                  .updateNFTStatusBackend(this.saleBE)
                  .subscribe();
                this.updateGateway();
              }
              catch (error) {
                this.snackbar.openSnackBar(
                  SnackBarText.BOUGHT_SUCCESS_MESSAGE,
                  'error'
                );
              }
            }else{
              this.snackbar.openSnackBar(
                "NFT has already beign pruchased by someone.",
                "error"
              );
              _callback()
            }
          },
          error: err => {
            this.snackbar.openSnackBar(
              "unable to purchase NFT: ",
              "error"
            );
            _callback()
          },

        })
      }).catch(err => {
        this.snackbar.openSnackBar(
          "unable to purchase NFT: ",
          "error"
        );
      })
    } else {
      this.StellarTransactionBuilder.purchaseNFT(
        this.NFTList.nftname,
        this.NFTList.nftissuerpk,
        this.userPK,
        this.NFTList.currentprice,
        this.NFTList.distributorpk,
        this.royaltyCharge.toString(),
        this.commission,
        true,
        WalletType.FREIGHTER_WALLET,
      ).then((resultXDR) => {
        this.stellarUtilService.SubmitXDRToGateway(resultXDR, StellarNFTOperationType.BUY).subscribe({
          next: (rst:any) => {
            if (rst.hash !="" && rst.account !="") {
              try {
                this.snackbar.openSnackBar(
                  SnackBarText.BOUGHT_SUCCESS_MESSAGE,
                  'success'
                );
                this.buytxn = rst.hash;
                this.saleBE.CurrentOwnerPK = rst.account;
                this.saveTXNs();
                this.service
                  .updateNFTStatusBackend(this.saleBE)
                  .subscribe();
                this.updateGateway();
              }
              catch (error) {
                this.snackbar.openSnackBar(
                  SnackBarText.BOUGHT_SUCCESS_MESSAGE,
                  'error'
                );
                _callback();
              }
            }else{
              this.snackbar.openSnackBar(
                "NFT has already beign pruchased by someone.",
                "error"
              );
              _callback()
            }
          },
          error: err => {
            this.snackbar.openSnackBar(
              "unable to purchase NFT",
              "error"
            );
            _callback()
          },

        })
      }).catch(err => {
        this.snackbar.openSnackBar(
          "unable to purchase NFT",
          "error"
        );
        _callback()
      })
    }
  }

  dissmissLoading() {
    this.isLoadingPresent = false;
    this.loading.dismiss();
  }

  goToReviews() {
    let data: any = this.NFTList;
    this.router.navigate(['./userreview'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  goToStory() {
    let data: any = this.NFTList;
    this.router.navigate(['./blogs'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  goToActvity() {
    let data: any = this.NFTList;
    this.router.navigate(['./activity'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  showInProfile() {
    this.firebaseanalytics.logEvent('buy_success', {
      operation_result: 'success',
    });
    sessionStorage.setItem('refreshProfile', '1');
    this.router.navigate(['/user-dashboard'], {
      queryParams: {
        user: this.saleBE.CurrentOwnerPK,
        blockchain: this.nftbe.Blockchain,
      },
    });
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

  ngOnInit(): void {
    this.firebaseanalytics.logEvent('page_load', {
      page_name: 'Buy_NFT_Screen',
    });
    this.userPK = '';
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      this.nftbe.Blockchain = this.data[1];
      this.nftbe.NFTIdentifier = this.data[0];
      this.nftbe.SellingStatus = 'ON SALE';
      this.isLoading = true;
      if (
        this.nftbe.NFTIdentifier != null &&
        this.nftbe.SellingStatus == 'ON SALE' &&
        this.nftbe.Blockchain == this.data[1]
      ) {
        this.service
          .getNFTDetails(
            this.nftbe.NFTIdentifier,
            this.nftbe.SellingStatus,
            this.nftbe.Blockchain
          )
          .subscribe((data: any) => {
            this.NFTList = data.Response[0];

            if (this.NFTList == null) {
              this.ngOnInit();
            }
            if (this.NFTList.artistprofilelink != '') {
              this.usercontentURLFlag = true;
              this.userprofileURL = this.NFTList.artistprofilelink;
            }
            if (this.NFTList.nftcontenturl != '') {
              this.nftcontentURLFlag = true;
              this.nftcontentURL = this.NFTList.nftcontenturl;
            }
            if (this.NFTList.creatoruserid == this.NFTList.currentownerpk) {
              //might

              this.totals = parseFloat(this.NFTList.currentprice);
              this.royaltyR = parseFloat(this.NFTList.royalty);
              this.royaltyCharges = this.totals * (this.royaltyR / 100.0);
              this.servicess = parseFloat(this.NFTList.commission);
              this.commissions = (this.totals * (5.0 / 100.0))
                .toFixed(7)
                .toString();
              this.fullTotal = (
                this.totals +
                this.royaltyCharges +
                this.servicess
              )
                .toFixed(7)
                .toString();
            } else {
              this.totals = parseFloat(this.NFTList.currentprice);
              this.royaltyR = parseFloat(this.NFTList.royalty);
              this.servicess = parseFloat(this.NFTList.commission);
              this.royaltyCharges = this.totals * (this.royaltyR / 100.0);
              this.commissions = (this.totals * (2.5 / 100.0))
                .toFixed(7)
                .toString();
              this.fullTotal = (
                this.totals +
                this.royaltyCharges +
                this.servicess
              )
                .toFixed(7)
                .toString();
            }
            this.apiService
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

            this.apiService
              .getAllReviewsByNFTId(this.NFTList.nftidentifier)
              .subscribe((res: any) => {
                this.list = res;
                for (let x = 0; x < this.list.length; x++) {
                  let reviewcard: ReviewsCard = new ReviewsCard('', '', '', '');
                  reviewcard.UserID = this.list[x].userid;
                  reviewcard.Rating = this.list[x].rating;
                  reviewcard.Description = this.list[x].description;
                  reviewcard.Timestamp = this.list[x].timestamp;
                  const unwantedText = 'GMT+0530 (India Standard Time)';
                  reviewcard.Timestamp = reviewcard.Timestamp.replace(
                    unwantedText,
                    ''
                  );
                  this.ReviewList.push(reviewcard);
                }
              });

            this.getUSDConversion();
            this.apiService
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
                  this.populateIframe(this.iframe.nativeElement, html);
                }
              });
            this.firebaseanalytics.logEvent('NFT_details_buy', {
              blockchain: this.NFTList.blockchain,
              attachment_type: this.NFTList.attachmenttype,
            });
            if (this.NFTList.blockchain == 'ethereum') {
              this.image =
                '../../../assets/images/blockchain-icons/ethereum.png';
              this.icon = '../../../assets/images/blockchain-icons/ether.png';
              this.crypto = 'ETH';
            }
            if (this.NFTList.blockchain == 'polygon') {
              this.image = '../../../assets/images/polygon-dd.png';
              this.icon = '../../../assets/images/blockchain-icons/poly.png';
              this.crypto = 'MATIC';
            }
            if (this.NFTList.blockchain == 'stellar') {
              this.image = '../../../assets/images/stellar-dd.png';
              this.icon = '../../../assets/images/blockchain-icons/xlm.png';
              this.crypto = 'XLM';
            }
            if (this.NFTList.blockchain == 'solana') {
              this.image = '../../../assets/images/solana-dd.png';
              this.icon = '../../../assets/images/blockchain-icons/sol.png';
              this.crypto = 'SOL';
            }

            this.svg.Hash = this.NFTList.imagebase64;
            this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
              this.Decryption = res.Response.Base64ImageSVG;
              if (
                this.NFTList.attachmenttype == 'image/jpeg' ||
                this.NFTList.attachmenttype == 'image/jpg' ||
                this.NFTList.attachmenttype == 'image/png'
              ) {
                if (this.NFTList.thumbnail != '') {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.NFTList.thumbnail
                    );
                  this.maincontent =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.Decryption.toString()
                    );
                } else {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.Decryption.toString()
                    );
                }
              } else {
                this.dec = btoa(this.Decryption);
                var str2 = this.dec.toString();
                var str1 = new String('data:image/svg+xml;base64,');
                var src = str1.concat(str2.toString());
                if (this.NFTList.thumbnail != '') {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.NFTList.thumbnail
                    );
                } else {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(src);
                }
              }
              this.service
                .getTXNByBlockchainandIdentifier(
                  this.NFTList.nftidentifier,
                  this.NFTList.blockchain
                )
                .subscribe((txn: any) => {
                  for (let x = 0; x < txn.Response.length; x++) {
                    let card: Track = new Track('', '', '', '');
                    card.Time = txn.Response[x].Time;
                    const unwantedText = 'GMT+0530 (India Standard Time)';
                    card.Time = card.Time.replace(unwantedText, '');
                    card.NFTName = txn.Response[x].NFTName;
                    card.Status = txn.Response[x].Status;
                    if (txn.Response[x].Status == 'ON SALE') {
                      this.count = this.count + 1;
                    }
                    if (txn.Response[x].Blockchain == 'ethereum') {
                      card.NFTTxnHash =
                        'https://etherscan.io/tx/' + txn.Response[x].NFTTxnHash;
                    }
                    if (txn.Response[x].Blockchain == 'polygon') {
                      card.NFTTxnHash =
                        'https://polygonscan.com/tx/' +
                        txn.Response[x].NFTTxnHash;
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
            });

            if (this.NFTList == null) {
              this.ngOnInit();
            }
            this.svg.Hash = this.NFTList.imagebase64;
            this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
              this.Decryption = res.Response.Base64ImageSVG;
              if (
                this.NFTList.attachmenttype == 'image/jpeg' ||
                this.NFTList.attachmenttype == 'image/jpg' ||
                this.NFTList.attachmenttype == 'image/png'
              ) {
                if (this.NFTList.thumbnail != '') {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.NFTList.thumbnail
                    );
                } else {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.Decryption.toString()
                    );
                }
              } else {
                this.dec = btoa(this.Decryption);
                var str2 = this.dec.toString();
                var str1 = new String('data:image/svg+xml;base64,');
                var src = str1.concat(str2.toString());
                if (this.NFTList.thumbnail != '') {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(
                      this.NFTList.thumbnail
                    );
                } else {
                  this.imageSrc =
                    this._sanitizer.bypassSecurityTrustResourceUrl(src);
                }
              }
            });

            this.controlGroup = new FormGroup({
              rating: new FormControl(this.reviews.Rating, Validators.required),
              description: new FormControl(
                this.reviews.Description,
                Validators.required
              ),
              userid: new FormControl(this.reviews.UserID, Validators.required),
            });
            this.isLoading = false;
          });
      } else {
        this.firebaseanalytics.logEvent('error', {
          reason: 'account not endorserd',
          trigger_location: 'buy screen',
        });
        this.snackbar.openSnackBar(
          'User PK not connected or not endorsed',
          'info'
        );
      }
    });
  }

  public goToExplore() {
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: this.nftbe.Blockchain, filter: 'all' },
    });
  }

  public addReview() {
    this.selectedTab = 1;
    const el = document.getElementById('reviewLabel');
    el?.scrollIntoView();
  }
  public prevTab() {
    this.selectedTab = 0;
  }

  public setFilter(filter: string, id: string) {
    const timer$ = timer(0, APIConfigENV.homepageIntervalTimer);
    timer$.subscribe((data) => {
      this.loadingn = true;

      this.ReviewList.splice(0);
      this.filter = filter;
      this.intersectionObserver(filter, id);
      if (!this.loadingn) {
        this.nextPageLoading = true;
      }
      this.apiService
        .getReviewsByFilter(this.filter, this.currentPage, id)
        .subscribe((res: any) => {
          this.review = res.Response.reviewcontent;
          this.nextPageLoading = false;
          for (let x = 0; x < this.review.length; x++) {
            let reviewcard: ReviewsCard = new ReviewsCard('', '', '', '');
            reviewcard.UserID = this.review[x].userid;
            reviewcard.Rating = this.review[x].rating;
            reviewcard.Description = this.review[x].description;
            reviewcard.Timestamp = this.review[x].timestamp;
            this.ReviewList.push(reviewcard);
          }
        });
      interval(APIConfigENV.APIStartDelay).subscribe((data) => {
        this.loadingn = false;
      });
    });
  }

  intersectionObserver(filter, id) {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.review.Response.PaginationInfo.nextpage !== 0) {
          this.currentPage++;
          this.setFilter(filter, id);
        }
      }
    }, option);
  }

  public openConfirmation() {
    this.reviews.Status = 'Pending';
    this.reviews.Description = this.controlGroup
      .get('description')!
      .value.trim();
    this.reviews.Rating = Number(this.controlGroup.get('rating')!.value);
    this.reviews.NFTIdentifier = this.NFTList.nftidentifier;
    this.reviews.UserID = this.controlGroup.get('userid')!.value.trim();
    this.reviews.Timestamp = new Date().toString();
    if (
      this.reviews.UserID == '' ||
      this.reviews.Description == '' ||
      this.reviews.Rating == 0
    ) {
      this.snackbar.openSnackBar(
        'Please fill in all fields and provide a star rating. Your input matters!',
        'info'
      );
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'User review confirmation',
        message: 'Are you sure you want to submit this review',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .subscribe((result) => {
        if (result) {
          this.apiService.addReviews(this.reviews).subscribe((res) => {
            if (res != null) {
              this.snackbar.openSnackBar(
                'Your review has been Successfully submitted',
                'success'
              );
              this.cleanReviews();
            } else {
              this.snackbar.openSnackBar(
                'Failed to submit review please try again.',
                'error'
              );
            }
          });
        }
      });
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  cleanReviews() {
    window.location.reload();
  }

  getUSDConversion() {
    if (this.nftbe.Blockchain == 'ethereum') {
      this.apiService.getUSD('eth-usd').subscribe((res: any) => {
        this.conversion = res.ticker.price;
        this.price = this.NFTList.currentprice * this.conversion;
      });
    }
    if (this.nftbe.Blockchain == 'polygon') {
    }
    if (this.nftbe.Blockchain == 'stellar') {
    }
    if (this.nftbe.Blockchain == 'solana') {
    }
  }
  ngAfterViewInit() {
    /* let htmlopen: string = '<body style="color:white;">';
    let htmlclose: string = '</body>';
    this.populateIframe(this.iframe.nativeElement, `${htmlopen}<div style="display : flex;flex-direction : row; justify-content: center; align-items : center; height : 100px ">No Story</div>${htmlclose}`) */
  }

  public populateIframe(iframe: any, data: string) {
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(data);
    iframe.contentWindow.document.close();
    this.loaded = false;
  }
}
