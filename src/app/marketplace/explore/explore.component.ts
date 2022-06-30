import { Component, OnInit } from '@angular/core';
import { Favourites,WatchList } from 'src/app/models/marketPlaceModel';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  watchlist:any;
  favourites:any;
  uptodates:any;
  defaultResult:any;
  nfts:any;
  saleNft:any;
  favouritesModel:Favourites=new Favourites('','');
  watchlistModel:WatchList=new WatchList('','');

  constructor(private api:ApiServicesService,private nft:NftServicesService) { }

  retrieveNfts(blockchain:string){
    if(blockchain=='stellar'){
      this.retrive(blockchain)
    }
    if(blockchain=='solana'){
      this.retrive(blockchain)
    }
    if(blockchain=='ethereum'){
      this.retrive(blockchain)
    }
    if(blockchain=='polygon'){
      this.retrive(blockchain)
    }
  }

  retrive(blockchain:string){
    this.nft.getNFTByBlockchain(blockchain).subscribe(data=>{
      console.log("NFT for  retrieved",data)
      this.nfts=data;
    })
    this.api.getFavouritesByBlockchain(blockchain).subscribe(datafav=>{
      console.log("NFT-> favourites  retrieved",datafav)
      this.favourites=datafav;
    })
    this.api.getWatchListByBlockchain(blockchain).subscribe(datawl=>{
      console.log("NFT-> watchlist  retrieved",datawl)
      this.watchlist=datawl;
    })
    this.nft.getNFTOnSale("ON SALE").subscribe(sales=>{
      console.log("NFT on sale",sales)
      this.saleNft=sales;
    })
  }

  addToFavourites(blockchain:string,Identifier:string){
    this.favouritesModel.Blockchain=blockchain;
    this.favouritesModel.NFTIdentifier=Identifier;
    this.api.addToFavourites(this.favouritesModel).subscribe();
  }

  addToWatchList(blockchain:string,Identifier:string){
    this.watchlistModel.Blockchain=blockchain;
    this.watchlistModel.NFTIdentifier=Identifier;
    this.api.addToWatchList(this.watchlistModel).subscribe();
  }


  ngOnInit(): void {
    this.nft.getNFT().subscribe(result=>{
      console.log(result)
      this.defaultResult=result;
    })
  }


}
