import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/models/confirmDialog';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-sell-nft-confirmation',
  templateUrl: './sell-nft-confirmation.component.html',
  styleUrls: ['./sell-nft-confirmation.component.css']
})
export class SellNftConfirmationComponent implements OnInit {

  public acceptEnabled: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog,
    private matDialogRef: MatDialogRef<ConfirmComponent>
  ) {}

  ngOnInit(): void {}

  public onCheckedChange(e: any) {
    this.acceptEnabled = e.target.checked;
  }

  public confirm() {
    this.matDialogRef.close(true);
  }

  public cancel() {
    this.matDialogRef.close(false);
  }

}
