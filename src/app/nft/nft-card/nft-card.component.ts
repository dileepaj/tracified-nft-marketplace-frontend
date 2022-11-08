import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { UserWallet } from 'src/app/models/userwallet';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.css']
})
export class NftCardComponent implements OnInit {
  @Input() itemId : string;
  @Input() item: any;
  @Input() blockchain : string;
  private isNftItem : boolean = false;
  favouritesModel: Favourites = new Favourites('', '','');
  watchlistModel: WatchList = new WatchList('', '','');

  constructor(
    private router : Router,
    private snackbarService : SnackbarServiceService,
    private api: ApiServicesService,
    private dialogService : DialogService
  ) { }

  ngOnInit(): void {
    console.log(this.itemId)
  }

  public async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      this.favouritesModel.User= await freighterWallet.getWalletaddress();

    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.favouritesModel.User = await phantomWallet.getWalletaddress();

    }

    if (
      blockchain == 'ethereum' ||
      blockchain == 'polygon'
    ) {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.favouritesModel.User = await metamaskwallet.getWalletaddress();

    }

  }

  /**
   * @function toggleView - Toggle NFT item overlay.
   * @param element - element id
   */
  public toggleView(element : any) : void {
    this.isNftItem = true;
    document.getElementById(element)?.classList.add('overlay-hide');
  }

  /**
   * @function addToFavourites - Add NFT to favorites.
   * @param id - NFT Identifier
   */
  public addToFavourites(id : string) : void {
    this.favouritesModel.Blockchain = this.blockchain;
    this.favouritesModel.NFTIdentifier = id;
    this.retrive(this.favouritesModel.Blockchain).then(res=>{
      this.api.addToFavourites(this.favouritesModel).subscribe(res=>{
        this.snackbarService.openSnackBar("Added to favourites")
        this.api.getFavouritesByBlockchainAndNFTIdentifier(this.favouritesModel.Blockchain,this.favouritesModel.NFTIdentifier).subscribe(res=>{
        });
      })
    })
  }

  /**
   * @function addToWatchList - Add NFT to watch list.
   * @param id - NFT Identifier
   */
  public addToWatchList(id : string) : void {
    this.watchlistModel.Blockchain = this.blockchain;
    this.watchlistModel.NFTIdentifier =id;
    this.retrive(this.watchlistModel.Blockchain).then(res=>{
      this.api.addToWatchList(this.watchlistModel).subscribe(res=>{
        this.snackbarService.openSnackBar("Added to watchlists")
        this.api.getWatchlistByBlockchainAndNFTIdentifier(this.watchlistModel.Blockchain,this.watchlistModel.NFTIdentifier).subscribe(res=>{
        });
      })
    })
  }

  //TO:DO
  viewNFT(){

  }

  /**
   * @function routeToBuy - Navigate to buy view.
   * @param id - NFT Identifier
   */
  public routeToBuy(id : string) : void {
    let data :any[]=[id,this.blockchain];
    this.router.navigate(['./buyNft'],{
    queryParams:{data:JSON.stringify(data)}
    })
  }

  @HostListener('document:click')
  clickedOut() {
    if(this.isNftItem) {
      this.isNftItem = false;
    }
    else {
      document.getElementById('overlay'+this.itemId)?.classList.remove('overlay-hide');
    }
  }

  public openPreview() {
    this.dialogService.openNftPreview({image : this.item.ImageBase64});
  }

}
