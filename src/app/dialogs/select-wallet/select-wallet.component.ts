import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { selectWalletDialog } from 'src/app/models/confirmDialog';

@Component({
  selector: 'app-select-wallet',
  templateUrl: './select-wallet.component.html',
  styleUrls: ['./select-wallet.component.css']
})
export class SelectWalletComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: selectWalletDialog,
    private matDialogRef: MatDialogRef<SelectWalletComponent>
  ) { }

  ngOnInit(): void {
  }

  public selectFreighter() {
    this.matDialogRef.close(true);
    const wallet ='freighter'
    return wallet
  }

  public selectAlbedo() {
    this.matDialogRef.close(true);
    const wallet ='albedo'
    return wallet
  }

}
