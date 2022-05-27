import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletComponent } from 'src/app/wallet/wallet.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private rect: any;

  constructor(private dialogref: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewChecked() {
    this.rect = document.getElementById('btnWallet')?.getBoundingClientRect();
  }

  openDialog() {
    this.dialogref.open(WalletComponent, {
      hasBackdrop: true,
      autoFocus: true,
      panelClass: 'popUpDialog',
      position: {
        right: `${
          this.rect.right - this.rect.left + this.rect.width * 2 + 40
        }px`,
        top: `${this.rect.bottom + 20}px`,
      },
    });
  }
}
