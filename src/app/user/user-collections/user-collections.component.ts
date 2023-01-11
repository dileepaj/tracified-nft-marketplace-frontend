import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { Location } from '@angular/common';
import { NftReviewsComponent } from 'src/app/nft-reviews/nft-reviews.component';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { MyCollection } from 'src/app/models/collection';

@Component({
  selector: 'app-user-collections',
  templateUrl: './user-collections.component.html',
  styleUrls: ['./user-collections.component.css']
})
export class UserCollectionsComponent implements OnInit {
  data: any;
  List:any[]=[];
  key: string;
  selectedblockchain:any;
  constructor(private route:ActivatedRoute, private service:NftServicesService, private _location: Location,  private router: Router,private collection: CollectionService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.key=(params['user']);
      this.selectedblockchain=(params['blockchain'])
    })

    if (this.key != null) {
      this.collection.getCollectionPK(this.key).subscribe((res:any)=>{
        this.data=res
        for(let x=0;x<this.data.length;x++){
            let card:MyCollection= new MyCollection('');
            card.collection=this.data[x].CollectionName
             this.List.push(card)
        }
      })
  }

}

showNFT(collection){
  this.router.navigate(['./user-dashboard/mynfts'], {
    queryParams: { collection: collection,user:this.key,blockchain:this.selectedblockchain},//this.data
  });
}

public back() {
  this._location.back();
}

}