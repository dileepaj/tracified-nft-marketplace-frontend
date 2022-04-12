import { Component, OnInit } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from 'rxjs';

export interface Blockchain {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-create-collection',
  providers: [CollectionService],
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})
export class CreateCollectionComponent implements OnInit {
  controlGroup: FormGroup;
  addSubscription: Subscription;
  selectVal: string = "";
  collection: Collection = new Collection('user1', 'collectionName', 'org')//declaring the model

  constructor(public service: CollectionService) {}
 

   save(): void {//getting form data and sending it to the collection service to post
     //getting form data and equalling it to to model variables
    this.collection.userId = this.formValue('userId');
    this.collection.collectionName = this.formValue('collectionName');
    this.collection.organizationName = this.formValue('organizationName');
   
    if (this.collection.userId!=null) {
      //sending data to the service
      this.addSubscription = this.service.add(this.collection).subscribe();
      console.log(this.addSubscription);
    } else {
      console.log("User PK not connected or not endorsed");
    }
  }

  
  ngOnInit(): void {
    //validating form data
    this.controlGroup = new FormGroup({
      userId: new FormControl(this.collection.userId, Validators.required),
      collectionName:new FormControl(this.collection.collectionName,Validators.required),
      organizationName:new FormControl(this.collection.organizationName,Validators.required),
    });
    //calling the save function
    this.save();
  }
  
  //initializing input in html to formValue function
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }


}
