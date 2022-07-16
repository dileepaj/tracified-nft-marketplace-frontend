import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  controlGroup: FormGroup;
  private email: string = '';
  private password: string = '';
  constructor(private _location: Location) {}

  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      email: new FormControl(this.email, Validators.required),
      password: new FormControl(this.password, Validators.required),
    });
  }

  public togglePwdVisibility() {
    this.showPassword = !this.showPassword;
  }

  public back() {
    this._location.back();
  }
}
