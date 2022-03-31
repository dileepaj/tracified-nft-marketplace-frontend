import { WalletComponent } from './../../wallet/wallet.component';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dialogref :MatDialog) { 

  }

  openDialog(){
    this.dialogref.open(WalletComponent,{
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth:'101vh',
      panelClass:'popUpDialog'
    });
  }

  ngOnInit(): void {
  }

}
