import { JwtServiceService } from './../adminAuthService/jwt-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAPIServiceService {
  constructor(private http: HttpClient, private jwt: JwtServiceService) { }
  private api_url: String = '';
  private auth_token = this.jwt.getToken() || '';
  private sToken = 'Bearer ' + this.auth_token;

  /**
   * @function setHeaders - set headers for an API request
   * @param none
   */
   private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.sToken.toString(),
    };

    return new HttpHeaders(headersConfig);
  }

  //GET request
  public get(path: string): Observable<any> {
    this.auth_token = this.jwt.getToken();
    this.sToken = 'Bearer ' + this.auth_token;
    return this.http.get(`${this.api_url}${path}`, {
      headers: this.setHeaders(),
    });
  }

  public post(path: string, body: any): Observable<any> {
    this.auth_token = this.jwt.getToken();
    this.sToken = 'Bearer ' + this.auth_token;
    return this.http.post(`${this.api_url}${path}`, body, {
      headers: this.setHeaders(),
    });
  }
}

