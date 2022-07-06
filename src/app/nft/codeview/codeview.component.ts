import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-codeview',
  templateUrl: './codeview.component.html',
  styleUrls: ['./codeview.component.css'],
})
export class CodeviewComponent implements OnInit {
  code: any;
  imageSrc:any;
  image:any;
  dec:string;
file:any;
  constructor(
    public dialogRef: MatDialogRef<CodeviewComponent>,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.code = this.data.imgSrc;
    console.log("code----------", this.code)
   
    this.dec = btoa(this.code);
    console.log("dec ",this.dec)
    var str2 = this.dec.toString(); 
    var str1 = new String( "data:image/svg+xml;base64,"); 
    var src = str1.concat(str2.toString());
   this.image = this._sanitizer.bypassSecurityTrustResourceUrl(src);
   //this.imageSrc=this.image.changingThisBreaksApplicationSecurity

    // this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.code);
    console.log("------image----: ",this.imageSrc)
  }
}