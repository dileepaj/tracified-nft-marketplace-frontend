import { Component, Inject, OnInit } from '@angular/core';
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
 
  
  // blockchains: Blockchain[] = [
  //   { value: 'Ethereum', viewValue: 'Ethereum' },
  //   { value: 'Polygon', viewValue: 'Polygon' },
  //   { value: 'Stellar', viewValue: 'Stellar' },
  //   { value: 'Solana', viewValue: 'Solana' },
  // ];

  blockchains=['Stellar','Solana','Polygon','Ethereum']
 
  selectVal: string = "";
  

  constructor(public service: CollectionService) {}
  collection: Collection = new Collection('user1', 'collectionName', 'org', 'Polygon')

   save(): void {
     console.log("-------------------------------------testing 1 -----------------------------------");
    this.collection.userId = this.formValue('userId');
    this.collection.collectionName = this.formValue('collectionName');
    this.collection.organizationName = this.formValue('organizationName');
    this.collection.blockchain = this.formValue('blockchain');
    console.log("----------test 2 ----------------------",this.collection.userId,this.collection.collectionName,this.collection.organizationName,this.collection.blockchain)
    if (this.collection.userId!=null) {
      console.log("----------------------------test 3-------------------------")
      this.addSubscription = this.service.add(this.collection).subscribe();
      console.log(this.addSubscription);
    } else {
      console.log("User PK not connected or not endorsed");
    }
  }

  
  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      userId: new FormControl(this.collection.userId, Validators.required),
      collectionName:new FormControl(this.collection.collectionName,Validators.required),
      organizationName:new FormControl(this.collection.organizationName,Validators.required),
      blockchain: new FormControl(this.collection.blockchain,Validators.required)
    });

    this.save();
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }


}
