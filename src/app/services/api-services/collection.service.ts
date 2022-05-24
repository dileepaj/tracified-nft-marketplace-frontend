import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Collection } from 'src/app/models/collection';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  baseUrlSave: string = 'http://localhost:6081/api/collection/save';
  baseUrlGet: string = 'http://localhost:6081/api/collection/userpk';


  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  getCollectionName(userId:string): Observable<Collection[]> {//request to get collection name according to user public key
    return this.http.get<Collection[]>(`${this.baseUrlGet}/${userId}`);
  }

  add(st: Collection): Observable<Collection> {//request to add collection into the nft backend DB
    return this.http.post<Collection>(this.baseUrlSave, st, {headers: this.headers});
  }

 
}


