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
  providers: [
   
     ],
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})
export class CreateCollectionComponent implements OnInit {
  controlGroup: FormGroup;
  addSubscription: Subscription;
 
  
  blockchain: Blockchain[] = [
    { value: 'Ethereum', viewValue: 'Ethereum' },
    { value: 'Polygon', viewValue: 'Polygon' },
    { value: 'Stellar', viewValue: 'Stellar' },
    { value: 'Solana', viewValue: 'Solana' },
  ];

  constructor(public collection:Collection,
  public service: CollectionService) {
    this.controlGroup = new FormGroup({
      userPK: new FormControl(collection.userPK, Validators.required),
      collectionName:new FormControl(collection.collectionName,Validators.required),
      orgName:new FormControl(collection.orgName,Validators.required),
      blockchain: new FormControl(collection.blockchain,Validators.required)
    });
   }
   
   save(): void {
    this.collection.userPK = this.formValue('userPK');
    this.collection.collectionName = this.formValue('collectionName');
    this.collection.orgName = this.formValue('orgName');
    this.collection.blockchain = this.formValue('blockchain');
    if (this.collection.userPK!=null) {
      this.addSubscription = this.service.add(this.collection)
        .subscribe();
        console.log(this.addSubscription);
    } else {
      console.log("User PK not connected or not endorsed");
    }
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  ngOnInit(): void {
  }

}
