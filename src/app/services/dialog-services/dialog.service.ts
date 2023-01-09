import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CreateCollectionComponent } from 'src/app/collections/create-collection/create-collection.component';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { OkmessageComponent } from 'src/app/dialogs/okmessage/okmessage.component';
import { PreviewImageComponent } from 'src/app/dialogs/previewImage/preview-image/preview-image.component';
import {
  ConfirmDialog,
  OkDialog,
  PendingDialog,
  PreviewImage,
  selectWalletDialog,
} from 'src/app/models/confirmDialog';
import { PendingComponent } from 'src/app/dialogs/pending/pending.component';
import { DisclaimerComponent } from 'src/app/dialogs/disclaimer/disclaimer.component';
import { NftPreviewComponent } from 'src/app/dialogs/nft-preview/nft-preview.component';
import { CodeviewComponent } from 'src/app/nft/codeview/codeview.component';
import { SelectWalletComponent } from 'src/app/dialogs/select-wallet/select-wallet.component';
import { MintPopupComponent } from 'src/app/nft/mint-popup/mint-popup.component';
import { ConfirmMintComponent } from 'src/app/dialogs/confirm-mint/confirm-mint.component';
import { MintingComponent } from 'src/app/dialogs/minting/minting.component';
import { SellNftConfirmationComponent } from 'src/app/dialogs/sell-nft-confirmation/sell-nft-confirmation.component';

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

  confirmMintDialog(data: ConfirmDialog): Observable<boolean> {
    return this.dialog
      .open(ConfirmMintComponent, {
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

  pendingDialog(data: PendingDialog): MatDialogRef<PendingComponent> {
    return this.dialog.open(PendingComponent, {
      data,
      width: '500px',
      disableClose: true,
    });
  }

  mintingDialog(data: PendingDialog): MatDialogRef<PendingComponent> {
    return this.dialog.open(MintingComponent, {
      data,
      width: '500px',
      disableClose: true,
    });
  }

  sellNftConfirmation(data: any): Observable<boolean> {
    return this.dialog
      .open(SellNftConfirmationComponent, {
        data,
        width: '500px',
        disableClose: true,
      })
      .afterClosed();
  }

  previewImage(data: PreviewImage): Observable<boolean> {
    return this.dialog
      .open(PreviewImageComponent, {
        data,
        width: '100%',
        disableClose: true,
      })
      .afterClosed();
  }

  createCollection(
    email: string,
    key: string
  ): MatDialogRef<CreateCollectionComponent> {
    return this.dialog.open(CreateCollectionComponent, {
      width: '500px',
      disableClose: true,
      data: {
        email: email,
        key: key,
      },
    });
  }

  selectWallet(data:selectWalletDialog)
  : Observable<string> {
    return this.dialog.open(SelectWalletComponent, {
      width: '500px',
      disableClose: true,
      data,
    }).afterClosed();
  }

  openDisclaimer(): Observable<boolean> {
    return this.dialog
      .open(DisclaimerComponent, {
        width: '800px',
        disableClose: true,
      })
      .afterClosed();
  }

  openNftPreview(data: PreviewImage): Observable<boolean> {
    return this.dialog
      .open(NftPreviewComponent, {
        data,
        width: '90%',
        maxWidth: '1000px',
        height: '80vh',
        maxHeight: '650px',
        disableClose: true,
      })
      .afterClosed();
  }

  openCodeView(imgSrc: any) {
    this.dialog.open(CodeviewComponent, {
      data: {
        imgSrc,
      },
      width: '90%',
      maxWidth: '1000px',
      height: '80vh',
      maxHeight: '650px',
    });
  }

  openMintAgain() : Observable<boolean> {
    return this.dialog
      .open(MintPopupComponent)
      .afterClosed();
  }

}
