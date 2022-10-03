import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserFAQ } from 'src/app/models/userFAQ';
import CryptoJS from 'crypto-js';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { UserFAQService } from 'src/app/services/userFAQService/user-faq.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  public controlGroup: FormGroup;
  file: File;
  name: string = '';
  userFAQ: UserFAQ = new UserFAQ('','','','','','','','')
  public email:string
  base64: string = '';
  img: any = '';
  Encoded: string;
  hash: any;
  binaryString: any;
  base64textString: string;
  constructor(private apiService:UserFAQService) {}

  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      Email : new FormControl(this.userFAQ.usermail,[Validators.email,Validators.required]),
      Collection: new FormControl(this.userFAQ.category,Validators.required),
      Subject : new FormControl(this.userFAQ.subject,Validators.required),
      Description: new FormControl(this.userFAQ.desc,Validators.required),
      attachment: new FormControl(this.userFAQ.attached,Validators.required)
    });
  }


  //trigger file input click event
  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }

  public saveUserFAQ(){
    this.userFAQ.usermail=this.formValue('Email')
    this.userFAQ.category=this.formValue('Collection')
    this.userFAQ.subject=this.formValue('Subject')
    this.userFAQ.desc=this.formValue('Description')
    this.userFAQ.status='Pending'
    this.userFAQ.attached= this.base64textString
    
    console.log(this.userFAQ)
    this.apiService.addUserFAQ(this.userFAQ).subscribe(res=>{
      console.log("server response: ",res)
    })
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.target.id === 'cntct-dnd' || evt.target.id === 'cntct-dnd-label') {
      let files = evt.dataTransfer.files;
      let valid_files: Array<File> = files;
      this.file = valid_files[0];
      this.name = this.file.name;
      
    }
  }
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  public onChange(event: any) {
    this.file = event.target.files[0];
    this.name = this.file.name;
    var reader = new FileReader();
    reader.onload =this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.file);
  }
  private _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString= btoa(binaryString);
  }

}
