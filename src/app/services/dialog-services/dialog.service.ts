import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { OkmessageComponent } from 'src/app/dialogs/okmessage/okmessage.component';
import { PreviewImageComponent } from 'src/app/dialogs/previewImage/preview-image/preview-image.component';
import { ConfirmDialog, OkDialog, PreviewImage } from 'src/app/models/confirmDialog';
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
  okDialog(data:OkDialog):Observable<boolean>{
    return this.dialog.open(OkmessageComponent,{
      data,
      width:'500px',
      disableClose:true,
    }).afterClosed();
  }
  previewImage(data:PreviewImage):Observable<boolean>{
    console.log("image data:",data.image)
    return this.dialog.open(PreviewImageComponent,{
      data,
      width:'100%',
      disableClose:true,
    }).afterClosed();
  }
}
