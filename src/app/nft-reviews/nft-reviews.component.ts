import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExecFileSyncOptionsWithStringEncoding } from 'child_process';
import { Subscription } from 'rxjs';
import { Reviews, ReviewsCard } from '../models/nft';
import { ApiServicesService } from '../services/api-services/api-services.service';
@Component({
  selector: 'app-nft-reviews',
  templateUrl: './nft-reviews.component.html',
  styleUrls: ['./nft-reviews.component.css'],
})
export class NftReviewsComponent implements OnInit {
  controlGroup: FormGroup;
  addSubscription: Subscription;
  rating: number;
  reviews:Reviews=new Reviews('','','','','')
  description: ExecFileSyncOptionsWithStringEncoding;
  data: any;
  List:any[]=[];
  list: any;
  constructor( private route:ActivatedRoute,private service:ApiServicesService) {}

  //Fuction will retreive data from the .html file and initiate the service call to save a user reivew
  save(): void {
    alert(
      `${this.formValue('rating')} stars, "${this.formValue('description')}"`
    );

    this.reviews.Status="Pending"
    this.reviews.Description=this.controlGroup.get('description')!.value;
    this.reviews.Rating=this.controlGroup.get('rating')!.value;
    this.reviews.NFTIdentifier=this.data.nftidentifier;
    this.reviews.UserID=this.data.currentownerpk;
    console.log("Ready to save review",this.reviews)
    this.service.addReviews(this.reviews).subscribe(res=>{
      console.log("Saved reviews", res)
    })

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('data passed :', this.data);
    })

    this.service.getAllReviewsByNFTId(this.data.nftidentifier).subscribe((res:any)=>{
      console.log("Reviews ",res)
      this.list=res
      for(let x=0; x< (this.list.length); x++){
        let card:ReviewsCard= new ReviewsCard('','','');
        card.UserID=this.list[x].userid
        card.Rating=this.list[x].rating
        card.Description=this.list[x].description
        this.List.push(card)
        
      }
      console.log("list: ",this.List)
    })
    /**
     * Adds the requeired validator for rating and validation. when the user tries to submit empty data Visual feedback
     * will apear
     */
    this.controlGroup = new FormGroup({
      rating: new FormControl(this.rating, Validators.required),
      description: new FormControl(this.description, Validators.required),
    });
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }
}
