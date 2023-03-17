import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserFAQ } from 'src/app/models/userFAQ';
import CryptoJS from 'crypto-js';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { UserFAQService } from 'src/app/services/userFAQService/user-faq.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { Location } from '@angular/common';
import {
  ConfirmDialogText,
  OkDialogText,
  PendingDialogText,
  SnackBarText,
} from 'src/app/models/confirmDialog';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement>;
  public controlGroup: FormGroup;
  file: File;
  name: string = '';
  userFAQ: UserFAQ = new UserFAQ('', '', '', '', '', '', '', '');
  public email: string;
  base64: string = '';
  img: any = '';
  Encoded: string;
  hash: any;
  binaryString: any;
  base64textString: string | any;
  selectedTab: number = 1;
  constructor(
    private apiService: UserFAQService,
    private dialogService: DialogService,
    private snackbarService: SnackbarServiceService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      Email: new FormControl(this.userFAQ.usermail, [
        Validators.email,
        Validators.required,
      ]),
      Category: new FormControl(this.userFAQ.category, Validators.required),
      Subject: new FormControl(this.userFAQ.subject, Validators.required),
      Description: new FormControl(this.userFAQ.desc, Validators.required),
      attachment: new FormControl(this.userFAQ.attached, Validators.required),
    });
  }

  public back() {
    this._location.back();
  }

  //trigger file input click event
  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }

  public saveUserFAQ() {
    this.userFAQ.usermail = this.formValue('Email');
    this.userFAQ.category = this.formValue('Category');
    this.userFAQ.subject = this.formValue('Subject');
    this.userFAQ.desc = this.formValue('Description');
    this.userFAQ.status = 'Pending';
    this.userFAQ.attached = this.base64textString;

    if (
      this.userFAQ.usermail == '' ||
      this.userFAQ.category == '' ||
      this.userFAQ.subject == '' ||
      this.userFAQ.desc == ''
    ) {
      this.snackbarService.openSnackBar(
        SnackBarText.CONTACT_US_FIELDS_EMPTY_WARNING,
        'info'
      );
    } else {
      this.dialogService
        .confirmDialog({
          title: ConfirmDialogText.USER_FAQ_TITLE,
          message: ConfirmDialogText.USER_FAQ_TITLE,
          confirmText: ConfirmDialogText.CONFIRM_BTN,
          cancelText: ConfirmDialogText.CANCEL_BTN,
        })
        .subscribe((res) => {
          if (res) {
            const dialog = this.dialogService.pendingDialog({
              message: PendingDialogText.CONTACT_US_SUBMITTING,
            });
            this.apiService.addUserFAQ(this.userFAQ).subscribe((res) => {});
            dialog.close();
            this.dialogService
              .okDialog({
                title: OkDialogText.USER_FAQ_SUBMITTED_TITLE,
                message: OkDialogText.USER_FAQ_SUBMITTED_Message,
                confirmText: OkDialogText.OKAY_BTN,
              })
              .subscribe((res) => {
                this._location.back();
              });
          }
        });
    }
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.target.id === 'cntct-dnd' || evt.target.id === 'cntct-dnd-label') {
      let files = evt.dataTransfer.files;
      const el = this.fileUpload.nativeElement;
      el.files = files;
      el.dispatchEvent(new Event('change'));
    }
  }
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  public onChange(event: any) {
    this.file = event.target.files[0];
    this.name = this.file.name;
    this.compressImage();
  }

  public changeTab(index: number) {
    this.selectedTab = index;
  }

  public removeFile() {
    //this.file = new File();
    this.name = '';
    this.base64textString = '';
  }

  private compressImage() {
    const img = new Image();
    img.src = URL.createObjectURL(this.file);

    img.onload = async () => {
      this.resize(img, 'jpeg').then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onloadend = () => {
          var base64data = reader.result;
          this.base64textString = base64data;
        };
      });
    };
  }

  //Used for compressing images
  private async resize(img, type = 'jpeg') {
    const MAX_WIDTH = 500;
    const MAX_HEIGHT = 500;
    const MAX_SIZE = 73000;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    ctx!.drawImage(img, 0, 0);

    let width = img.width;
    let height = img.height;
    let start = 0;
    let end = 1;
    let last, accepted, blob;

    // keep portration
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;

    ctx!.drawImage(img, 0, 0, width, height);

    accepted = blob = await new Promise((rs) =>
      canvas.toBlob(rs, 'image/' + type, 1)
    );

    if (blob.size < MAX_SIZE) {
      return blob;
    }

    // Binary search for the right size
    while (true) {
      const mid = Math.round(((start + end) / 2) * 100) / 100;
      if (mid === last) break;
      last = mid;
      blob = await new Promise((rs) => canvas.toBlob(rs, 'image/' + type, mid));

      if (blob.size > MAX_SIZE) {
        end = mid;
      }
      if (blob.size < MAX_SIZE) {
        start = mid;
        accepted = blob;
      }
    }

    return accepted;
  }
}
