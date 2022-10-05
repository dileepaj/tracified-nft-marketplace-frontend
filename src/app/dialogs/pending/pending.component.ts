import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PendingDialog } from 'src/app/models/confirmDialog';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:PendingDialog) { }

  ngOnInit(): void {
  }

}
