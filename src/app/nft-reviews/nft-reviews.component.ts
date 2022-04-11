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
  
  //Fuction will retreive data from the .html file and initiate the service call to save a user reivew
  save():void{
    this.review.NFTIdentifier="ABC1"
    this.review.UserID="U0045"
    this.review.Rating=parseFloat(this.formValue('rating'));
    this.review.Description=this.formValue('description');
    /**
     * If Condition checks wether the two imputs are empty. If one of the two inputs are emtpy an alert will
     * apear requesting the user to enter data. If not the service call will get initated. 
     */
    if(this.review.Description == "" || this.review.Rating==null){
      alert("Please enter data for both feilds")
    }
    else{
      this.addSubscription = this.service.add(this.review).subscribe()
      alert("Your review has been submitted.")
    }
    
  }

  ngOnInit(): void {
    /**
     * Adds the requeired validator for rating and validation. when the user tries to submit empty data Visual feedback 
     * will apear
     */
    this.controlGroup = new FormGroup({
      rating : new FormControl(this.review.Rating, Validators.required),
      description : new FormControl(this.review.Description,Validators.required)
    });
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

}
