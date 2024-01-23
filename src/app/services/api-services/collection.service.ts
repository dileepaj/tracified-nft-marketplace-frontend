import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from 'src/app/models/collection';
import { NFT } from 'src/app/models/minting';
import { Endorse } from 'src/app/models/endorse';
import { APIConfigENV } from 'src/environments/environment';
import { FileDetails } from 'src/app/models/fildedetails';

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
  sortBy: number = -1;

  readonly headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}

  getCollectionName(userId: string): Observable<Collection[]> {
    //request to get collection name according to user public key
    return this.http.get<Collection[]>(`${this.baseUrlGet}/${userId}`);
  }

  getCollectionPK(
    publickey: string,
    limit: number,
    pageIndex: number
  ): Observable<Collection[]> {
    //request to get collection name according to user public key
    return this.http.get<Collection[]>(
      `${this.baseUrlCollection}/${publickey}?limit=${limit}&page=${pageIndex}`
    );
  }

  add(collection: Collection, file: FileDetails): Observable<Collection> {
    const payload: any = {
      collectiondetails: collection,
      filedetails: file,
      filetype: 2,
    };
    //request to add collection into the nft backend DB
    return this.http.post<Collection>(this.baseUrlSave, payload, {
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
    publickey: number,
    nfttype: string
  ): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http.get<NFT[]>(
      `${this.baseUrlNFT}/${collection}?blockchain=${blockchain}&pubkey=${publickey}&limit=${pageSize}&page=${pageIndex}&nfttype=${nfttype}&sort=-1`
    );
  }

  getFilteredNFTsByCollection(
    collection: string,
    blockchain: string,
    pageSize: number,
    pageIndex: number,
    type: number
  ): Observable<NFT[]> {
    const bcFilter =
      blockchain === 'all' ? '' : 'blockchain=' + blockchain + '&';
    return this.http.get<NFT[]>(
      `${this.baseUrlNFT}/${collection}?${bcFilter}limit=${pageSize}&page=${pageIndex}&sort=-1&type=${type}`
    );
  }

  getAllNFTsByCollection(
    collection: string,
    blockchain: string,
    pageSize: number,
    pageIndex: number
  ): Observable<NFT[]> {
    const bcFilter =
      blockchain === 'all' ? '' : 'blockchain=' + blockchain + '&';
    return this.http.get<NFT[]>(
      `${this.baseUrlNFT}/${collection}?${bcFilter}limit=${pageSize}&page=${pageIndex}&nfttype=ON SALE&sort=-1`
    );
  }

  getCollectionNameByMailAndPK(
    userId: string,
    publickey: string
  ): Observable<Collection[]> {
    //request to get collection name according to user public key
    return this.http.get<Collection[]>(
      `${this.baseUrlGetCollection}/${userId}/${publickey}`
    );
  }

  getAllPublicCollections(
    pageSize: number,
    pageIndex: number
  ): Observable<Collection[]> {
    //request to get collection name according to user public key
    return this.http.get<Collection[]>(
      `${this.baseUrlCollection}?limit=${pageSize}&page=${pageIndex}&sort=${this.sortBy}`
    );
  }
}
