import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/models/confirmDialog';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css'],
})
export class DisclaimerComponent implements OnInit {
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
