import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-creator-view',
  templateUrl: './creator-view.component.html',
  styleUrls: ['./creator-view.component.css']
})
export class CreatorViewComponent implements OnInit {
  name: any;
  mail: any;
  contact: any;

  constructor(
    public dialogRef: MatDialogRef<CreatorViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.name=this.data.Name
    this.mail=this.data.Email
    this.contact=this.data.Contact
  }

}
