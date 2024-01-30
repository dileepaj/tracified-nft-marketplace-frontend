import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {

  constructor(private http:HttpClient) { }

  GetUSDratebyBC(blockchain: string): Observable<any> {
    //request to get collection name according to user public key
    return this.http.get<any>(`https://api.coincap.io/v2/assets/${blockchain}`);
  }

  GetUSDratebyFiat(currency: string): Observable<any> {
    //request to get collection name according to user public key
    return this.http.get<any>(`https://api.coincap.io/v2/rates/${currency}`);
  }
}
