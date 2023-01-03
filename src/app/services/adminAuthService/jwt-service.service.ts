import { adminENV } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Key } from 'src/app/entity/Variables';
import{CookieService} from 'ngx-cookie-service'
import { AES, enc } from 'crypto-js';
import { MarketPlaceAdminUser } from 'src/app/models/user';
import jwt_decode from 'jwt-decode';
import * as MomentAll from 'moment';
@Injectable({
  providedIn: 'root'
})
export class JwtServiceService {
  private tokenName:string;
  private expName:string;
  private domain: string;
  private key = new Key()
  constructor(private _cookieService:CookieService) { 
    if(adminENV.name == 'Production'){
      this.tokenName = 'PTOKENCOMNFTMK';
      this.expName = 'PWAITCOMNFTMK';
    }else if (adminENV.name == 'staging') {
      this.tokenName = 'STOKENCOMNFTMK';
      this.expName = 'SWAITCOMNFTMK';
    } else if (adminENV.name == 'qa') {
      this.tokenName = 'QATOKENCOMNFTMK';
      this.expName = 'QWAITCOMNFTMMK';
    }
    this.domain = adminENV.domain;
  }

  public getToken(): string {
    if (!this._cookieService.check(this.tokenName)) {
      return '';
    } else {
      return AES.decrypt(
        this._cookieService.get(this.tokenName),
        this.key.key
      ).toString(enc.Utf8);
    }
  }

  public isEmpty(): boolean {
    if (this._cookieService.check(this.tokenName)) {
      return false;
    } else {
      return true;
    }
  }


  public saveToken(data: any) {
    let decoded: any = jwt_decode(data.Token, { header: false });
    this.setExp(decoded.exp);
    const expireDate = MomentAll().add(1, 'd').toDate();
    this._cookieService.set(
      this.tokenName,
      AES.encrypt(data.Token, this.key.key).toString(),
      expireDate,
      '/',
      this.domain
    );
    let user1: MarketPlaceAdminUser = {
      UserID: decoded.userID,
      UserName: decoded.username,
      Email: decoded.email,
      TenentId: decoded.tenantID,
      displayImage: decoded.displayImage,
      Company: decoded.company,
      Type: decoded.type,
      Country: decoded.locale,
      Domain: decoded.domain,
    };
    sessionStorage.setItem('User', JSON.stringify(user1));
  }

  public destroyToken() {
    const expireDate = MomentAll().add(0, 's').toDate();
    this._cookieService.set(this.tokenName, '', expireDate, '/', this.domain);
    this._cookieService.set(this.expName, '', expireDate, '/', this.domain);
  }


  public setExp(exp: string) {
    const expirehours = MomentAll().add(1, 'd').toDate();
    this._cookieService.set(
      this.expName,
      AES.encrypt(exp.toString(), this.key.key).toString(),
      expirehours,
      '/',
      this.domain
    );
  }

  public getExp(): any {
    if (this._cookieService.check(this.expName)) {
      return AES.decrypt(this._cookieService.get(this.expName), this.key.key)
        .toString(enc.Utf8)
        .toString();
    } else {
      return '00000';
    }
  }
}
