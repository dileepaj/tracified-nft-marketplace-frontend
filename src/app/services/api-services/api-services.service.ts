import { Injectable } from '@angular/core';
import { SVG, TXN } from 'src/app/models/minting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  baseUrlSaveSvg: string = 'http://localhost:6081/api/svg/save';
  baseUrlSaveTxn: string = 'http://localhost:6081/api/txn/save';


  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  addSVG(st: SVG): Observable<SVG> {//request to add collection into the nft backend DB
    return this.http.post<SVG>(this.baseUrlSaveSvg, st, {headers: this.headers});
  }

  addTXN(st: TXN): Observable<TXN> {//request to add collection into the nft backend DB
    console.log("txn service",TXN)
    return this.http.post<TXN>(this.baseUrlSaveTxn, st, {headers: this.headers});
  }
}
