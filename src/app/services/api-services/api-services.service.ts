import { Injectable } from '@angular/core';
import { SVG, TXN, UpdateSVG } from 'src/app/models/minting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { Endorse, UpdateEndorse, UpdateStatus } from 'src/app/models/endorse';
import { Partners } from 'src/app/models/admin';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  baseUrlSaveSvg: string = 'http://localhost:6081/api/svg/save';
  baseUrlSaveTxn: string = 'http://localhost:6081/api/txn/save';
  baseUrlUpdateSVGBC:string='http://localhost:6081/api/svg';
  baseUrlSaveFavs:string='http://localhost:6081/api/favourites/save';
  baseUrlSaveWatchlist:string='http://localhost:6081/api/watchlists/save';
  baseUrlGetFavs:string='http://localhost:6081/api/favourites';
  baseUrlGetWatchlist:string='http://localhost:6081/api/watchlists';
  baseUrlEndorse:string='http://localhost:6081/api/endorser/save';
  baseUrlEndorsement='http://localhost:6081/api/endorsement';
  baseUrlPartner='http://localhost:6081/partner/'
  baseUrlUpdateEndorse='http://localhost:6081/api/endorsementstatus';


  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  UpdatesvgResponseObservable: Observable<UpdateSVG>;
  constructor(private http: HttpClient) { }

  addSVG(st: SVG): Observable<SVG> {//request to add collection into the nft backend DB
    console.log("svg data to add",st)
    const svgToAdd = this.http.post<SVG>(this.baseUrlSaveSvg, st, {headers: this.headers});
    console.log("Add svg response:",svgToAdd.toString())
    return svgToAdd
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

  addToWatchList(st:WatchList):Observable<WatchList>{
    console.log("watchlist service",WatchList)
    return this.http.post<WatchList>(this.baseUrlSaveWatchlist, st, {headers: this.headers});
  }

  addToFavourites(st:Favourites):Observable<Favourites>{
    console.log("favourites service",Favourites)
    return this.http.post<Favourites>(this.baseUrlSaveFavs, st, {headers: this.headers});
  }

  getWatchLists(): Observable<WatchList[]> {
    //request to get collection name according to user public key
    return this.http.get<WatchList[]>(`${this.baseUrlGetWatchlist}`);
  }

  getWatchListByBlockchain(Blockchain:string): Observable<WatchList[]> {
    //request to get collection name according to user public key
    return this.http.get<WatchList[]>(`${this.baseUrlGetWatchlist}/${Blockchain}`);
  }

  getFavourites(): Observable<Favourites[]> {
    //request to get collection name according to user public key
    return this.http.get<Favourites[]>(`${this.baseUrlGetFavs}`);
  }

  getFavouritesByBlockchain(Blockchain:string): Observable<Favourites[]> {
    //request to get collection name according to user public key
    return this.http.get<Favourites[]>(`${this.baseUrlGetFavs}/${Blockchain}`);
  }

  getFavouritesByUserId(userId:string): Observable<Favourites[]> {
    //request to get collection name according to user public key
    return this.http.get<Favourites[]>(`${this.baseUrlGetFavs}/${userId}`);
  }

  getWatchListByUserId(userId:string): Observable<WatchList[]> {
    //request to get collection name according to user public key
    return this.http.get<WatchList[]>(`${this.baseUrlGetWatchlist}/${userId}`);
  }

  endorse(st: Endorse): Observable<Endorse> {//request to add collection into the nft backend DB
    console.log("endorse service",Endorse)
    return this.http.post<Endorse>(this.baseUrlEndorse, st, {headers: this.headers});
  }

  getEndorsement(userId:string): Observable<Endorse[]> {
    //request to get collection name according to user public key
    return this.http.get<Endorse[]>(`${this.baseUrlEndorsement}/${userId}`);
  }

  updateEndorsement(st:UpdateEndorse):Observable<UpdateEndorse>{
  return this.http.put<UpdateEndorse>(this.baseUrlEndorsement, st, { headers: this.headers }); 
  }

  registerPartner(st: Partners): Observable<Partners> {//request to add collection into the nft backend DB
    console.log("partner service",Partners)
    return this.http.post<Partners>(this.baseUrlPartner, st, {headers: this.headers});
  }

  updateEndorsementStatus(st:UpdateStatus):Observable<UpdateStatus>{
    return this.http.put<UpdateStatus>(this.baseUrlUpdateEndorse, st, { headers: this.headers }); 
    }

  getEndorsementByStatus(status:string): Observable<Endorse[]> {
      //request to get collection name according to user public key
      return this.http.get<Endorse[]>(`${this.baseUrlEndorsement}/${status}`);
    }
}
