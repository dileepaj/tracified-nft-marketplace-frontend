import { Injectable } from '@angular/core';
import { StellarCommonsService } from './stellar-commons.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StellarUtilService {
  networkBaseURL = ENV.BLOCKCHAIN_NETWORK;
  networkURL = `${this.networkBaseURL}/accounts`;
  constructor(
    private network: StellarCommonsService,
    private http: HttpClient
  ) {}

  /**
   * @function setHeaders - set headers for an API request
   * @param none
   */
  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return new HttpHeaders(headersConfig);
  }

  getStellarAccountStatus(publicKey: string): Observable<any> {
    return this.http.get(`${this.networkURL}/${publicKey}`, {
      headers: this.setHeaders(),
    });
  }

  isAssetAvailableAccount(assetList: any, assetName: string) {
    for (const item of assetList) {
      if (item.asset_code === assetName && parseFloat(item.balance) > 0) {
        return true;
      }
    }
    return false;
  }
}
