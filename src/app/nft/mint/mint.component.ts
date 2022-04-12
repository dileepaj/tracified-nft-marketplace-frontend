import { Component, Inject, OnInit } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from 'rxjs';
import { Mint2 } from 'src/app/models/minting';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent implements OnInit {
  addSubscription: Subscription;
  controlGroupMint: FormGroup;
  CollectionList: any;
  collection:Collection = new Collection('user1', 'collectionName', 'org')//declaring model to get collections
  mint:Mint2 = new Mint2('','','','')//declaring model to mint and post
 
  constructor(private service:CollectionService,private router:Router) { }
 
  sendToMint2(): void {//function to pass data to the next component
    //getting form data and equaling it to the model
    this.mint.NftContentURL = "something";
    this.mint.Collection = this.formValue('Collection');
    this.mint.NFTName = this.formValue('NFTName');
    this.mint.Description = this.formValue('Description');
    console.log("data---------------------",this.mint.NftContentURL,this.mint.Collection,this.mint.NFTName,this.mint.Description)
   
    //using routers to pass parameters of data into the next component
   let data :any=this.controlGroupMint.value;
   this.router.navigate(['./mint2'],{
   queryParams:{data:JSON.stringify(data)}
   })
   }

  ngOnInit(): void {
   //getting collection data according to user PK
    this.collection.userId="A101";
    if (this.collection.userId!=null) {
      this.service.getCollectionName(this.collection.userId).subscribe((data:any)=>{
        console.log("Data was retrieved",data)
        this.CollectionList=data;
      })
    } else {
      console.log("User PK not connected or not endorsed");
    }
    //validation of form data
    this.controlGroupMint = new FormGroup({
      Collection: new FormControl(this.mint.Collection, Validators.required),
      NFTName:new FormControl(this.mint.NFTName,Validators.required),
      Description:new FormControl(this.mint.Description,Validators.required),
    });
  }
  
//getting input to formValue function from html code
  private formValue(controlName: string): any {
    return this.controlGroupMint.get(controlName)!.value;
  }

}
