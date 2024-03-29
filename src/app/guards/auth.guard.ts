import { PopupMessageService } from './../services/snackbar-service/popup-message.service';
import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot,
   CanActivate,
   Router,
   RouterStateSnapshot,
   UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminAuthService } from '../services/adminAuthService/admin-auth.service';
import { SnackbarServiceService } from '../services/snackbar-service/snackbar-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth:AdminAuthService,
    private router: Router,
    private snackBar:SnackbarServiceService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ):boolean{
    if(this.auth.isValidToken()){
      return this.auth.isValidToken()
    }else{
      this.snackBar.openSnackBar('The user session expired. Please login again', 'error');
      this.router.navigate([`/login`]);
      return false;
    }
  }
  
}
