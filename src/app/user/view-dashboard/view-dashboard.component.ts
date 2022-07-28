import { Component, OnInit } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.css'],
})
export class ViewDashboardComponent implements OnInit {
  userId: any;
  nfts: any;
  mywatchlist: any;
  myfavourites: any;
  collectionList: any;
  opened: boolean = true;
  constructor(
    private api: ApiServicesService,
    private nft: NftServicesService,
    private collection: CollectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getMyWatchList(userId) {
    this.api.getWatchListByUserId(userId).subscribe((mylist) => {
      this.mywatchlist = mylist;
    });
  }

  getMyFavourites(userId) {
    this.api.getFavouritesByUserId(userId).subscribe((myfavs) => {
      this.myfavourites = myfavs;
    });
  }

  getMyNFTStatus(userId, status) {
    if (status == 'Minted') {
      this.nft.getMyNFTStatus(status, userId).subscribe((mynft) => {
        this.nfts = mynft;
      });
    }
    if (status == 'ON SALE') {
      this.nft.getMyNFTStatus(status, userId).subscribe((mynft) => {
        this.nfts = mynft;
      });
    }
  }

  getMyCollections(userId) {
    this.collection.getCollectionName(userId).subscribe((collection) => {
      this.collectionList = collection;
    });
  }

  ngOnInit(): void {
    this.nft.getMyNFT(this.userId).subscribe((data) => {
      console.log('My NFTs ', data);
      this.nfts = data;
    });
  }

  public toggleSidenav() {
    this.opened = !this.opened;
  }

  public currentRoute(): string {
    return this.router.url;
  }
}
