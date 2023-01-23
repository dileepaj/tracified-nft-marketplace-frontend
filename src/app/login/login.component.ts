import  jwt_decode  from 'jwt-decode';
import { AES } from 'crypto-js';
import { MarketPlaceAdminUser } from './../models/user';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/adminAuthService/admin-auth.service';
import { JwtServiceService } from '../services/adminAuthService/jwt-service.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { PopupMessageService } from '../services/snackbar-service/popup-message.service';
import { AdminUserLogin } from '../entity/AdminUser';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public newPassword = 'none';
  public loginForm: FormGroup;
  sKey = 'hackerkaidagalbanisbaby'.split('').reverse().join('');
  public userToken: string;
  public loading = false;
  public showPassword: boolean = false;
  public showPw = 'password'
  public hide = 'true'
  public inputText: boolean;
  public inputPassword: boolean;
  private email: string = '';
  private password: string = '';
  constructor(
    private router:Router,
    private _adminAuthService : AdminAuthService,
    private jwt:JwtServiceService,
    private snackBar : PopupMessageService,
    private mediaObserver: MediaObserver,
    private _location: Location,
    //private store: Store<AppState>,
    ) {}

    //reponsive UI
    mediaSub : Subscription;
    deviceXs:boolean;

  ngOnInit(): void {
    this.jwt.destroyToken();
    //for create responsive Ui
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.deviceXs = result.mqAlias === 'xs' ? true : false;
      }
    );
    this.loginForm = new FormGroup({
      username : new FormControl('',[
        Validators.required,
        Validators.email,
        Validators.minLength(6),
      ]),
      password : new FormControl('',[
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onDestroy() {
    //for create responsive Ui
    this.mediaSub.unsubscribe();
  }

  public onSubmit(){
    this.loading=true;
    const user:AdminUserLogin = new AdminUserLogin()
    if(this.loginForm.status=="VALID"){
      user.username = AES.encrypt(
        this.loginForm.value.username,
        this.sKey
      ).toString();
      user.password = AES.encrypt(
        this.loginForm.value.password,
        this.sKey
      ).toString();
      user.newPassword = AES.encrypt( //! NOT MANDATORY
        this.newPassword.toString(),
        this.sKey
      ).toString();
      this._adminAuthService.login(user).subscribe({
        complete:()=>{
          this.loading=false;
        },
        next:(data)=>{
          this.jwt.saveToken(data);
          let decoded:any = jwt_decode(data.Token,{header:false});
          let username = JSON.parse(sessionStorage.getItem('User') || '').UserName!;
          if (!!decoded.userID){
            this.router.navigate(['/admin-dashboard'],{
              queryParams:{data: JSON.stringify(username)}
            })
          }
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.openSnackBar('Valid username and password required');
        },
      });
    }else{
      this.loading = false;
      this.snackBar.openSnackBar('Valid username and password required');
    }
  }

  public togglePwdVisibility() {
    this.showPassword = !this.showPassword;
  }

  public back() {
    this._location.back();
  }
}
