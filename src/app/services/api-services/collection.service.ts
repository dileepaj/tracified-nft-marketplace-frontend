import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Collection } from 'src/app/models/collection';
import { NFT } from 'src/app/models/minting';
import { Endorse } from 'src/app/models/endorse';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  baseUrlSave: string = 'http://localhost:6081/collection/save';
  baseUrlGet: string = 'http://localhost:6081/collection/userpk';
  baseUrlEndorsing: string = 'http://localhost:6081/endorsement';
  baseUrlNFT:string= 'http://localhost:6081/nftcollection';

  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  getCollectionName(userId:string): Observable<Collection[]> {//request to get collection name according to user public key
    return this.http.get<Collection[]>(`${this.baseUrlGet}/${userId}`);
  }

  add(st: Collection): Observable<Collection> {//request to add collection into the nft backend DB
    return this.http.post<Collection>(this.baseUrlSave, st, {headers: this.headers});
  }
  getEndorsementByUserID(userId:string): Observable<Endorse[]> {//request to get collection name according to user public key
    return this.http.get<Endorse[]>(`${this.baseUrlEndorsing}/${userId}`);
  }

  getNFTByCollectionName(collection:string): Observable<NFT[]> {//request to get collection name according to user public key
    return this.http.get<NFT[]>(`${this.baseUrlNFT}/${collection}`);
  }
 
}


