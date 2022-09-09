import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateEndorse } from 'src/app/models/endorse';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  endorse:UpdateEndorse= new UpdateEndorse('','','','')
  file: File;
  base64: string = '';
  img: any = '';
  controlGroupProfile: FormGroup;
  controlGroupEmail: FormGroup;
  controlGroupPassword: FormGroup;
  data: any;
  image: string;
  EndorseList:any;
  constructor(private router: Router,private route:ActivatedRoute,private service:ApiServicesService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.data=JSON.parse(params['data']);
      this.service.getEndorsement(this.data).subscribe((res:any)=>{
        this.EndorseList=res
      })
    })



    this.controlGroupProfile = new FormGroup({
      name: new FormControl(this.endorse.Name, Validators.required),
      contact: new FormControl(this.endorse.Contact, Validators.required),
      mail: new FormControl(this.endorse.Email, Validators.required),
    });
  }

  public saveProfile() {
    this.endorse.Name = this.controlGroupProfile.get('name')!.value;
    this.endorse.Contact = this.controlGroupProfile.get('contact')!.value;
    this.endorse.Email = this.controlGroupProfile.get('mail')!.value;
    this.endorse.PublicKey=this.data
   // this.profile.image = this.base64;
    this.service.updateEndorsement(this.endorse).subscribe(res=>{
    })

  }


  public onChange(event: any) {
    this.file = event.target.files[0];
    this.uploadImage(event);
  }

  //called when user uploads an image
  public uploadImage(event: Event) {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.file);
  }

  //create base64 image
  private _handleReaderLoaded(readerEvt: any) {
    this.base64 = readerEvt.target.result;
    this.image = this.base64;
    this.updateHTML();
  }

  //update html
  public updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.img = reader.result;
    };
  }

  //trigger file input click event
  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }
}
