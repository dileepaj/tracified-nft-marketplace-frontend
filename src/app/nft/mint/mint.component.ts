import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from 'rxjs';
// export interface CollectionList {
//   value: string;
//   viewValue: string;
// }
@Component({
  selector: 'app-mint',
  providers: [CollectionService],
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent implements OnInit {
  addSubscription: Subscription;
  
  // collection: CollectionList[] = [
  //   { value: 'Animals', viewValue: 'Animals' },
  //   { value: 'Gucci', viewValue: 'Gucci' },
  //   { value: 'Ruri', viewValue: 'Ruri' },
  //   { value: 'Kantela', viewValue: 'Kantela' },
  // ];
  CollectionList: any;

  constructor(private service:CollectionService) { }
  collection:Collection = new Collection('user1', 'collectionName', 'org')

  ngOnInit(): void {
    this.collection.userId="A101";
    if (this.collection.userId!=null) {
      console.log("----------------------------test 3-------------------------",this.collection.userId)
      this.service.getCollectionName(this.collection.userId).subscribe((data:any)=>{
        console.log("Data was retrieved",data)
        this.CollectionList=data;
      })
    } else {
      console.log("User PK not connected or not endorsed");
    }
    
  }

}
