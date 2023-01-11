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
  SelectWalletText,
  SnackBarText,
} from 'src/app/models/confirmDialog';
import { BlockchainConfig } from 'src/environments/environment';
import { id } from 'ethers/lib/utils';
import albedo from '@albedo-link/intent';
import { SaleOfferService } from 'src/app/services/blockchain-services/stellar-services/albedo-transactions/sale-offer.service';

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
  saleBE: SalesBE = new SalesBE('', '', '', '', '', '', '', '', '','');
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
  royaltyamount = 0;
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  maincontent: any;
  readonly network :any =BlockchainConfig.solananetwork;
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
    public pmint:PolygonMintService,
    private albedosale:SaleOfferService
  ) {}

  calculatePrice(): void {
    if(this.NFTList.creatoruserid==this.NFTList.currentownerpk){//might be distributor
      this.Royalty = this.NFTList.royalty
      this.royalty = parseFloat(this.formValue('Royalty'));
      this.royaltyamount=this.royalty
      this.firstPrice = parseFloat(this.formValue('Price'));
     this.royaltyCharge =this.firstPrice * (this.royalty / 100.0);
      this.sellingPrice = this.firstPrice ;
      this.commissionforNonContracts =(parseFloat(this.formValue('Price')) * (5.00/100.00))
      this.commission = (parseFloat(this.formValue('Price')) * (5.00/100.00)).toString()
      this.sellingPriceForNonContracts=this.firstPrice  +this.commissionforNonContracts;
      this.value = false
    }else{
      this.royalty = parseFloat(this.Royalty)
      this.firstPrice = parseFloat(this.formValue('Price'));
      this.royaltyCharge = this.firstPrice * (this.royalty / 100.0);
      this.sellingPrice=this.firstPrice
      this.commission = (parseFloat(this.formValue('Price')) * (2.00/100.00)).toString()
      this.commissionforNonContracts =(parseFloat(this.formValue('Price')) * (2.00/100.00))
      this.value = true
      this.sellingPriceForNonContracts=this.firstPrice + this.royaltyCharge +this.commissionforNonContracts;

    }
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
    if(this.NFTList.blockchain=='ethereum' || this.NFTList.blockchain=='polygon'){
    this.saleBE.CurrentPrice = this.sellingPrice.toString();
    this.saleBE.Commission=this.commission.toString();
    }else if(this.NFTList.blockchain=='stellar'){
      this.saleBE.CurrentPrice = this.sellingPrice.toString();
      this.saleBE.Commission=this.commissionforNonContracts.toString();
    }else{
      this.saleBE.CurrentPrice = this.sellingPrice.toString();
      this.saleBE.Commission=this.commissionforNonContracts.toString();
    }
    this.saleBE.Timestamp = '2022-4-20:17:28';
    this.saleBE.CurrentOwnerPK = this.NFTList.currentownerpk;
    this.saleBE.Royalty = this.royalty.toString();
    this.service.updateNFTStatusBackend(this.saleBE).subscribe();
  }

  addDBGateway(): void {
    this.saleGW.Status = 'ON SALE';
    if(this.NFTList.blockchain=='ethereum' || this.NFTList.blockchain=='polygon'){
      this.saleBE.CurrentPrice = this.sellingPrice.toString();
      }else{
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
    if (this.NFTList.blockchain == 'stellar') {
      await this.dialogService
      .selectWallet({
        title: SelectWalletText.WALLET_TITLE,
        message: SelectWalletText.WALLET_MESSAGE,
        selectA: SelectWalletText.WALLET_ALBEDO,
        selectF: SelectWalletText.WALLET_FREIGHTER,
      })
      .subscribe(async (res:any) => {
        this.wallet=res

        if(this.wallet=='freighter'){
          let freighterWallet = new UserWallet();
          freighterWallet = new FreighterComponent(freighterWallet);
          await freighterWallet.initWallelt();
          this.signerpK = await freighterWallet.getWalletaddress();

          this.saleBE.SellingType = 'NFT';
          this.saleBE.MarketContract = 'Not Applicable';
          this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
          this.saleBE.Blockchain = this.NFTList.blockchain;
          this.royaltyamount = parseFloat(this.formValue('Royalty'));
          if(isNaN(+this.royaltyamount)){
            this.snackbarService.openSnackBar("Royality must be inputed as a number")
            return
          }
          if(this.royaltyamount <0 || this.royaltyamount>100){
            this.snackbarService.openSnackBar("Royalty must be between 1 to 100%")
            return
          }
          this.calculatePrice();
          this.dialogService
          .confirmMintDialog({
            promtHeading:"You are Selling",
            nftName:  this.NFTList.nftname,
            thumbnail: this.NFTList.thumbnail,
            feeTypeName:"Comission Fee ",
            serviceFee :  parseFloat(this.commission),
            total :  this.sellingPrice,
            blockchain: this.NFTList.blockchain,
            buttonAction:"Sell Now"
          })
            .subscribe((res) => {
              if (res) {
                const loadingAnimation = this.dialogService.mintingDialog({
                  processTitle:"Selling",
                  message: PendingDialogText.MINTING_IN_PROGRESS,
                  nftName: this.NFTList.nftname,
                   thumbnail: this.NFTList.thumbnail,
                });
                this.addDBBackend();
                this.addDBGateway();
                this.stellarService
                  .sellNft(
                    this.NFTList.nftname,
                    this.NFTList.nftissuerpk,
                    this.signerpK,
                    '1',
                    this.sellingPrice,
                  )
                  .then((res: any) => {
                    this.selltxn = res.hash;
                    this.saveTXNs();
                    loadingAnimation.close();
                    this.snackbarService.openSnackBar(
                      SnackBarText.SALE_SUCCESS_MESSAGE
                    );
                    this.showInProfile();
                  });
              }
            });
        }
        if(this.wallet=='albedo'){
          await albedo.publicKey({
            require_existing: true
        })
            .then((res:any) => {
              this.signerpK=res.pubkey

              this.saleBE.SellingType = 'NFT';
        this.saleBE.MarketContract = 'Not Applicable';
        this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
        this.saleBE.Blockchain = this.NFTList.blockchain;
        if(this.NFTList.creatoruserid==this.NFTList.currentownerpk){//might be distributor

          this.royaltyamount = parseFloat(this.formValue('Royalty'));
          if(isNaN(+this.royaltyamount)){
            this.snackbarService.openSnackBar("Royality must be inputed as a number")
            return
          }
          if(this.royaltyamount <0 || this.royaltyamount>100){
            this.snackbarService.openSnackBar("Royalty must be between 1 to 100%")
            return
          }
        }else{
          this.royaltyamount=this.Royalty
        }
        this.calculatePrice();
        this.dialogService
        .confirmMintDialog({
          promtHeading:"You are Selling",
          nftName:  this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName:"Comission Fee ",
          serviceFee :  parseFloat(this.commission),
          total :  this.sellingPrice,
          blockchain: this.NFTList.blockchain,
          buttonAction:"Sell Now"
        })
          .subscribe((res) => {
            if (res) {
              const loadingAnimation = this.dialogService.mintingDialog({
                processTitle:"Selling",
                message: PendingDialogText.MINTING_IN_PROGRESS,
                nftName: this.NFTList.nftname,
                thumbnail: this.NFTList.thumbnail,
              });
              this.addDBBackend();
              this.addDBGateway();
              this.albedosale
                .sellNft(
                  this.NFTList.nftname,
                  this.NFTList.nftissuerpk,
                  this.signerpK,
                  '1',
                  this.sellingPrice,
                )
                .then((res: any) => {
                  this.selltxn = res.tx_hash;
                  this.saveTXNs();
                  loadingAnimation.close();
                  this.snackbarService.openSnackBar(
                    SnackBarText.SALE_SUCCESS_MESSAGE
                  );
                  this.showInProfile();
                });
            }
          });})
        }


      })



    }
    if (this.NFTList.blockchain == 'solana') {
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.SellingType = 'NFT';
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.saleBE.Blockchain = this.NFTList.blockchain;

        const connection = new Connection(
          clusterApiUrl(this.network),
          'confirmed'
        );
        let phantomWallet = new UserWallet();
        phantomWallet = new PhantomComponent(phantomWallet);
        await phantomWallet.initWallelt();
        if(this.NFTList.creatoruserid==this.NFTList.currentownerpk){//might be distributor

          this.royaltyamount = parseFloat(this.formValue('Royalty'));
          if(isNaN(+this.royaltyamount)){
            this.snackbarService.openSnackBar("Royality must be inputed as a number")
            return
          }
          if(this.royaltyamount <0 || this.royaltyamount>100){
            this.snackbarService.openSnackBar("Royalty must be between 1 to 100%")
            return
          }
        }else{
          this.royaltyamount=this.Royalty
        }
        this.calculatePrice();
        this.dialogService
        .confirmMintDialog({
          promtHeading:"You are Selling",
          nftName:  this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName:"Comission Fee ",
          serviceFee :  parseFloat(this.commission),
          total :  this.sellingPrice,
          blockchain: this.NFTList.blockchain,
          buttonAction:"Sell Now"
        })
          .subscribe((res) => {
            if (res) {
              const loadingAnimation = this.dialogService.mintingDialog({
                processTitle:"Selling",
                message: PendingDialogText.MINTING_IN_PROGRESS,
                nftName: this.NFTList.nftname,
                 thumbnail: this.NFTList.thumbnail,
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
                  loadingAnimation.close();
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
      if(this.NFTList.creatoruserid==this.NFTList.currentownerpk){//might be distributor
        this.royaltyamount = parseFloat(this.formValue('Royalty'));
        if(isNaN(+this.royaltyamount)){
          this.snackbarService.openSnackBar("Royality must be inputed as a number")
          return
        }
        if(this.royaltyamount <0 || this.royaltyamount>100){
          this.snackbarService.openSnackBar("Royalty must be between 1 to 100%")
          return
        }
      }else{
        this.royaltyamount=this.Royalty
      }
      this.calculatePrice();
      this.dialogService
        .confirmMintDialog({
          promtHeading:"You are Selling",
          nftName:  this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName:"Comission Fee ",
          serviceFee :  parseFloat(this.commission),
          total :  this.sellingPrice,
          blockchain: this.NFTList.blockchain,
          buttonAction:"Sell Now"
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle:"Selling",
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
               thumbnail: this.NFTList.thumbnail,
            });
              this.pmint.approveContract(this.tokenid).then((res:any)=>{
                this.pmarket
                .createSaleOffer(
                  environment.contractAddressNFTPolygon,
                  this.tokenid,
                  this.sellingPrice + this.royaltyCharge,
                  this.commission
                )
                .then((res) => {
                  this.selltxn = res.transactionHash;
                  this.itemId = parseInt(res.logs[3].topics[1]);
                  this.saleBE.SellingType = this.itemId.toString();
                  this.saveTXNs();
                  this.addDBBackend();
                  this.addDBGateway();
                  loadingAnimation.close();
                  this.snackbarService.openSnackBar(
                    SnackBarText.SALE_SUCCESS_MESSAGE
                  );
                  this.showInProfile();
                });
              })

         //   }
          }
        });
    }
    if (this.NFTList.blockchain == 'ethereum') {
      this.saleBE.MarketContract = environment.contractAddressMKEthereum;
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;
      this.saleBE.Blockchain = this.NFTList.blockchain;
      this.tokenid = parseInt(this.NFTList.nftidentifier);
      if(this.NFTList.creatoruserid==this.NFTList.currentownerpk){//might be distributor

        this.royaltyamount = parseFloat(this.formValue('Royalty'));
        if(isNaN(+this.royaltyamount)){
          this.snackbarService.openSnackBar("Royality must be inputed as a number")
          return
        }
        if(this.royaltyamount <0 || this.royaltyamount>100){
          this.snackbarService.openSnackBar("Royalty must be between 1 to 100%")
          return
        }
      }else{
        this.royaltyamount=this.Royalty
      }
      this.calculatePrice();
      this.dialogService
        .confirmMintDialog({
          promtHeading:"You are Selling",
          nftName:  this.NFTList.nftname,
          thumbnail: this.NFTList.thumbnail,
          feeTypeName:"Comission Fee ",
          serviceFee :  parseFloat(this.commission),
          total :  this.sellingPrice,
          blockchain: this.NFTList.blockchain,
          buttonAction:"Sell Now"
        })
        .subscribe((res) => {
          if (res) {
            const loadingAnimation = this.dialogService.mintingDialog({
              processTitle:"Selling",
              message: PendingDialogText.MINTING_IN_PROGRESS,
              nftName: this.NFTList.nftname,
               thumbnail: this.NFTList.thumbnail,
            });
              this.emint.approveContract(this.tokenid).then((res:any)=>{
                this.emarket
                .createSaleOffer(
                  environment.contractAddressNFTEthereum,
                  this.tokenid,
                  this.sellingPrice ,
                  this.commission
                )
                .then((res) => {
                  this.selltxn = res.transactionHash;
                  this.itemId = parseInt(res.logs[2].topics[1]);
                  this.saleBE.SellingType = this.itemId.toString();
                  this.saveTXNs();
                  this.addDBBackend();
                  this.addDBGateway();
                  loadingAnimation.close();
                  this.snackbarService.openSnackBar(
                    SnackBarText.SALE_SUCCESS_MESSAGE
                  );
                  this.showInProfile();
                });
              })
           // }
          }
        });
    }
  }

  showInProfile() {
    let data: any = this.NFTList.blockchain;
    this.router.navigate(['/user-dashboard'], {
      queryParams: { user:this.NFTList.currentownerpk,blockchain: data },
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
      this.service
        // 1:nft identifer , 2:blockchain, 0:selling status
        .getNFTDetails(this.data[1], this.data[0], this.data[2])
        .subscribe((data: any) => {
          this.NFTList = data.Response[0];
          if (this.NFTList == null) {
            this.ngOnInit();
          }
          if (this.data[0] == 'Minted') {
            this.prevOwner = 'None - Genesis';
          } else {
            this.prevOwner = this.NFTList.distributorpk;
          }

          if(this.NFTList.creatoruserid==this.NFTList.currentownerpk){//might be distributor
            this.Royalty = this.NFTList.royalty
            this.value = false
          }else{
          this.Royalty=this.NFTList.royalty

            this.value = true
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
              this.Decryption = res.Response.Base64ImageSVG;
              if(this.NFTList.attachmenttype == "image/jpeg" || this.NFTList.attachmenttype == "image/jpg" ||this.NFTList.attachmenttype == "image/png"){
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
      this.snackbarService.openSnackBar(
        'User PK not connected or not endorsed'
      );
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

  public convertToUSD(event: any, type : string) {
    if(type === 'selling') {
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${'ethereum'}`
      )
        .then((res) => res.json())
        .then((res) => {
          const rate = res[0].current_price;
          const eth = parseFloat(event.target.value);
          this.sellingPriceUSD = (eth * rate);
        })
        .catch(() => {
          this.sellingPriceUSD = 0;
        });
    }
    else {
      this.calculatePrice();
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${'ethereum'}`
      )
        .then((res) => res.json())
        .then((res) => {
          const rate = res[0].current_price;
          const eth = this.royaltyCharge;
          this.royaltyPriceUSD = (eth * rate);
        })
        .catch(() => {
          this.royaltyPriceUSD = 0;
        });
    }

  }
}
