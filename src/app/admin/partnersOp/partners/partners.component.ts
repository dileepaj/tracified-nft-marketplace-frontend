import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Partners } from 'src/app/models/admin';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  imageSrc:any='';
  base64: string = '';
  file: File;
  loading: boolean;
  imgSrc:any;
  controlGroup: FormGroup;
  addSubscription: Subscription;
  partner:Partners=new Partners('','','','','')
  constructor(private service:ApiServicesService,private _sanitizer: DomSanitizer) { }

  async save(): Promise<void> {//getting form data and sending it to the collection service to post
    //getting form data and equalling it to to model variables
    
   this.partner.Topic = this.formValue('topic');
   this.partner.WebLink = this.formValue('weblink');
   this.partner.CompanyName = this.formValue('companyname');
   this.partner.Description = this.formValue('description');
   this.partner.Image= this.imgSrc;
     //sending data to the service
   this.service.registerPartner(this.partner).subscribe();
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

private _handleReaderLoaded(readerEvt: any) {
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

  ngOnInit(): void {
   //validating form data
   this.controlGroup = new FormGroup({
    topic: new FormControl(this.partner.Topic, Validators.required),
    weblink:new FormControl(this.partner.WebLink,Validators.required),
    companyName:new FormControl(this.partner.CompanyName,Validators.required),
    description:new FormControl(this.partner.Description,Validators.required),
  });
}

//initializing input in html to formValue function
private formValue(controlName: string): any {
  return this.controlGroup.get(controlName)!.value;
}

}
