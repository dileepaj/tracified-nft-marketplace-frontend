import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OkDialog } from 'src/app/models/confirmDialog';

@Component({
  selector: 'app-okmessage',
  templateUrl: './okmessage.component.html',
  styleUrls: ['./okmessage.component.css']
})
export class OkmessageComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:OkDialog) { }

  ngOnInit(): void {
  }

}
