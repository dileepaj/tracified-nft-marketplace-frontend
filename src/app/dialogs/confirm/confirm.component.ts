import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/models/confirmDialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog,
    private matDialogRef: MatDialogRef<ConfirmComponent>
  ) {}

  ngOnInit(): void {}

  public confirm() {
    this.matDialogRef.close(true);
  }

  public cancel() {
    this.matDialogRef.close(false);
  }
}
