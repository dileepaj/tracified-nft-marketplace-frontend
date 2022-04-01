import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletComponent } from 'src/app/wallet/wallet.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private dialogref :MatDialog) { }

  ngOnInit(): void {
  }
  
  openDialog(){
    this.dialogref.open(WalletComponent,{
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth:'80vh',
      panelClass:'popUpDialog'
    });
  }

}
