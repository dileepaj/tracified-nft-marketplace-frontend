import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';

@Component({
  selector: 'app-change-visibility-dialog',
  templateUrl: './change-visibility-dialog.component.html',
  styleUrls: ['./change-visibility-dialog.component.css'],
})
export class ChangeVisibilityDialogComponent implements OnInit {
  controlGroup: FormGroup;
  isPublic: boolean = false;
  constructor(
    public service: CollectionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChangeVisibilityDialogComponent>,
    private snackbarService: SnackbarServiceService
  ) {}

  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      ispublic: new FormControl(this.isPublic, Validators.required),
    });
    this.controlGroup.controls['ispublic'].setValue(this.data.isPublic);
  }

  save() {
    this.service
      .updateCollectionVisibility(
        this.data.id,
        this.controlGroup.get('ispublic')?.value
      )
      .subscribe(
        (res) => {
          this.snackbarService.openSnackBar(
            'Visibility updated successfully',
            'success'
          );
          this.dialogRef.close();
        },
        (error) => {
          this.snackbarService.openSnackBar(
            'An error occurred, please try again later',
            'error'
          );
        }
      );
  }
}
