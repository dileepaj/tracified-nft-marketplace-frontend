import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { ConfirmDialog } from 'src/app/models/confirmDialog';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog:MatDialog) { }

  confirmDialog(data:ConfirmDialog):Observable<boolean>{
   return this.dialog.open(ConfirmComponent,{
      data,
      width:'500px',
      disableClose:true
    }).afterClosed();
  }
}
