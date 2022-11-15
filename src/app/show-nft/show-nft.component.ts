import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Card,
  Favourites,
  HomeCard,
  NFTCard,
  WatchList,
} from '../models/marketPlaceModel';
import { SVG, Track } from '../models/minting';
import { NFTMarket } from '../models/nft';
import { UserWallet } from '../models/userwallet';
import { ApiServicesService } from '../services/api-services/api-services.service';
import { NftServicesService } from '../services/api-services/nft-services/nft-services.service';
import { MintService } from '../services/blockchain-services/mint.service';
import { SnackbarServiceService } from '../services/snackbar-service/snackbar-service.service';
import { FreighterComponent } from '../wallet/freighter/freighter.component';
import { MetamaskComponent } from '../wallet/metamask/metamask.component';
import { PhantomComponent } from '../wallet/phantom/phantom.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-show-nft',
  templateUrl: './show-nft.component.html',
  styleUrls: ['./show-nft.component.css'],
})
export class ShowNFTComponent implements OnInit {
  Decryption: any;
  NFTList: any;
  List: any[] = [];
  svg: SVG = new SVG('', '', 'NA','');
  favouritesModel: Favourites = new Favourites('', '', '');
  watchlistModel: WatchList = new WatchList('', '', '');
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
  imageSrc: any;
  dec: string;
  data: any;
  selectedBlockchain: string;
  nfts: any;
  loading: boolean = false;

  constructor(
    private api: ApiServicesService,
    private service: NftServicesService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private snackbarService: SnackbarServiceService,
    private mint: MintService,
    private _location: Location
  ) {}

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

  viewNFT() {}

  routeToBuy(id: string, blockchain: string) {
    let data: any[] = [id, blockchain];
    this.router.navigate(['./buyNft'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  public back() {
    this._location.back();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = params['data'];
      console.log('DATA recived: ', this.data);
    });

    if (this.data != null) {
      this.loading = true;
      if (this.data == 'Favourites') {
        this.service.getNFTOnSale('ON SALE').subscribe((result: any) => {
          this.nfts = result.Response;
          console.log('data: ', this.nfts);
          for (let x = 0; x < this.nfts.length; x++) {
            if (this.nfts[x].trending == true) {
              console.log('data: -------------');
              this.service
                .getSVGByHash(this.nfts[x].imagebase64)
                .subscribe((res: any) => {
                  this.Decryption = res.Response.Base64ImageSVG;

                  if(this.nfts[x].attachmenttype == "image/jpeg" || this.nfts[x].attachmenttype == "image/jpg" || this.nfts[x].attachmenttype == "image/png"){
                    this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
                  }else{
                    this.dec = btoa(this.Decryption);
                var str2 = this.dec.toString();
                var str1 = new String( "data:image/svg+xml;base64,");
                var src = str1.concat(str2.toString());
                this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
                  }
           
                   let card: NFTCard = new NFTCard('', '', '', '','','','');
                  card.ImageBase64 = this.imageSrc;
                  card.NFTIdentifier = this.nfts[x].nftidentifier;
                  card.NFTName = this.nfts[x].nftname;
                  card.Blockchain = this.nfts[x].blockchain;
                  card.CreatorUserId=this.nfts[x].creatoruserid;
                  card.CurrentOwnerPK=this.nfts[x].currentownerpk;
                  card.SellingStatus=this.nfts[x].sellingstatus;
                  this.List.push(card);
                  console.log('list ', this.List);
                  this.loading = false;
                });
            }
          }
        });
      }else  if(this.data=='hotpicks'){
        this.service.getNFTOnSale('ON SALE').subscribe((result: any) => {
          this.nfts = result.Response;
          console.log('data: ', this.nfts);
          for (let x = 0; x < this.nfts.length; x++) {
            if (this.nfts[x].hotpicks == true) {
              this.service
                .getSVGByHash(this.nfts[x].imagebase64)
                .subscribe((res: any) => {
                  this.Decryption = res.Response.Base64ImageSVG;

                  if(this.nfts[x].attachmenttype == "image/jpeg" || this.nfts[x].attachmenttype == "image/jpg" || this.nfts[x].attachmenttype == "image/png"){
                    this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
                  }else{
                    this.dec = btoa(this.Decryption);
                var str2 = this.dec.toString();
                var str1 = new String( "data:image/svg+xml;base64,");
                var src = str1.concat(str2.toString());
                this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
                  }
                   let card: NFTCard = new NFTCard('', '', '', '','','','');
                  card.ImageBase64 = this.imageSrc;
                  card.NFTIdentifier = this.nfts[x].nftidentifier;
                  card.NFTName = this.nfts[x].nftname;
                  card.Blockchain = this.nfts[x].blockchain;
                  card.CreatorUserId=this.nfts[x].creatoruserid;
                  card.CurrentOwnerPK=this.nfts[x].currentownerpk;
                  card.SellingStatus=this.nfts[x].sellingstatus;
                  this.List.push(card);
                  console.log('list ', this.List);
                  this.loading = false;
                });
            }
          }
        });
      }else  if(this.data!='Favourites' && this.data!='hotpicks'){
      this.mint
        .getNFTByTag(this.data)
        .subscribe((res: any) => {
          console.log("data: ",res)
          this.NFTList = res
          if (this.NFTList == null) {
            console.log('retrying...');
            this.loading = false;
            this.ngOnInit();
          }
          for (let x = 0; x < this.NFTList.Response.length; x++) {
            if (this.NFTList.Response[x].sellingstatus == 'ON SALE') {
              this.service
                .getSVGByHash(this.NFTList.Response[x].imagebase64)
                .subscribe((res: any) => {
                  this.Decryption = res.Response.Base64ImageSVG;

                  if(this.NFTList.Response[x].attachmenttype == "image/jpeg" || this.NFTList.Response[x].attachmenttype == "image/jpg" || this.NFTList.Response[x].attachmenttype == "image/png"){
                    this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
                  }else{
                    this.dec = btoa(this.Decryption);
                var str2 = this.dec.toString();
                var str1 = new String( "data:image/svg+xml;base64,");
                var src = str1.concat(str2.toString());
                this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
                  }
                let card: NFTCard = new NFTCard('', '', '', '','','','');
                  card.ImageBase64 = this.imageSrc;
                  card.NFTIdentifier = this.NFTList.Response[x].nftidentifier;
                  card.NFTName = this.NFTList.Response[x].nftname;
                  card.Blockchain = this.NFTList.Response[x].blockchain;
                  card.CreatorUserId=this.NFTList.Response[x].creatoruserid;
                  card.CurrentOwnerPK=this.NFTList.Response[x].currentownerpk;
                  card.SellingStatus=this.NFTList.Response[x].sellingstatus;
                  this.List.push(card);
                  console.log('list ', this.List);
                  this.loading = false;
                });
            } else {
              console.log('NOT ON SALE');
            }
          }
        });
      }
    } else {
      console.log('User PK not connected or not endorsed');
    }
  }
}
