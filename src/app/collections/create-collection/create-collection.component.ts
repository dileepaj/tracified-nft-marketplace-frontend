import { Component, OnInit } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';

export interface Blockchain {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-create-collection',
  providers: [CollectionService],
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css'],
})
export class CreateCollectionComponent implements OnInit {
  controlGroup: FormGroup;
  addSubscription: Subscription;
  selectVal: string = '';
  collection: Collection = new Collection('', '', '', ''); //declaring the model
  signerPK: string = '';

  constructor(public service: CollectionService,
     private _location: Location,
     private router:Router,
     private dialogService:DialogService,
     private snackbarService:SnackbarServiceService ) {}

  async save(): Promise<void> {
    //getting form data and sending it to the collection service to post
    //getting form data and equalling it to to model variables
    this.collection.collectionName = this.formValue('collectionName');
    this.collection.organizationName = this.formValue('organizationName');
    this.collection.blockchain = "any";
    this.collection.userId=this.formValue('userId');
    this.dialogService.confirmDialog({
      title:'Collection Creation Confirmation',
      message:"Are you sure you want to create the "+this.collection.collectionName+" collection?",
      confirmText:"Yes",
      cancelText:"No"
    }).subscribe(result=>{
      if(result){
              //sending data to the service
        this.addSubscription = this.service.add(this.collection).subscribe(res=>{
          if(res != null || res!=""){
            this.snackbarService.openSnackBar(""+this.collection.collectionName+" collection has successfully been added.")
            this.selectVal = this.collection.collectionName;
          }else{
            this.snackbarService.openSnackBar("Error occured failed to create collection.")
          }
        });
      }
    })
      
  }

  done(){
    this.router.navigate(['./mint'],{
      queryParams:{data:JSON.stringify(this.collection.userId)}
      });
  }

  ngOnInit(): void {
    //validating form data
    this.controlGroup = new FormGroup({
      userId: new FormControl(this.collection.userId, Validators.required),
      collectionName: new FormControl(
        this.collection.collectionName,
        Validators.required
      ),
      organizationName: new FormControl(
        this.collection.organizationName,
        Validators.required
      ),
  
    });
  }

  //initializing input in html to formValue function
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  public resetValues() {
    this.controlGroup.reset();
  }

  public back() {
    this._location.back();
  }
}
