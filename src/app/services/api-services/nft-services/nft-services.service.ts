import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuyNFTGW, GetNFT, NFTMarket, SalesBE, SalesGW } from 'src/app/models/nft';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { SVG } from 'src/app/models/minting';

@Injectable({
  providedIn: 'root'
})
export class NftServicesService {
  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  baseUrlGetLastNFT: string = 'http://localhost:9080/lastnft';
  baseUrlGetNFT:string='http://localhost:6081/api/buying'
  baseUrlUpdateStatusBE:string='http://localhost:6081/api/nft/sale';
  baseUrlUpdateStatusGW:string='http://localhost:9080';
  baseUrlSVG:string='http://localhost:6081/api/svg';
  

  constructor(private http: HttpClient) { }

  getLastNFTDetails(InitialDistributorPK:string): Observable<NFTMarket[]> {
    //request to get collection name according to user public key
    console.log("inside the service ---------------------------",InitialDistributorPK)
    return this.http.get<NFTMarket[]>(`${this.baseUrlGetLastNFT}/${InitialDistributorPK}`);
  }

  getSVGByHash(Hash:string): Observable<SVG[]> {
    //request to get collection name according to user public key
    console.log("inside the service ---------------------------",Hash)
    return this.http.get<SVG[]>(`${this.baseUrlSVG}/${Hash}`);
  }

  getNFTDetails(NFTIdentifier:string,SellingStatus:string,Blockchain:string): Observable<GetNFT[]> {
    //request to get collection name according to user public key
    console.log("inside the service ---------------------------",NFTIdentifier,SellingStatus,Blockchain)
    console.log("--------------",`${this.baseUrlGetNFT}/${SellingStatus}/${NFTIdentifier}/${Blockchain}`)
    return this.http.get<GetNFT[]>(`${this.baseUrlGetNFT}/${SellingStatus}/${NFTIdentifier}/${Blockchain}`);
  }


  updateNFTStatusBackend(st: SalesBE): Observable<SalesBE> {
    console.log("---------------------------------------in service for be-----------------",st)
    return this.http.put<SalesBE>(this.baseUrlUpdateStatusBE, st, {headers: this.headers});
  }

  updateNFTStatusGateway(price:string,status:string,amount:string,nfttxnhash:string): Observable<any> {
    console.log("---------------------------------------in service for gw-----------------",price,status,amount,nfttxnhash)
   
    return this.http.put<any>(this.baseUrlUpdateStatusGW
      + `/nft/updateStellarMarketplaceSell?Price=${price}&Status=${status}&Amount=${amount}&NFTTxnHash=${nfttxnhash}`,
      {headers: this.headers});
  }

  updateNFTBuyStatusGateway(sellingStatus:string,currentPK:string,previousPK:string,nfthash:string): Observable<BuyNFTGW> {
    console.log("Inside gateway service",sellingStatus,currentPK,previousPK,nfthash)
    return this.http.put<any>(this.baseUrlUpdateStatusGW
      + `/nft/updateStellarMarketplaceBuy?sellingStatus=${sellingStatus}&currentPK=${currentPK}&previousPK=${previousPK}&nfthash=${nfthash}`,
      {headers: this.headers});
  }
}
