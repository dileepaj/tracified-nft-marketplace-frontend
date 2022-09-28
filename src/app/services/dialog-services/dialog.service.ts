import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { OkmessageComponent } from 'src/app/dialogs/okmessage/okmessage.component';
import { PendingComponent } from 'src/app/dialogs/pending/pending.component';
import { ConfirmDialog, OkDialog } from 'src/app/models/confirmDialog';
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirmDialog(data: ConfirmDialog): Observable<boolean> {
    return this.dialog
      .open(ConfirmComponent, {
        data,
        width: '500px',
        disableClose: true,
      })
      .afterClosed();
  }
  okDialog(data: OkDialog): Observable<boolean> {
    return this.dialog
      .open(OkmessageComponent, {
        data,
        width: '500px',
        disableClose: true,
      })
      .afterClosed();
  }

  pendingDialog(): MatDialogRef<PendingComponent> {
    return this.dialog.open(PendingComponent, {
      width: '500px',
      disableClose: true,
    });
  }
}
