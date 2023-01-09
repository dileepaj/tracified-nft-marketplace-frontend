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
import { APIConfigENV, BlockchainConfig, environment } from 'src/environments/environment';
import { TrustLineByBuyerServiceService } from 'src/app/services/blockchain-services/stellar-services/trust-line-by-buyer-service.service';
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
import { TrustByBuyerService } from 'src/app/services/blockchain-services/stellar-services/albedo-transactions/trust-by-buyer.service';
import {
  ConfirmDialogText,
  PendingDialogText,
  SelectWalletText,
  SnackBarText,
} from 'src/app/models/confirmDialog';
import { interval, timer } from 'rxjs';
import albedo from '@albedo-link/intent';

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
    '',
    '',
    ''
  );
  saleBE: SalesBE = new SalesBE('', '', '', '', '', '', '', '', '','');
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
    '',
    '',
    ''
  );
  signerSK = 'SBKFJD35H4EZBMBELBB7SZQR4ZZ2H5WMRO4N6KWALXMF63DWJVMR2K5D';
  newATA: any;
  Decryption: any;
  buytxn: any;
  data: any;
  svg: SVG = new SVG('', '', 'NA','','');
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
  currentPage : number = 1;
  observer: IntersectionObserver;
  review: any;
  loadingn : boolean = false;
  nextPageLoading : boolean = false;
  filterChanged : boolean = false;
  hasStory : boolean = true;
  maincontent: any;
  isLoading : boolean = false;
  readonly network :any =BlockchainConfig.solananetwork;
  wallet: any;
  total: number;
  commission: string;
  royalty: number;
  serviceCharge: string;
  services: number;
  commissionForNonContracts: string;
  constructor(
    private service: NftServicesService,
    private trust: TrustLineByBuyerServiceService,
    private trustalbedo:TrustByBuyerService,
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

  calculateCommision(){
    if(this.NFTList.creatoruserid==this.NFTList.currentownerpk){//might
      console.log("this is a sale 5%")
      this.total = parseFloat(this.NFTList.currentprice);
      this.royalty= 0 ; //parseFloat(this.NFTList.royalty);
      this.services=parseFloat(this.NFTList.commission);
      this.commission=((this.total-this.royalty) * (5.00/100.00)).toString()
      console.log("total, royalty, this.commisiion  ",this.total,this.royalty,this.commission,(this.total-this.royalty) )
      this.commissionForNonContracts=((this.total-(this.royalty+this.services)) * (5.00/100.00)).toString()
      console.log("commssion for stellar and solana :",this.commissionForNonContracts)
    }else{
      console.log("this is a resale 2%")
      this.total = parseFloat(this.NFTList.currentprice);
      this.royalty= parseFloat(this.NFTList.royalty);
      this.services=parseFloat(this.NFTList.commission);
      this.commission = (this.total * (5.00/100.00)).toString()
      console.log("----------total royalty commissionnnn" ,this.total,this.royalty,this.commission)
      this.commissionForNonContracts=((this.total-(this.royalty+this.services)) * (5.00/100.00)).toString()
      console.log("commssion for stellar and solana :",this.commissionForNonContracts)
    }
  }

  async updateBackend(): Promise<void> {
    this.saleBE.CurrentPrice = this.NFTList.currentprice;
    this.saleBE.Royalty = this.NFTList.royalty;
    this.saleBE.SellingStatus = 'NOTFORSALE';
    this.saleBE.Timestamp = '2022-04-21:13:41:00';
    this.saleBE.Commission=this.NFTList.commission

    if (this.NFTList.blockchain == 'stellar') {
      this.saleBE.SellingType = 'NFT';
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftissuerpk;
      this.saleBE.Blockchain = this.NFTList.blockchain;
     
      this.dialogService
        .openDisclaimer()
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.pendingDialog({
              message: PendingDialogText.BUY_VIEW_CLICKED_BUY,
            });
            this.buyNFTOnStellar().then(res=>{
              loadingAnimation.close();
            });
            
          }
        });
    }
    if (this.NFTList.blockchain == 'solana') {
      this.calculateCommision()
      const connection = new Connection(clusterApiUrl(this.network), 'confirmed');
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.userPK = phantomWallet.getWalletaddress();
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.saleBE.SellingType = 'NFT';
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.dialogService.openDisclaimer().subscribe((res) => {
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
                  parseInt(this.NFTList.currentprice),
                  phantomWallet.getWalletaddress(),
                  parseFloat(this.NFTList.royalty),
                  this.NFTList.creatoruserid,
                  this.NFTList.currentownerpk,
                  this.services.toString()
                )
                .then(async (result: solanaTransaction) => {
                  try {
                    const { signature } = await (
                      window as any
                    ).solana.signAndSendTransaction(result);
                    await connection.confirmTransaction(signature);
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
      this.calculateCommision()
      let walletMetamask = new UserWallet();
      walletMetamask = new MetamaskComponent(walletMetamask);
      await walletMetamask.initWallelt();
      this.userPK = await walletMetamask.getWalletaddress();
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.dialogService
        .openDisclaimer() 
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
                this.NFTList.creatoruserid,
                this.commission,
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
   this.calculateCommision()
      let walletMetamask = new UserWallet();
      walletMetamask = new MetamaskComponent(walletMetamask);
      await walletMetamask.initWallelt();
      this.userPK = await walletMetamask.getWalletaddress();
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.dialogService
        .openDisclaimer() 
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
                this.NFTList.creatoruserid,
                this.commission
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
    this.calculateCommision()
    this.dialogService
    .selectWallet({
      title: SelectWalletText.WALLET_TITLE,
      message: SelectWalletText.WALLET_MESSAGE,
      selectA: SelectWalletText.WALLET_ALBEDO,
      selectF: SelectWalletText.WALLET_FREIGHTER,
    })
    .subscribe(async (res:any) => {
      this.wallet=res

      if(this.wallet=='freighter'){
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
            this.NFTList.royalty,
            this.commissionForNonContracts
          )
          .then((transactionResult: any) => {
            if (transactionResult.successful) {
              if (this.isLoadingPresent) {
                this.dissmissLoading();
              }
              this.buytxn = transactionResult.hash;
              this.saveTXNs();
              this.saleBE.CurrentOwnerPK = this.userPK;
              this.service.updateNFTStatusBackend(this.saleBE).subscribe();
              this.snackbar.openSnackBar(SnackBarText.BOUGHT_SUCCESS_MESSAGE);
              this.showInProfile();
            } else {
              if (this.isLoadingPresent) {
                this.dissmissLoading();
              }
            }
          });
      }
      if(this.wallet=='albedo'){
        await albedo.publicKey({
          require_existing: true
      })
          .then((res:any) => {
            this.userPK=res.pubkey
            this.trustalbedo
            .trustlineByBuyer(
              this.NFTList.nftname,
              this.NFTList.nftissuerpk,
              this.userPK,
              this.NFTList.currentprice,
              this.NFTList.distributorpk,
              this.NFTList.royalty,
              this.commissionForNonContracts
            )
            .then((transactionResult: any) => {
              
                this.buytxn = transactionResult.tx_hash;
                this.saveTXNs();
                this.saleBE.CurrentOwnerPK = this.userPK;
                this.service.updateNFTStatusBackend(this.saleBE).subscribe();
                this.snackbar.openSnackBar(SnackBarText.BOUGHT_SUCCESS_MESSAGE);
                this.showInProfile();
           
            });
          })
        
      }
    })

  
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
    if(this.NFTList.attachmenttype == "image/jpeg" || this.NFTList.attachmenttype == "image/jpg" || this.NFTList.attachmenttype == "image/png"){
        this.dialogService.openNftPreview({image : this.maincontent})
    }else{
      this.dialogService.openCodeView(this.Decryption,);
    }
    
  }

  ngOnInit(): void {
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
                  reviewcard.Timestamp = reviewcard.Timestamp.replace(unwantedText, '');
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
                  const content = this.htmStr;
                  let htmlopen: string = '<body style="color:white;">';
                  let htmlclose: string = '</body>';
                  let html: string = htmlopen + content + htmlclose;
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
                if(this.NFTList.thumbnail!=""){
                  this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.NFTList.thumbnail);
                  this.maincontent= this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString());
                }else{
                  this.imageSrc=this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString());
                }
              }else{
                this.dec = btoa(this.Decryption);
                var str2 = this.dec.toString();
                var str1 = new String( "data:image/svg+xml;base64,");
                var src = str1.concat(str2.toString());
                if(this.NFTList.thumbnail!=""){
                  this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.NFTList.thumbnail);
                }else{
                  this.imageSrc=this._sanitizer.bypassSecurityTrustResourceUrl(src);
                }
              }
              this.service
                .getTXNByBlockchainandIdentifier(
                  this.NFTList.nftidentifier,
                  this.NFTList.blockchain
                )
                .subscribe((txn: any) => {
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
            });

            if (this.NFTList == null) {
              this.ngOnInit();
            }
            this.svg.Hash = this.NFTList.imagebase64;
            this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
              this.Decryption = res.Response.Base64ImageSVG;
              if(this.NFTList.attachmenttype == "image/jpeg" || this.NFTList.attachmenttype == "image/jpg" || this.NFTList.attachmenttype == "image/png"){
                if(this.NFTList.thumbnail!=""){
                  this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.NFTList.thumbnail);
                }else{
                  this.imageSrc=this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString());
                }
              }else{
                this.dec = btoa(this.Decryption);
            var str2 = this.dec.toString();
            var str1 = new String( "data:image/svg+xml;base64,");
            var src = str1.concat(str2.toString());
            if(this.NFTList.thumbnail!=""){
              this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.NFTList.thumbnail);
            }else{
              this.imageSrc=this._sanitizer.bypassSecurityTrustResourceUrl(src);
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

  public setFilter(filter: string,id:string) {
    const timer$ = timer(0,APIConfigENV.homepageIntervalTimer)
    timer$.subscribe(data=>{
      this.loadingn = true;

    this.ReviewList.splice(0)
    this.filter = filter;
    this.intersectionObserver(filter,id)
    if(!this.loadingn) {
      this.nextPageLoading = true;
    }
    this.apiService.getReviewsByFilter(this.filter,this.currentPage,id).subscribe((res:any)=>{
      this.review=res.Response.reviewcontent
      this.nextPageLoading = false;
      for (let x = 0; x < this.review.length; x++) {
        let reviewcard: ReviewsCard = new ReviewsCard('', '', '', '');
        reviewcard.UserID = this.review[x].userid;
        reviewcard.Rating = this.review[x].rating;
        reviewcard.Description = this.review[x].description;
        reviewcard.Timestamp = this.review[x].timestamp;
        this.ReviewList.push(reviewcard);
      }
    })
    interval(APIConfigENV.APIStartDelay).subscribe(data=>{
      this.loadingn = false;
    })
  })
  }

  intersectionObserver(filter,id) {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.review.Response.PaginationInfo.nextpage !== 0) {
          this.currentPage++;
          this.setFilter(filter,id);
        }
      }
    }, option);
  }

  public openConfirmation() {
    this.reviews.Status = 'Pending';
    this.reviews.Description = this.controlGroup.get('description')!.value;
    this.reviews.Rating = Number(this.controlGroup.get('rating')!.value);
    this.reviews.NFTIdentifier = this.NFTList.nftidentifier;
    this.reviews.UserID = this.controlGroup.get('userid')!.value;
    this.reviews.Timestamp=new Date().toString();
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
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
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
    let htmlopen: string = '<body style="color:white;">';
    let htmlclose: string = '</body>';
    this.populateIframe(this.iframe.nativeElement, `${htmlopen}<div style="display : flex;flex-direction : row; justify-content: center; align-items : center; height : 100px ">No Story</div>${htmlclose}`)
  }

  public populateIframe(iframe: any, data: string) {

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(data);
    iframe.contentWindow.document.close();
    this.loaded = false;

  }
}
