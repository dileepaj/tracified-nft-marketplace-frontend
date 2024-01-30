import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateEndorse, UpdateEndorseNoImage } from 'src/app/models/endorse';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { Location } from '@angular/common';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { ConfirmDialogText } from 'src/app/models/confirmDialog';
import { PubkeyvalidatorService } from 'src/app/services/common/pubkeyvalidator.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  endorse: UpdateEndorse = new UpdateEndorse('', '', '', '', '');
  endorseNoImage: UpdateEndorseNoImage = new UpdateEndorseNoImage(
    '',
    '',
    '',
    ''
  );
  file: File;
  base64: string = '';
  img: any = '';
  controlGroupProfile: FormGroup;
  controlGroupEmail: FormGroup;
  controlGroupPassword: FormGroup;
  data: any;
  image: string;
  currentImage: string;
  EndorseList: any;
  displayName: string;
  loading: boolean = false;
  constructor(
    private router: Router,
    private dialogService: DialogService,
    private _location: Location,
    private route: ActivatedRoute,
    private service: ApiServicesService,
    private snackbarSrevice: SnackbarServiceService,
    private pubkeyveirfy: PubkeyvalidatorService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      let pkBlockchain = params['blockchain'];
      if (params['blockchain'] === 'jpy') {
        pkBlockchain = 'solana';
      }
      this.data = await this.pubkeyveirfy.GetActivePubKey(
        params['user'],
        pkBlockchain
      );
      this.loading = true;
      this.service.getEndorsement(this.data).subscribe((res: any) => {
        this.EndorseList = res;
        this.currentImage = res.profilepic;
        this.image = '';
        this.endorse.Name = res.Name;
        this.displayName = res.Name;
        this.endorse.Contact = res.Contact;
        this.endorse.Email = res.Email;
        this.loading = false;
      });
    });
    this.controlGroupProfile = new FormGroup({
      name: new FormControl(this.endorse.Name, [Validators.required]),
      contact: new FormControl(this.endorse.Contact, [Validators.required]),
      mail: new FormControl(this.endorse.Email, [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  public back() {
    this._location.back();
  }

  public saveProfile() {
    if (this.controlGroupProfile.get('name')!.value != '') {
      this.endorse.Name = this.controlGroupProfile.get('name')!.value;
    }
    if (this.controlGroupProfile.get('contact')!.value != '') {
      this.endorse.Contact = this.controlGroupProfile.get('contact')!.value;
      const contactRegex = /^\+?[0-9]+$/;
      if (!contactRegex.test(this.endorse.Contact)) {
        this.snackbarSrevice.openSnackBar(
          'Contact number can only contain numeric values!',
          'info'
        );
        return;
      }
    }
    if (this.controlGroupProfile.get('mail')!.value != '') {
      this.endorse.Email = this.controlGroupProfile.get('mail')!.value;
    }
    this.endorse.PublicKey = this.data;
    if (this.image != '') {
      this.endorse.profilepic = this.image;
    } else {
      this.endorse.profilepic = this.currentImage;
    }

    this.service
      .getEndorsement(this.endorse.PublicKey)
      .subscribe((res: any) => {
        if (res.Status == 'Accepted') {
          this.service.updateEndorsement(this.endorse).subscribe((res) => {
            this.snackbarSrevice.openSnackBar(
              'Profile has been updated successfully',
              'success'
            );
            this.router.navigate(['./']);
          });
        } else if (
          res.Status == null ||
          res.Status == 'Declined' ||
          res.Status == ''
        ) {
          this.dialogService
            .confirmDialog({
              title: ConfirmDialogText.PROFILE_ENDORSMENT_TITLE,
              message: ConfirmDialogText.PROFILE_ENDORSMENT_MESSAGE,
              confirmText: ConfirmDialogText.CONFIRM_BTN,
              cancelText: ConfirmDialogText.CANCEL_BTN,
            })
            .subscribe((res) => {
              if (res) {
                this.router.navigate(['./mint']);
              }
            });
        } else if (res.Status == 'Pending') {
          this.dialogService.okDialog({
            title: 'Endorsement in Pending',
            message:
              'Please be informed that your endorsement request has been sent to Tracified and will be reviewed within 48 hours after submission',
            confirmText: ConfirmDialogText.CONFIRM_BTN,
          });
        }
      });
  }

  public onChange(event: any) {
    this.file = event.target.files[0];
    this.uploadImage(event);
  }

  //called when user uploads an image
  public uploadImage(event: Event) {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.file);
  }

  //create base64 image
  private _handleReaderLoaded(readerEvt: any) {
    this.base64 = readerEvt.target.result;
    this.image = this.base64;
    this.updateHTML();
  }

  //update html
  public updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.img = reader.result;
    };
  }

  //trigger file input click event
  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }
}
