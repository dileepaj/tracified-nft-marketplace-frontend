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
  data: any;
  EndorseList: any;
  constructor(
    private api: ApiServicesService,
    private nft: NftServicesService,
    private collection: CollectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  

  goToOverview(){

      this.router.navigate(['./user-dashboard/overview'], {
        queryParams: { blockchain: this.data },
      });
      
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.data=JSON.parse(params['data']);
      console.log("data on the side: ",this.data)
      this.api.getEndorsement(this.data).subscribe((res:any)=>{
        this.EndorseList=res
        console.log("endorsed previously: ",this.EndorseList)})
    })
    
      
  }

  public toggleSidenav() {
    this.opened = !this.opened;
  }

  public currentRoute(): string {
    return this.router.url;
  }
}
