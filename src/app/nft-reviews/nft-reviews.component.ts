import { Review } from './../../models/reviewModel';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ReviewService } from '../services/reviewService/review.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-nft-reviews',
  providers: [ReviewService],
  templateUrl: './nft-reviews.component.html',
  styleUrls: ['./nft-reviews.component.css']
})
export class NftReviewsComponent implements OnInit {
  controlGroup:FormGroup;
  addSubscription: Subscription;
  constructor(public service : ReviewService) { 
  }
  review: Review = new Review("aaa","u001","pending","");
  

  save():void{
    this.review.NFTIdentifier="ABC1"
    this.review.UserID="U0045"
    this.review.Rating=parseFloat(this.formValue('rating'));
    console.log("Rating value retireved : ",this.review.Rating)
    this.review.Description=this.formValue('description');
    if(this.review.Description == "" || this.review.Rating==null){
      alert("Please enter data for both feilds")
    }
    else{
      this.addSubscription = this.service.add(this.review).subscribe()
      console.log(this.addSubscription);
    }
    
  }

  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      rating : new FormControl(this.review.Rating, Validators.required),
      description : new FormControl(this.review.Description,Validators.required)
    });
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

}
