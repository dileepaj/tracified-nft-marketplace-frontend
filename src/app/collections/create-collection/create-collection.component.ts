import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ConfirmDialogText,
  PendingDialogText,
  SnackBarText,
} from 'src/app/models/confirmDialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SHA256, enc } from 'crypto-js';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { FileDetails } from 'src/app/models/fildedetails';

export interface Blockchain {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-create-collection',
  providers: [CollectionService],
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css'],
})
export class CreateCollectionComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement>;
  @ViewChild('thumbDnd') thumbDnd: ElementRef<HTMLElement>;
  controlGroup: FormGroup;
  addSubscription: Subscription;
  selectVal: string = '';
  collection: Collection = new Collection('', '', '', '', '', '', true); //declaring the model
  fileDetails: FileDetails = new FileDetails('', '');
  signerPK: string = '';
  objectid: any;
  email: any;
  key: any;
  imageSrc: any;
  file: File;
  type: string;
  base64: string = '';
  Encoded: string;
  hash: any;
  img: any = '';
  onHover: boolean = false;
  cropperStat: boolean = false;
  imageChangedEvent: any = '';
  showthumbnailContainer: boolean = true;
  croppedImage: any = '';

  constructor(
    public service: CollectionService,
    private _location: Location,
    private router: Router,
    private dialogService: DialogService,
    private snackbarService: SnackbarServiceService,
    private dialogRef: MatDialogRef<CreateCollectionComponent>,
    private _sanitizer: DomSanitizer,
    private snackbar: SnackbarServiceService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async save(): Promise<void> {
    //getting form data and sending it to the collection service to post
    //getting form data and equalling it to to model variables

    if (this.croppedImage === '') {
      this.snackbarService.openSnackBar(
        SnackBarText.PLEASE_UPLOAD_A_THUMBNAIL,
        'error'
      );
      return;
    } else if (
      this.formValue('collectionName') === '' ||
      this.formValue('organizationName') === ''
    ) {
      this.snackbarService.openSnackBar(
        SnackBarText.CONTACT_US_FIELDS_EMPTY_WARNING,
        'error'
      );
      return;
    }

    this.collection.CollectionName = this.formValue('collectionName');
    this.collection.OrganizationName = this.formValue('organizationName');
    this.collection.Blockchain = 'any';
    this.collection.UserId = this.objectid;
    this.collection.Publickey = this.key;
    this.collection.isPublic = this.formValue('ispublic');

    this.collection.Timestamp = new Date().toISOString();
    this.fileDetails.FileName = this.file.name;
    this.fileDetails.FileContent = this.croppedImage;

    this.dialogService
      .confirmDialog({
        title: ConfirmDialogText.CREATE_COLLECTION_TITLE,
        message:
          ConfirmDialogText.CREATE_COLLECTION_MESSAGE_P1 +
          this.collection.CollectionName +
          ConfirmDialogText.CREATE_COLLECTION_MESSAGE_P2,
        confirmText: ConfirmDialogText.CONFIRM_BTN,
        cancelText: ConfirmDialogText.CANCEL_BTN,
      })
      .subscribe((result) => {
        if (result) {
          this.dialogRef.close({
            UserId: this.collection.UserId,
            OrganizationName: this.collection.OrganizationName,
            CollectionName: this.collection.CollectionName,
            RequestPayload: {
              Collection: this.collection,
              FileDetails: this.fileDetails,
            },
          });
          //sending data to the service
          /* const pendingDialog = this.dialogService.pendingDialog({
            message: PendingDialogText.PLEASE_WAIT,
          });
          this.addSubscription = this.service
            .add(this.collection, this.fileDetails)
            .subscribe((res) => {
              if (res != null || res != '') {
                pendingDialog.close();
                this.snackbarService.openSnackBar(
                  this.collection.CollectionName +
                    SnackBarText.CREATE_COLLECTION_SUCCESS_MESSAGE,
                  'success'
                );
                this.selectVal = this.collection.CollectionName;
                this.dialogRef.close({
                  UserId: this.collection.UserId,
                  OrganizationName: this.collection.OrganizationName,
                  CollectionName: this.collection.CollectionName,
                });
              } else {
                pendingDialog.close();
                this.snackbarService.openSnackBar(
                  SnackBarText.CREATE_COLLECTION_FAILED_MESSAGE,
                  'error'
                );
              }
            }); */
        }
      });
  }

  done() {
    this.router.navigate(['./mint'], {
      queryParams: { data: JSON.stringify(this.collection.UserId) },
    });
  }

  ngOnInit(): void {
    this.objectid = this.data.objectid;
    this.key = this.data.key;
    this.email = this.data.email;
    this.controlGroup = new FormGroup({
      objectId: new FormControl(this.collection.UserId, Validators.required),
      collectionName: new FormControl(
        this.collection.CollectionName,
        Validators.required
      ),
      organizationName: new FormControl(
        this.collection.OrganizationName,
        Validators.required
      ),
      ispublic: new FormControl(this.collection.isPublic, Validators.required),
    });
  }

  //initializing input in html to formValue function
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  public resetValues() {
    this.controlGroup.reset();
  }

  public back() {
    this._location.back();
  }

  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }

  public onChange(event: any) {
    if (event.target.files[0].size <= 1 * 1024 * 1024) {
      this.file = event.target.files[0];
      if (
        this.file.type.toLowerCase().includes('png') ||
        this.file.type.toLowerCase().includes('jpg') ||
        this.file.type.toLowerCase().includes('jpeg')
      ) {
        this.imageChangedEvent = event;
        this.cropperStat = true;
        this.showthumbnailContainer = false;
      } else {
        this.snackbar.openSnackBar('The file type is not supported', 'error');
      }
    } else {
      this.snackbar.openSnackBar(
        'Maximum file size for thumbnail is 1 MB',
        'error'
      );
    }
  }

  //update html
  public updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.img = reader.result;
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.img);
    };
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onHover = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onHover = false;
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onHover = false;
    if (this.thumbDnd.nativeElement.contains(evt.target)) {
      let files = evt.dataTransfer.files;
      let valid_files: Array<File> = files;
      if (valid_files[0].size <= 1 * 1024 * 1024) {
        this.file = valid_files[0];
        if (
          this.file.type.toLowerCase().includes('png') ||
          this.file.type.toLowerCase().includes('jpg') ||
          this.file.type.toLowerCase().includes('jpeg')
        ) {
          const el = this.fileUpload.nativeElement;
          el.files = files;
          el.dispatchEvent(new Event('change'));
        } else {
          this.snackbar.openSnackBar('The file type is not supported', 'error');
        }
      } else {
        this.snackbar.openSnackBar(
          'Maximum file size for NFT is 1 MB',
          'error'
        );
      }
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageSrc = this.croppedImage;
    //this.updateHTML();
    this.img = this.croppedImage;
  }
  hideCropper() {
    this.cropperStat = false;
    this.showthumbnailContainer = true;
  }
  imageLoaded(image?: LoadedImage) {}
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
