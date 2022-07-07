import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExecFileSyncOptionsWithStringEncoding } from 'child_process';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nft-reviews',
  templateUrl: './nft-reviews.component.html',
  styleUrls: ['./nft-reviews.component.css'],
})
export class NftReviewsComponent implements OnInit {
  controlGroup: FormGroup;
  addSubscription: Subscription;
  rating: number;
  description: ExecFileSyncOptionsWithStringEncoding;
  constructor() {}

  //Fuction will retreive data from the .html file and initiate the service call to save a user reivew
  save(): void {
    alert(
      `${this.formValue('rating')} stars, "${this.formValue('description')}"`
    );
  }

  ngOnInit(): void {
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
