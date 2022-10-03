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
  constructor(private route:ActivatedRoute, private service:NftServicesService, private _location: Location,  private router: Router,) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.key=(params['data']);
      console.log("DATA recived: ",this.key)})

    if (this.key != null) {
      this.service.getMyNFT(this.key).subscribe((res:any)=>{
        this.data=res
        console.log("data is: ",this.data)
        let card:MyCollection= new MyCollection('');
            card.collection=this.data.Response[0].collection
             this.List.push(card)
        for(let x=0;x<this.data.Response.length;x++){
          console.log("element 1: ",this.data.Response[x].collection)
          console.log("element 2: ",this.data.Response[x+1].collection)
          if(this.data.Response[x].collection!=this.data.Response[x+1].collection){
            let card:MyCollection= new MyCollection('');
            card.collection=this.data.Response[x].collection
             this.List.push(card)
             console.log("this List ",this.List)
          }
        }
      })
  }

}

showNFT(collection){
  console.log("key is: ",this.key)
  this.router.navigate(['./user-dashboard/mynfts'], {
    queryParams: { collection: [collection,this.key] },//this.data
  });
}

public back() {
  this._location.back();
}

}