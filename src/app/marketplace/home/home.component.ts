import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletComponent } from 'src/app/wallet/wallet.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  constructor(private dialogref: MatDialog) {}

  openDialog() {
    this.dialogref.open(WalletComponent, {
      autoFocus: false,
      panelClass: 'popUpDialog',
    });
  }
  ngOnInit(): void {}
}
