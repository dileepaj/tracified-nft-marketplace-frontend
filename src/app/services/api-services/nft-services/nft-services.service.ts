import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NFTMarket } from 'src/app/models/nft';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NftServicesService {
  baseUrlGetNFT: string = 'http://localhost:9080/lastnft';

  constructor(private http: HttpClient) { }

  getNFTDetails(Identifier:string): Observable<NFTMarket[]> {
    //request to get collection name according to user public key
    console.log("inside the service ---------------------------",Identifier)
    return this.http.get<NFTMarket[]>(`${this.baseUrlGetNFT}/${Identifier}`);
  }
}
