import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MintPopupComponent } from '../mint-popup/mint-popup.component';
@Component({
  selector: 'app-mint3',
  templateUrl: './mint3.component.html',
  styleUrls: ['./mint3.component.css'],
})
export class Mint3Component implements OnInit {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(MintPopupComponent);
  }

  save(): void {}

  ngOnInit(): void {}
}
