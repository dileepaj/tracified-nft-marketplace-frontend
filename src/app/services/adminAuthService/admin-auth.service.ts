import { adminENV } from './../../../environments/environment.qa';
import { Injectable } from '@angular/core';
import { JwtServiceService } from './jwt-service.service';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { AdminAPIServiceService } from '../api-services/admin-apiservice.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private admin:any;
  constructor(
    private jwt : JwtServiceService,
    private apiService: AdminAPIServiceService,
  ) { 
    this.admin = adminENV.adminUrl
  }

  public isValidToken(): boolean {
    if (!this.jwt.isEmpty() && !(Date.now() >= Number(this.jwt.getExp()) * 1000)) {
      let decoded: any = jwt_decode(this.jwt.getToken(), { header: false });
      if (
        !!decoded.permissions &&
        !!decoded.permissions[0] &&
        !!decoded.tenantID &&
        !!decoded.username &&
        decoded.permissions[0].includes('97')
      )
        return true;
      else {
        return false;
      }
    } else {
      return false;
    }
  }


  public login(credentials: any): Observable<any> {
    console.log("Credential: ",credentials)
    return this.apiService.post(this.admin + '/sign/login', {
      user: credentials,
    });
  }
}



