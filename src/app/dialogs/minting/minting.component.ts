import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PendingDialog } from 'src/app/models/confirmDialog';

@Component({
  selector: 'app-minting',
  templateUrl: './minting.component.html',
  styleUrls: ['./minting.component.css']
})
export class MintingComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:PendingDialog) { }

  ngOnInit(): void {
  }

}
