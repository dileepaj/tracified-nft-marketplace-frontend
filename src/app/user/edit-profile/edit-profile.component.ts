import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  showPassword: boolean = false;
  showConfPassword: boolean = false;
  file: File;
  base64: string = '';
  img: any = '';
  profile: any = {
    name: '',
    image: '',
  };
  email: any = {
    newEmail: '',
    confirmEmail: '',
  };
  password: any = {
    newPassword: '',
    confirmPassword: '',
  };
  controlGroupProfile: FormGroup;
  controlGroupEmail: FormGroup;
  controlGroupPassword: FormGroup;
  constructor() {}

  ngOnInit(): void {
    this.controlGroupProfile = new FormGroup({
      name: new FormControl(this.profile.name, Validators.required),
    });
    this.controlGroupEmail = new FormGroup({
      newEmail: new FormControl(this.email.newEmail, Validators.required),
      confirmEmail: new FormControl(
        this.email.confirmEmail,
        Validators.required
      ),
    });
    this.controlGroupPassword = new FormGroup({
      newPassword: new FormControl(
        this.password.newPassword,
        Validators.required
      ),
      confirmPassword: new FormControl(
        this.password.confirmPassword,
        Validators.required
      ),
    });
  }

  public saveProfile() {
    this.profile.name = this.controlGroupProfile.get('name')!.value;
    this.profile.image = this.base64;
    console.log(this.profile);
  }

  public saveEmail() {
    this.email.newEmail = this.controlGroupEmail.get('newEmail')!.value;
    this.email.confirmEmail = this.controlGroupEmail.get('confirmEmail')!.value;
    console.log(this.email);
  }

  public savePassword() {
    this.password.newPassword =
      this.controlGroupPassword.get('newPassword')!.value;
    this.password.confirmPassword =
      this.controlGroupPassword.get('confirmPassword')!.value;
    console.log(this.password);
  }

  public togglePwdVisibility() {
    this.showPassword = !this.showPassword;
  }

  public toggleConfPwdVisibility() {
    this.showConfPassword = !this.showConfPassword;
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
    this.profile.image = this.base64;
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
