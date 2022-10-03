import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OkDialog } from 'src/app/models/confirmDialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-okmessage',
  templateUrl: './okmessage.component.html',
  styleUrls: ['./okmessage.component.css']
})
export class OkmessageComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:OkDialog,private matDialogRef: MatDialogRef<OkmessageComponent>) { }

  ngOnInit(): void {
  }
  confirm(){
    this.matDialogRef.close(true);
  }
}
