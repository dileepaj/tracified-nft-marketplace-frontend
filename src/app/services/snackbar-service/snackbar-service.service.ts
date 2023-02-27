import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from 'src/app/dialogs/custom-snackbar/custom-snackbar.component';


@Injectable({
  providedIn: 'root',
})
export class SnackbarServiceService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private _snackBar: MatSnackBar) {}

  public openSnackBar(msg: string, type? : 'success' | 'info' | 'error'){
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        msg, 
        type, 
        close : () => this._snackBar.dismiss()
      }, 
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    })
  }
}
