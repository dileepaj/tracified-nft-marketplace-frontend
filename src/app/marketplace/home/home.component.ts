import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletComponent } from 'src/app/wallet/wallet.component';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import {
  HomeCard,
  Favourites,
  WatchList,
  NFTCard,
} from 'src/app/models/marketPlaceModel';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { UserWallet } from 'src/app/models/userwallet';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { interval, timer } from 'rxjs';
import { APIConfigENV } from 'src/environments/environment';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  @ViewChild('sales', { static: false }) sales: ElementRef;
  @ViewChild('categories', { static: false }) categories: ElementRef;
  List: any[] = [];
  List2: any[] = [];
  Decryption: any;
  dec: string;
  nfts: any;
  imageSrc: any;
  favouritesModel: Favourites = new Favourites('', '', '');
  watchlistModel: WatchList = new WatchList('', '', '');
  backTopVisible: boolean = false;
  newitemflag: boolean = true;
  thumbnailSRC: any;
  constructor(
    private dialogref: MatDialog,
    private nft: NftServicesService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private api: ApiServicesService,
    private snackbarService: SnackbarServiceService,
    private dialogService: DialogService
  ) {
    document.body.className = 'home-body';
  }

  ngOnDestroy() {
    document.body.className = '';
  }

  openDialog() {
    this.dialogref.open(WalletComponent, {
      autoFocus: false,
      panelClass: 'popUpDialog',
    });
  }

  routeToBuy(id: string) {
    let data: any = id;
    this.router.navigate(['./buyNft'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  viewall(status:string){
    this.router.navigate(['/shownft'], {
      queryParams: { data: status},
    });
  }

  async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      this.favouritesModel.User = await freighterWallet.getWalletaddress();
    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.favouritesModel.User = await phantomWallet.getWalletaddress();
    }

    if (blockchain == 'ethereum' || blockchain == 'polygon') {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.favouritesModel.User = await metamaskwallet.getWalletaddress();
    }
  }

  viewNFT() {}

  addToFavourites(id: string, blockchain: string) {
    this.favouritesModel.Blockchain = blockchain;
    this.favouritesModel.NFTIdentifier = id;
    this.retrive(this.favouritesModel.Blockchain).then((res) => {
      this.api.addToFavourites(this.favouritesModel).subscribe((res) => {
        this.snackbarService.openSnackBar('Added to favourites');
        this.api
          .getFavouritesByBlockchainAndNFTIdentifier(
            this.favouritesModel.Blockchain,
            this.favouritesModel.NFTIdentifier
          )
          .subscribe((res) => {});
      });
    });
  }

  addToWatchList(id: string, blockchain: string) {
    this.watchlistModel.Blockchain = blockchain;
    this.watchlistModel.NFTIdentifier = id;
    this.retrive(this.watchlistModel.Blockchain).then((res) => {
      this.api.addToWatchList(this.watchlistModel).subscribe((res) => {
        this.snackbarService.openSnackBar('Added to watchlists');
        this.api
          .getWatchlistByBlockchainAndNFTIdentifier(
            this.watchlistModel.Blockchain,
            this.watchlistModel.NFTIdentifier
          )
          .subscribe((res) => {});
      });
    });
  }

  routeTo(filter:string){
    if(filter=='/explore'){
      this.router.navigate([filter], {
        queryParams: { blockchain: 'ethereum', filter: 'all' },
      });
    }else if(filter=='/mint'){
      this.router.navigate([filter]);
    }else if(filter=='/explore'){
      this.router.navigate([filter], {
        queryParams: { blockchain: 'ethereum', filter: 'all' },
      });
    }else if(filter=='/blogs'){
      this.router.navigate([filter]);
    }else if(filter=='/docs'){
      this.router.navigate([filter]);
    }else{
      alert("Invalid page!")
    }

  }

  ngOnInit(): void {
    //const timer$ = timer(0,APIConfigENV.homepageIntervalTimer)
    //timer$.subscribe(data=>{
    this.nft.getNFTOnSale('ON SALE').subscribe((result: any) => {
      this.List = [];
      this.List2=[];
      this.nfts = result;
      for (let x = 0; x < this.nfts.Response.length; x++) {
        if(this.nfts.Response[x].trending==true){
          console.log("trendiing.............",this.nfts.Response[x])
          this.nft
          .getSVGByHash(this.nfts.Response[x].imagebase64)
          .subscribe((res: any) => {
            this.Decryption = res.Response.Base64ImageSVG;
            if(this.nfts.Response[x].attachmenttype == "image/jpeg" || this.nfts.Response[x].attachmenttype == "image/jpg" || this.nfts.Response[x].attachmenttype == "image/png"){
              this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
            }else{
              this.dec = btoa(this.Decryption);
          var str2 = this.dec.toString();
          var str1 = new String( "data:image/svg+xml;base64,");
          var src = str1.concat(str2.toString());
          this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
          if(this.nfts.Response[x].thumbnail==""){
              this.thumbnailSRC=this.imageSrc
          }else{
            this.thumbnailSRC = this._sanitizer.bypassSecurityTrustResourceUrl(this.nfts.Response[x].thumbnail);
          }
          
            }

            let card: NFTCard = new NFTCard('', '', '', '','','','','');
            card.ImageBase64 = this.imageSrc;
            card.thumbnail=this.thumbnailSRC
            card.Blockchain = this.nfts.Response[x].blockchain;
            card.NFTIdentifier = this.nfts.Response[x].nftidentifier;
            card.NFTName = this.nfts.Response[x].nftname;
            card.Blockchain=this.nfts.Response[x].blockchain
            card.CreatorUserId=this.nfts.Response[x].creatoruserid
            card.SellingStatus=this.nfts.Response[x].sellingstatus
            card.CurrentOwnerPK=this.nfts.Response[x].currentownerpk
            this.List2.forEach((element) => {
              if (card == element) {
                this.newitemflag == false;
              }
            });
            if (this.newitemflag) {
              this.List2.push(card);
            }
          });
        }
        if(this.nfts.Response[x].hotpicks==true){
        this.nft
          .getSVGByHash(this.nfts.Response[x].imagebase64)
          .subscribe((res: any) => {
            this.Decryption = res.Response.Base64ImageSVG;
            if(this.nfts.Response[x].attachmenttype == "image/jpeg" || this.nfts.Response[x].attachmenttype == "image/jpg" || this.nfts.Response[x].attachmenttype == "image/png"){
              this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
            }else{
              this.dec = btoa(this.Decryption);
          var str2 = this.dec.toString();
          var str1 = new String( "data:image/svg+xml;base64,");
          var src = str1.concat(str2.toString());
          this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
          if (this.nfts.Response[x].thumbnail==""){
            this.thumbnailSRC=this._sanitizer.bypassSecurityTrustResourceUrl(src);
          }else{
            this.thumbnailSRC = this._sanitizer.bypassSecurityTrustResourceUrl(this.nfts.Response[x].thumbnail);
          }
          
            }
            let card: NFTCard = new NFTCard('', '', '', '','','','','');
            card.ImageBase64 = this.imageSrc;
            card.thumbnail=this.thumbnailSRC
            card.Blockchain = this.nfts.Response[x].blockchain;
            card.NFTIdentifier = this.nfts.Response[x].nftidentifier;
            card.NFTName = this.nfts.Response[x].nftname;
            card.Blockchain=this.nfts.Response[x].blockchain
            card.CreatorUserId=this.nfts.Response[x].creatoruserid
            card.SellingStatus=this.nfts.Response[x].sellingstatus
            card.CurrentOwnerPK=this.nfts.Response[x].currentownerpk
            this.List.forEach((element) => {
              if (card == element) {
                this.newitemflag == false;
              }
            });
            if (this.newitemflag) {
              this.List.push(card);
            }
          });
        }
      }
    });


    //})


    window.addEventListener('scroll', () => {
      this.backTopVisible = window.pageYOffset !== 0;
    });
  }

  public goToTop() {
    window.scrollTo(0, 0);
  }

  public scrollLeft(elementId: string) {
    document.getElementById(elementId)!.scrollLeft -= 300;
  }

  public scrollRight(elementId: string) {
    document.getElementById(elementId)!.scrollLeft += 300;
  }

  public viewHotPicks () {
    this.router.navigate(['/shownft'], {
      queryParams: {data: 'hotpicks' },
    });
  }

  public viewTrending () {
    this.router.navigate(['/shownft'], {
      queryParams: { data: 'Favourites' },
    });
  }

  /* @HostListener('window:scroll', ['$event']) openConfirmation(e: any) {
    const element = document.getElementsByClassName('home-section')!;
    element[1].scrollIntoView({ behavior: 'smooth' });
  } */
}
