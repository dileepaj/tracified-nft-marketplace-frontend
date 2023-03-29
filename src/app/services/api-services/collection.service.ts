import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from 'src/app/models/collection';
import { NFT } from 'src/app/models/minting';
import { Endorse } from 'src/app/models/endorse';
import { APIConfigENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly nftBackendBaseURL = APIConfigENV.nftbackendBaseURL;
  baseUrlSave: string = this.nftBackendBaseURL + 'collection/save';
  baseUrlGet: string = this.nftBackendBaseURL + 'collection/userpk';
  baseUrlGetCollection: string = this.nftBackendBaseURL + 'collection/user';
  baseUrlEndorsing: string = this.nftBackendBaseURL + 'endorsement';
  baseUrlNFT: string = this.nftBackendBaseURL + 'nftcollection';
  baseUrlCollection: string = this.nftBackendBaseURL + 'collection';

  readonly headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}

  getCollectionName(userId: string): Observable<Collection[]> {
    //request to get collection name according to user public key
    return this.http.get<Collection[]>(`${this.baseUrlGet}/${userId}`);
  }

  getCollectionPK(publickey: string): Observable<Collection[]> {
    //request to get collection name according to user public key
    return this.http.get<Collection[]>(
      `${this.baseUrlCollection}/${publickey}`
    );
  }

  add(st: Collection): Observable<Collection> {
    //request to add collection into the nft backend DB
    return this.http.post<Collection>(this.baseUrlSave, st, {
      headers: this.headers,
    });
  }
  getEndorsementByUserID(userId: string): Observable<Endorse[]> {
    //request to get collection name according to user public key
    return this.http.get<Endorse[]>(`${this.baseUrlEndorsing}/${userId}`);
  }

  getNFTByCollectionName(
    collection: string,
    blockchain: string,
    pageSize: number,
    pageIndex: number,
    publickey:number
  ): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http.get<NFT[]>(
      `${this.baseUrlNFT}/${blockchain}/${collection}/${publickey}/${pageSize}/${pageIndex}`
    );
  }

  getCollectionNameByMailAndPK(userId: string, publickey:string): Observable<Collection[]> {
    //request to get collection name according to user public key
    return this.http.get<Collection[]>(`${this.baseUrlGetCollection}/${userId}/${publickey}`);
  }
}
