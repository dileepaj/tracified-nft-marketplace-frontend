import { Component, Inject, OnInit } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from 'rxjs';
import { Mint2,Image,SVG } from 'src/app/models/minting';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import CryptoJS from 'crypto-js';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent implements OnInit {
  public image: Image;
  addSubscription: Subscription;
  imageSrc:any='';
  base64: string = '';
  file: File;
  base64Output : string;
  controlGroupMint: FormGroup;
  CollectionList: any;
  Encoded:string;
  collection:Collection = new Collection('user1', 'collectionName', 'org')//declaring model to get collections
  mint:Mint2 = new Mint2('','','','')//declaring model to mint and post
  loading: boolean;
  imgSrc: any;
  hash: any;
  svg:SVG=new SVG('','')
 
  constructor(private service:CollectionService,private router:Router,private _sanitizer: DomSanitizer,private apiService:ApiServicesService, private snackBar: SnackbarServiceService) { }
 
  sendToMint2(): void {//function to pass data to the next component
    //getting form data and equaling it to the model
    this.mint.NftContentURL = this.hash;
    this.mint.Collection = this.formValue('Collection');
    this.mint.NFTName = this.formValue('NFTName');
    this.mint.Description = this.formValue('Description');
    this.convertSvg()
    //using routers to pass parameters of data into the next component
   let data :any=this.mint;
   this.router.navigate(['./mint2'],{
   queryParams:{data:JSON.stringify(data)}
   })
   }

   convertSvg():void{
   this.svg.Base64ImageSVG=this.Encoded ;
   this.svg.Hash= this.hash;
   this.apiService.addSVG(this.svg).subscribe();

   }

   onFileChange(event: any){
    this.file = event.target.files[0];
    this.uploadImage(event);
   }

   public uploadImage(event: Event) {
    this.loading = !this.loading;
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = this._handleReaderLoaded.bind(this);
    this.loading = false; // Flag variable
  }

   //create base64 image
  private _handleReaderLoaded(readerEvt: any) {
    this.base64 = readerEvt.target.result;
    const unwantedText = "data:image/svg+xml;base64,";
    this.base64 = this.base64.replace(unwantedText, "");
    let encoded: string = atob(this.base64);
    this.Encoded=encoded;
    
    this.hash=CryptoJS.SHA256(encoded).toString(CryptoJS.enc.Hex)
    this.updateImage();
    this.updateHTML();
  }

  public updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.imgSrc = reader.result;    
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.imgSrc);
    };
  }

  private updateImage() {
    this.image = {
      ...this.image,
      Type: this.file.type,
      Base64Image: this.base64,
    };
  }
  ngOnInit(): void {
   //getting collection data according to user PK
    this.collection.userId="A101";
    if (this.collection.userId!=null) {
      this.service.getCollectionName(this.collection.userId).subscribe((data:any)=>{
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
      file: new FormControl(this.mint.NftContentURL, [Validators.required]),
    });
  }
  
//getting input to formValue function from html code
  private formValue(controlName: string): any {
    return this.controlGroupMint.get(controlName)!.value;
  }

  /**
   * @function reset - reset the entered form values
   */
  reset(){
    this.controlGroupMint.reset()
  }

  /**
   * @function onClickSubmit - User input validations
   */
  onClickSubmit(){ 
    if (this.formValue('Collection') == '') {
      this.snackBar.openSnackBar('Please select a collection for your NFT');
    } else if (this.formValue('NFTName') == '') {
      this.snackBar.openSnackBar('Please name your NFT');
    } else if (this.formValue('Description') == '') {
      this.snackBar.openSnackBar('Please add a discription for your NFT');
    } else{
      this.sendToMint2();
    }
  }

}
