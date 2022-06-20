import { Component, OnInit } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from 'rxjs';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';

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
  collection: Collection = new Collection('', '', '','')//declaring the model
  signerPK:string=''

  constructor(public service: CollectionService) {}
 

   async save(): Promise<void> {//getting form data and sending it to the collection service to post
     //getting form data and equalling it to to model variables
    this.collection.collectionName = this.formValue('collectionName');
    this.collection.organizationName = this.formValue('organizationName');
    this.collection.blockchain= this.formValue('blockchain');
    if(this.collection.blockchain=='stellar'){
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet)
      await freighterWallet.initWallelt()
       this.signerPK = await freighterWallet.getWalletaddress()
     this.collection.userId = this.signerPK
     }
  
     if(this.collection.blockchain=='solana'){
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet)
      await phantomWallet.initWallelt()
     this.signerPK = await phantomWallet.getWalletaddress()
     this.collection.userId = this.signerPK
     }
  
     if(this.collection.blockchain=='ethereum' || this.collection.blockchain=='polygon'){
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet)
      await metamaskwallet.initWallelt()
     this.signerPK = await metamaskwallet.getWalletaddress()
     this.collection.userId = this.signerPK
     }
  
   
    if (this.collection.userId!=null) {
      //sending data to the service
      this.addSubscription = this.service.add(this.collection).subscribe();
      this.selectVal=this.collection.collectionName
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
      blockchain:new FormControl(this.collection.blockchain,Validators.required),
    });
    //calling the save function
    this.save();
  }
  
  //initializing input in html to formValue function
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }


}
