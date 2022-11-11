import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { UserWallet } from 'src/app/models/userwallet';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { CreatorViewComponent } from '../creator-view/creator-view.component';

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.css']
})
export class NftCardComponent implements OnInit {
  @Input() itemId : string;
  @Input() item: any;
  @Input() blockchain : string;
  @Input() creatoruserid : string;
  @Input() sellingstatus : string;
  @Input() currentownerpk : string;
  private isNftItem : boolean = false;
  favouritesModel: Favourites = new Favourites('', '','');
  watchlistModel: WatchList = new WatchList('', '','');
  user: string;
  command: any;
  tip: any;

  constructor(
    private router : Router,
    private snackbarService : SnackbarServiceService,
    private api: ApiServicesService,
    public dialog: MatDialog,
    private dialogService : DialogService

  ) { }

  ngOnInit(): void {
    console.log(this.itemId)
    console.log("nft card data: ",this.item,this.blockchain)
    if(this.sellingstatus=='Minted'){
      this.tip="PUT ON SALE"
    }else if(this.sellingstatus=='ON SALE'){
      this.tip="BUY NFT"
    }else if(this.sellingstatus=='NOTFORSALE'){
      this.tip="PUT ON SALE"
    }else{
      alert("Something went wrong!")
    }

   
  }

  public async retrive(blockchain: string) {
    if (blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      this.user=this.watchlistModel.User= this.favouritesModel.User= await freighterWallet.getWalletaddress();
      

    }

    if (blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.user=this.watchlistModel.User=this.favouritesModel.User = await phantomWallet.getWalletaddress();

    }

    if (
      blockchain == 'ethereum' ||
      blockchain == 'polygon'
    ) {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
     this.user= this.watchlistModel.User=this.favouritesModel.User = await metamaskwallet.getWalletaddress();

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
    this.retrive(this.blockchain)
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
    this.retrive(this.blockchain)
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

    this.api.getEndorsement(this.creatoruserid).subscribe((res:any)=>{
      console.log("result is: ",res)
      const dialogRef = this.dialog.open(CreatorViewComponent, {
        data: {
          Name: res.Name,
          Email: res.Email,
          Contact: res.Contact
        },
      });
    })
  }

  /**
   * @function routeToBuy - Navigate to buy view.
   * @param id - NFT Identifier
   */
  public routeToBuy(id : string) : void {
console.log("current owner ",this.currentownerpk)
    if(this.sellingstatus=="Minted"){
      this.retrive(this.blockchain)
      console.log("user and co: ",this.user, this.currentownerpk)
      if(this.user==this.currentownerpk){
        this.command=false
        let data : any[] = ["Minted",id,this.blockchain]
        this.router.navigate(['./sell'],{
          queryParams:{data:JSON.stringify(data)}
        });
      }else{
        this.snackbarService.openSnackBar("NFT is yet to be put on sale")
        this.command=true
      }
    }else if(this.sellingstatus=="ON SALE"){
      this.command=false
      console.log("this is bc in nftcomponent ",this.blockchain)
      let data :any[]=[id,this.blockchain];
      this.router.navigate(['./buyNft'],{
      queryParams:{data:JSON.stringify(data)}
      })
    }else if(this.sellingstatus=="NOTFORSALE"){
      this.retrive(this.blockchain)
      if(this.user==this.currentownerpk){
        this.command=false
        let data : any[] = ["NOTFORSALE",id,this.blockchain]
        this.router.navigate(['./sell'],{
          queryParams:{data:JSON.stringify(data)}
        });
      }else{
      this.snackbarService.openSnackBar("NFT is yet to be put on sale")
      this.command=true
      }
    }else{
      this.snackbarService.openSnackBar("Invalid Command!")
      this.command=true
    }
   
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
