import { Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { FreighterComponent } from './../../../wallet/freighter/freighter.component';
import { UserWallet } from 'src/app/models/userwallet';
import { Component, OnInit } from '@angular/core';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { NFTMarket, SalesBE, BuyNFTGW, GetNFT } from 'src/app/models/nft';
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
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

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
  NFTList: any;
  List: any[] = [];
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
    ''
  );
  signerSK = 'SBKFJD35H4EZBMBELBB7SZQR4ZZ2H5WMRO4N6KWALXMF63DWJVMR2K5D';
  newATA: any;
  Decryption: any;
  buytxn: any;
  data: any;
  svg: SVG = new SVG('', '', 'NA');
  txn: TXN = new TXN('', '', '', '', '', '');
  dec: string;
  transaction: Uint8Array;
  signer: Uint8Array;
  userPK: string;
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
    this.saleBE.SellingStatus = 'NOTFORSALE';
    this.saleBE.Timestamp = '2022-04-21:13:41:00';
    if (this.NFTList.blockchain == 'stellar') {
      this.saleBE.SellingType = 'NFT';
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftissuerpk;
      // let stellarWallet = new UserWallet();
      // stellarWallet = new FreighterComponent(stellarWallet);
      // // await stellarWallet.initWallelt();
      // this.userPK =  stellarWallet.getWalletaddress()
      this.buyNFTOnStellar();
      // this.saleBE.CurrentOwnerPK =this.userPK;
      // console.log("user pk for stellar: ",this.userPK)
      // this.service.updateNFTStatusBackend(this.saleBE).subscribe();
    }
    if (this.NFTList.blockchain == 'solana') {
      const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.userPK = phantomWallet.getWalletaddress();
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.saleBE.SellingType = 'NFT';
      this.saleBE.MarketContract = 'Not Applicable';
      this.saleBE.NFTIdentifier = this.NFTList.nftidentifier;

      this.transfer
        .createATA(
          environment.fromWalletSecret,
          parseInt(this.NFTList.currentprice),
          phantomWallet.getWalletaddress(),
          this.NFTList.nftissuerpk,
          this.NFTList.nftidentifier
        )
        .then(async (res: any) => {
          console.log('result is ', res);
          this.buytxn = res;
          this.saveTXNs();
          this.service.updateNFTStatusBackend(this.saleBE).subscribe();
          this.updateGateway();
        });

      this.ata
        .createATA(
          environment.fromWalletSecret,
          parseInt(this.NFTList.currentprice),
          phantomWallet.getWalletaddress(),
          this.NFTList.nftissuerpk,
          this.NFTList.nftidentifier
        )
        .then(async (result: solanaTransaction) => {
          try {
            const { signature } = await (
              window as any
            ).solana.signAndSendTransaction(result);
            await connection.confirmTransaction(signature);
            this.snackbar.openSnackBar('NFT has successfully been bough');
          } catch (err) {
            alert(err);
          }
        });
    }
    if (this.NFTList.blockchain == 'polygon') {
      this.saleBE.MarketContract = environment.contractAddressMKPolygon;
      this.saleBE.NFTIdentifier = this.nftbe.NFTIdentifier;
      this.saleBE.SellingType = this.NFTList.sellingtype;
      let walletMetamask = new UserWallet();
      walletMetamask = new MetamaskComponent(walletMetamask);
      await walletMetamask.initWallelt();
      this.userPK = await walletMetamask.getWalletaddress();
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.pmarket
        .BuyNFT(
          environment.contractAddressNFTPolygon,
          parseInt(this.NFTList.sellingtype),
          parseInt(this.NFTList.currentprice)
        )
        .then((res) => {
          this.buytxn = res.transactionHash;
          this.saveTXNs();
          this.service.updateNFTStatusBackend(this.saleBE).subscribe();
          this.updateGateway();
          this.snackbar.openSnackBar('NFT has successfully been bough');
        });
    }
    if (this.NFTList.blockchain == 'ethereum') {
      this.saleBE.MarketContract = environment.contractAddressMKEthereum;
      this.saleBE.NFTIdentifier = this.nftbe.NFTIdentifier;
      this.saleBE.SellingType = this.NFTList.sellingtype;
      let walletMetamask = new UserWallet();
      walletMetamask = new MetamaskComponent(walletMetamask);
      await walletMetamask.initWallelt();
      console.log('eth wallet address: ', this.userPK);
      this.userPK = await walletMetamask.getWalletaddress();
      console.log('eth wallet address: ', this.userPK);
      this.saleBE.CurrentOwnerPK = this.userPK;
      this.emarket
        .BuyNFT(
          environment.contractAddressNFTEthereum,
          parseInt(this.NFTList.sellingtype),
          parseInt(this.NFTList.currentprice)
        )
        .then((res) => {
          this.buytxn = res.transactionHash;
          this.saveTXNs();
          this.service.updateNFTStatusBackend(this.saleBE).subscribe();
          this.updateGateway();
          this.snackbar.openSnackBar('NFT has successfully been bough');
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
        this.NFTList.distributorpk
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
            this.svg.Hash = this.NFTList.imagebase64;
            this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
              this.Decryption = res.Response.Base64ImageSVG;
              this.dec = btoa(this.Decryption);
              var str2 = this.dec.toString();
              var str1 = new String('data:image/svg+xml;base64,');
              var src = str1.concat(str2.toString());
              this.imageSrc =
                this._sanitizer.bypassSecurityTrustResourceUrl(src);
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
                    card.NFTTxnHash = txn.Response[x].NFTTxnHash;
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
              this.dec = btoa(this.Decryption);
              var str2 = this.dec.toString();
              var str1 = new String('data:image/svg+xml;base64,');
              var src = str1.concat(str2.toString());
              this.imageSrc =
                this._sanitizer.bypassSecurityTrustResourceUrl(src);
            });

            if (this.NFTList.Blockchain == 'stellar') {
              this.NFTList.NFTIssuerPK = this.NFTList.NFTIssuerPK;
            }
            if (this.NFTList.Blockchain == 'solana') {
              this.NFTList.NFTIssuerPK = this.NFTList.MinterPK;
            }
            if (this.NFTList.Blockchain == 'polygon') {
              this.NFTList.NFTIssuerPK = this.NFTList.MintedContract;
            }
            if (this.NFTList.Blockchain == 'ethereum') {
              this.NFTList.NFTIssuerPK = this.NFTList.MintedContract;
            }
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
    this.dialog.open(ConfirmationPopupComponent, {
      data: {
        user: 'lol',
      },
    });
  }
}
