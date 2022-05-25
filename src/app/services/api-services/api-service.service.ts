import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TXN } from 'src/app/models/minting';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  baseUrlSaveTxn: string = 'http://localhost:6081/api/txn/save';


  readonly headers = new HttpHeaders()

  constructor(private http: HttpClient) { }

  addTXN(st: TXN): Observable<TXN> {//request to add collection into the nft backend DB
    console.log("txn service",TXN)
    return this.http.post<TXN>(this.baseUrlSaveTxn, st, {headers: this.headers});
  }
}
