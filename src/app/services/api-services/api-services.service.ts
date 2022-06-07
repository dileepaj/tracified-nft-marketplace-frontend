import { Injectable } from '@angular/core';
import { SVG, TXN, UpdateSVG } from 'src/app/models/minting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  baseUrlSaveSvg: string = 'http://localhost:6081/api/svg/save';
  baseUrlSaveTxn: string = 'http://localhost:6081/api/txn/save';
  baseUrlUpdateSVGBC:string='http://localhost:6081/api/svg'

  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  UpdatesvgResponseObservable: Observable<UpdateSVG>;
  constructor(private http: HttpClient) { }

  addSVG(st: SVG): Observable<SVG> {//request to add collection into the nft backend DB
    return this.http.post<SVG>(this.baseUrlSaveSvg, st, {headers: this.headers});
  }

  updateSVGBlockchain(st:UpdateSVG):Observable<UpdateSVG>{
    console.log("update data sent: ",st)
    this.UpdatesvgResponseObservable= this.http.put<UpdateSVG>(this.baseUrlUpdateSVGBC, st, {headers: this.headers})
    this.UpdatesvgResponseObservable.subscribe(res=>{
      console.log("res : ",res)
    })
    return this.UpdatesvgResponseObservable
  }

  addTXN(st: TXN): Observable<TXN> {//request to add collection into the nft backend DB
    console.log("txn service",TXN)
    return this.http.post<TXN>(this.baseUrlSaveTxn, st, {headers: this.headers});
  }
}
