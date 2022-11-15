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
import { environment } from 'src/environments/environment';
import { TrustLineByBuyerServiceService } from 'src/app/services/blockchain-services/stellar-services/trust-line-by-buyer-service.service';
import { BuyNftServiceService } from 'src/app/services/blockchain-services/stellar-services/buy-nft-service.service';
import { Trac2buyerService } from 'src/app/services/blockchain-services/solana-services/trac2buyer.service';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SVG, Track, TXN } from 'src/app/models/minting';
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
import { CodeviewComponent } from 'src/app/nft/codeview/codeview.component';
import { timeStamp } from 'console';
import {
  ConfirmDialogText,
  PendingDialogText,
  SnackBarText,
} from 'src/app/models/confirmDialog';

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
  reviews: Reviews = new Reviews('', '', '', 0.0, '','');
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
    ''
  );
  saleBE: SalesBE = new SalesBE('', '', '', '', '', '', '', '', '');
  buyGW: BuyNFTGW = new BuyNFTGW('', '', '', '');
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
    ''
  );
  signerSK = 'SBKFJD35H4EZBMBELBB7SZQR4ZZ2H5WMRO4N6KWALXMF63DWJVMR2K5D';
  newATA: any;
  Decryption: any;
  buytxn: any;
  data: any;
  svg: SVG = new SVG('', '', 'NA','');
  txn: TXN = new TXN('', '', '', '', '', '');
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
  hasStory : boolean = true;

  constructor(
    private service: NftServicesService,
    private trust: TrustLineByBuyerServiceService,
    private buyNftService: BuyNftServiceService,
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
    public dialog: MatDialog
  ) {}
  buyNFT(): void {
    this.updateBackend();
  }

  async updateBackend(): Promise<void> {
    this.saleBE.CurrentPrice = this.NFTList.currentprice;
    this.saleBE.Royalty = this.NFTList.royalty;
    this.saleBE.SellingStatus = 'NOTFORSALE';
    this.saleBE.Timestamp = '2022-04-21:13:41:00';
    if (this.NFTList.blockchain == 'stellar') {
      this.saleBE.SellingType = 'NFT';
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftissuerpk;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.dialogService
        .openDisclaimer()
        /* .confirmDialog({
          title:ConfirmDialogText.BUY_VIEW_BUY_NFT_TITLE,
          message:ConfirmDialogText.BUY_VIEW_BUY_NFT_MESSAGE,
          confirmText:ConfirmDialogText.CONFIRM_BTN,
          cancelText:ConfirmDialogText.CANCEL_BTN
        }) */
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.pendingDialog({
              message: PendingDialogText.BUY_VIEW_CLICKED_BUY,
            });
            this.buyNFTOnStellar();
            loadingAnimation.close();
            this.snackbar.openSnackBar(SnackBarText.BOUGHT_SUCCESS_MESSAGE);
            // this.saleBE.CurrentOwnerPK =this.userPK;
            // console.log("user pk for stellar: ",this.userPK)
            // this.service.updateNFTStatusBackend(this.saleBE).subscribe();
          }
        });
    }
    if (this.NFTList.blockchain == 'solana') {
      const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.userPK = phantomWallet.getWalletaddress();
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.saleBE.SellingType = 'NFT';
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.dialogService.openDisclaimer()./* confirmDialog({
        title:ConfirmDialogText.BUY_VIEW_BUY_NFT_TITLE,
        message:ConfirmDialogText.BUY_VIEW_BUY_NFT_MESSAGE,
        confirmText:ConfirmDialogText.CONFIRM_BTN,
        cancelText:ConfirmDialogText.CANCEL_BTN
      }). */ subscribe((res) => {
        if (res) {
          const loadingAnimation = this.dialogService.pendingDialog({
            message: PendingDialogText.BUY_VIEW_CLICKED_BUY,
          });
          this.transfer
            .createATA(
              environment.fromWalletSecret,
              parseFloat(this.NFTList.currentprice),
              phantomWallet.getWalletaddress(),
              this.NFTList.nftissuerpk,
              this.NFTList.nftidentifier
            )
            .then(async (res: any) => {
              this.ata
                .createATA(
                  environment.fromWalletSecret,
                  parseInt(this.NFTList.currentprice),
                  phantomWallet.getWalletaddress(),
                  this.NFTList.nftissuerpk,
                  this.NFTList.nftidentifier,
                  parseFloat(this.NFTList.royalty),
                  this.NFTList.creatoruserid,
                  this.NFTList.currentownerpk
                )
                .then(async (result: solanaTransaction) => {
                  try {
                    const { signature } = await (
                      window as any
                    ).solana.signAndSendTransaction(result);
                    await connection.confirmTransaction(signature);
                    // this.showInProfile()
                  } catch (err) {
                    alert(err);
                  }
                  loadingAnimation.close();
                  this.buytxn = res;
                  this.saveTXNs();
                  this.service.updateNFTStatusBackend(this.saleBE).subscribe();
                  this.updateGateway();
                  this.snackbar.openSnackBar(
                    SnackBarText.BOUGHT_SUCCESS_MESSAGE
                  );
                  this.showInProfile();
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
      let walletMetamask = new UserWallet();
      walletMetamask = new MetamaskComponent(walletMetamask);
      await walletMetamask.initWallelt();
      this.userPK = await walletMetamask.getWalletaddress();
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.dialogService
        .openDisclaimer() /* confirmDialog({
        title:ConfirmDialogText.BUY_VIEW_BUY_NFT_TITLE,
        message:ConfirmDialogText.BUY_VIEW_BUY_NFT_MESSAGE,
        confirmText:ConfirmDialogText.CONFIRM_BTN,
        cancelText:ConfirmDialogText.CANCEL_BTN
      } )*/
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.pendingDialog({
              message: PendingDialogText.BUY_VIEW_CLICKED_BUY,
            });
            this.pmarket
              .BuyNFT(
                environment.contractAddressNFTPolygon,
                parseInt(this.NFTList.sellingtype),
                this.NFTList.currentprice,
                this.NFTList.royalty,
                this.NFTList.currentownerpk
              )
              .then((res) => {
                this.buytxn = res.transactionHash;
                this.saveTXNs();
                this.service.updateNFTStatusBackend(this.saleBE).subscribe();
                this.updateGateway();
                loadingAnimation.close();
                this.snackbar.openSnackBar(SnackBarText.BOUGHT_SUCCESS_MESSAGE);
                this.showInProfile();
              });
          }
        });
    }
    if (this.NFTList.blockchain == 'ethereum') {
      this.saleBE.MarketContract = environment.contractAddressMKEthereum;
      this.saleBE.NFTIdentifier = this.nftbe.NFTIdentifier;
      this.saleBE.SellingType = this.NFTList.sellingtype;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      let walletMetamask = new UserWallet();
      walletMetamask = new MetamaskComponent(walletMetamask);
      await walletMetamask.initWallelt();
      console.log('eth wallet address: ', this.userPK);
      this.userPK = await walletMetamask.getWalletaddress();
      console.log('eth wallet address: ', this.userPK);
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.dialogService
        .openDisclaimer() /* confirmDialog({
        title:ConfirmDialogText.BUY_VIEW_BUY_NFT_TITLE,
        message:ConfirmDialogText.BUY_VIEW_BUY_NFT_MESSAGE,
        confirmText:ConfirmDialogText.CONFIRM_BTN,
        cancelText:ConfirmDialogText.CANCEL_BTN
      }) */
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.pendingDialog({
              message: PendingDialogText.BUY_VIEW_CLICKED_BUY,
            });
            this.emarket
              .BuyNFT(
                environment.contractAddressNFTEthereum,
                parseInt(this.NFTList.sellingtype),
                this.NFTList.currentprice,
                this.NFTList.royalty,
                this.NFTList.currentownerpk
              )
              .then((res) => {
                this.buytxn = res.transactionHash;
                this.saveTXNs();
                this.service.updateNFTStatusBackend(this.saleBE).subscribe();
                this.updateGateway();
                loadingAnimation.close();
                this.snackbar.openSnackBar(SnackBarText.BOUGHT_SUCCESS_MESSAGE);
                this.showInProfile();
              });
          }
        });
    }
  }

  updateGateway(): void {
    this.buyGW.CurrentOwnerNFTPK = '0xD85E667594EC848895466Fb702D35F6111f258e8';
    this.buyGW.PreviousOwnerNFTPK = this.NFTList.distributorpk;
    this.buyGW.SellingStatus = 'NOT FOR SALE';
    this.buyGW.NFTTXNhash = this.NFTList.nfttxnhash;
    this.service
      .updateNFTBuyStatusGateway(
        this.buyGW.SellingStatus,
        this.buyGW.CurrentOwnerNFTPK,
        this.buyGW.PreviousOwnerNFTPK,
        this.buyGW.NFTTXNhash
      )
      .subscribe();
  }

  saveTXNs(): void {
    this.txn.Blockchain = this.NFTList.blockchain;
    this.txn.ImageURL = this.NFTList.imagebase64;
    this.txn.NFTIdentifier = this.NFTList.nftidentifier;
    this.txn.NFTName = this.NFTList.nftname;
    this.txn.NFTTxnHash = this.buytxn;
    this.txn.Status = 'BOUGHT';

    this.apiService.addTXN(this.txn).subscribe();
  }

  async buyNFTOnStellar(): Promise<void> {
    let walletf = new UserWallet();
    walletf = new FreighterComponent(walletf);
    await walletf.initWallelt();
    this.userPK = await walletf.getWalletaddress();
    this.trust
      .trustlineByBuyer(
        this.NFTList.nftname,
        this.NFTList.nftissuerpk,
        this.userPK,
        this.NFTList.currentprice,
        this.NFTList.distributorpk,
        this.NFTList.royalty
      )
      .then((transactionResult: any) => {
        if (transactionResult.successful) {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
          this.buytxn = transactionResult.hash;
          this.saveTXNs();
          this.saleBE.CurrentOwnerPK = this.userPK;
          console.log('user pk for stellar: ', this.userPK);
          this.service.updateNFTStatusBackend(this.saleBE).subscribe();
          this.snackbar.openSnackBar('NFT has successfully been bough');
          this.showInProfile();
        } else {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
        }
      });
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
    let data: any = this.nftbe.Blockchain;
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: this.nftbe.Blockchain },
    });
  }

  public openDialog() {
    this.dialogService.openCodeView(this.Decryption);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('data passed :', this.data);
      this.nftbe.Blockchain = this.data[1];
      this.nftbe.NFTIdentifier = this.data[0];
      this.nftbe.SellingStatus = 'ON SALE';
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
            console.log('nft data: ', this.NFTList);

            if (this.NFTList == null) {
              this.ngOnInit();
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
                console.log('reviews ,', res);
                this.list = res;
                for (let x = 0; x < this.list.length; x++) {
                  let reviewcard: ReviewsCard = new ReviewsCard('', '', '', '');
                  reviewcard.UserID = this.list[x].userid;
                  reviewcard.Rating = this.list[x].rating;
                  reviewcard.Description = this.list[x].description;
                  reviewcard.Timestamp = this.list[x].timestamp;
                  const unwantedText = 'GMT+0530 (India Standard Time)';
                  reviewcard.Timestamp = reviewcard.Timestamp.replace(unwantedText, '');
                  this.ReviewList.push(reviewcard);
                  console.log('Review List: ', this.ReviewList);
                }
              });

            this.getUSDConversion();
            this.apiService
              .findFavouritesByBlockchainAndNFTIdentifier(
                this.NFTList.blockchain,
                this.NFTList.nftidentifier
              )
              .subscribe((res: any) => {
                console.log('favs :', res);
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
                  const content = this.htmStr;
                  console.log('HTML STRING: ', this.htmStr);
                  let htmlopen: string = '<body style="color:white;">';
                  let htmlclose: string = '</body>';
                  let html: string = htmlopen + content + htmlclose;
                  console.log('HTML OUT PUT :', html);
                  this.populateIframe(this.iframe.nativeElement, html);

                }

              });
            if (this.NFTList.blockchain == 'ethereum') {
              this.image =
                '../../../assets/images/blockchain-icons/ethereum.png';
              this.icon = '../../../assets/images/blockchain-icons/ether.png';
              this.crypto = 'ETH';
            }
            if (this.NFTList.blockchain == 'polygon') {
              this.image =
                '../../../assets/images/blockchain-icons/polygon.PNG';
              this.icon = '../../../assets/images/blockchain-icons/poly.png';
              this.crypto = 'MATIC';
            }
            if (this.NFTList.blockchain == 'stellar') {
              this.image =
                '../../../assets/images/blockchain-icons/stellar.PNG';
              this.icon = '../../../assets/images/blockchain-icons/xlm.png';
              this.crypto = 'XLM';
            }
            if (this.NFTList.blockchain == 'solana') {
              this.image = '../../../assets/images/blockchain-icons/solana.PNG';
              this.icon = '../../../assets/images/blockchain-icons/sol.png';
              this.crypto = 'SOL';
            }

            this.svg.Hash = this.NFTList.imagebase64;
            this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
              this.Decryption = res.Response.Base64ImageSVG;
              if(this.NFTList.attachmenttype == "image/jpeg" || this.NFTList.attachmenttype == "image/jpg" || this.NFTList.attachmenttype == "image/png"){
                this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
              }else{
                this.dec = btoa(this.Decryption);
            var str2 = this.dec.toString();
            var str1 = new String( "data:image/svg+xml;base64,");
            var src = str1.concat(str2.toString());
            this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
              }
              console.log('image in buy: ', this.imageSrc);
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

                    console.log('the txn list: ', this.List);
                    //-----------------------------------
                  }
                });
            });

            if (this.NFTList == null) {
              this.ngOnInit();
            }
            this.svg.Hash = this.NFTList.imagebase64;
            this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
              this.Decryption = res.Response.Base64ImageSVG;
              if(this.NFTList.attachmenttype == "image/jpeg" || this.NFTList.attachmenttype == "image/jpg" || this.NFTList.attachmenttype == "image/png"){
                this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
              }else{
                this.dec = btoa(this.Decryption);
            var str2 = this.dec.toString();
            var str1 = new String( "data:image/svg+xml;base64,");
            var src = str1.concat(str2.toString());
            this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
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
          });
      } else {
        this.snackbar.openSnackBar('User PK not connected or not endorsed');
      }
    });
  }

  public goToExplore() {
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: 'ethereum', filter: 'uptodate' },
    });
  }

  public addReview() {
    this.selectedTab = 1;
  }
  public prevTab() {
    this.selectedTab = 0;
  }

  public setFilter(filter: string) {
    this.filter = filter;
  }

  public openConfirmation() {
    this.reviews.Status = 'Pending';
    this.reviews.Description = this.controlGroup.get('description')!.value;
    this.reviews.Rating = Number(this.controlGroup.get('rating')!.value);
    this.reviews.NFTIdentifier = this.NFTList.nftidentifier;
    this.reviews.UserID = this.controlGroup.get('userid')!.value;
    this.reviews.Timestamp=new Date().toString();
    console.log("time is: ",this.reviews.Timestamp)
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
                'Your review has been Successfully submitted'
              );
            } else {
              this.snackbar.openSnackBar(
                'Failed to submit review please try again.'
              );
            }
          });
        }
      });

    // this.dialog.open(ConfirmationPopupComponent, {
    //   data: {
    //     user:  this.reviews.UserID,
    //   },
    // });
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  getUSDConversion() {
    if (this.nftbe.Blockchain == 'ethereum') {
      this.apiService.getUSD('eth-usd').subscribe((res: any) => {
        console.log('Result is: ', res);
        console.log('Result is: ', res.ticker.price);
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
    let htmlopen: string = '<body style="color:white;">';
    let htmlclose: string = '</body>';
    this.populateIframe(this.iframe.nativeElement, `${htmlopen}<div style="display : flex;flex-direction : row; justify-content: center; align-items : center; height : 100px ">No Story</div>${htmlclose}`)
  }

  public populateIframe(iframe: any, data: string) {
    console.log('CALL STARTED');

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(data);
    iframe.contentWindow.document.close();
    this.loaded = false;

  }
}
