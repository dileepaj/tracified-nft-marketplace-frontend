import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuyNFTGW, GetNFT, NFTMarket, SalesBE, SalesGW } from 'src/app/models/nft';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { NFT, SVG, TXN } from 'src/app/models/minting';

@Injectable({
  providedIn: 'root'
})
export class NftServicesService {
  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  baseUrlGetLastNFT: string = 'http://localhost:9080/lastnft';
  baseUrlGetNFT:string='http://localhost:6081/buying'
  baseUrlUpdateStatusBE:string='http://localhost:6081/nft/sale';
  baseUrlUpdateStatusGW:string='http://localhost:9080';
  baseUrlSVG:string='http://localhost:6081/svg';
  baseUrlGetAllNFT:string='http://localhost:6081/marketplace';
  baseUrlGetOnSaleNFT:string='http://localhost:6081/nft';
  baseUrlGetMyNFTByStatus:string='http://localhost:6081/selling'
  baseUrlGetMyNFT:string='http://localhost:6081/userid'
  baseUrlfilter:string='http://localhost:6081/blockchain'
  baseUrlTxn:string='http://localhost:6081/txn'
  baseUrlPaginated : string = 'http://localhost:6081/nftspaginate'
  reqOpts: any;

  pageSize : number = 10;

  constructor(private http: HttpClient) { }

  getLastNFTDetails(InitialDistributorPK:string): Observable<NFTMarket[]> {
    //request to get collection name according to user public key
    return this.http.get<NFTMarket[]>(`${this.baseUrlGetLastNFT}/${InitialDistributorPK}`);
  }

  getSVGByHash(Hash:string): Observable<SVG[]> {
    //request to get collection name according to user public key
    return this.http.get<SVG[]>(`${this.baseUrlSVG}/${Hash}`);
  }


  getNFTDetails(NFTIdentifier:string,SellingStatus:string,Blockchain:string): Observable<GetNFT[]> {
    //request to get collection name according to user public key
    return this.http.get<GetNFT[]>(`${this.baseUrlGetNFT}/${SellingStatus}/${NFTIdentifier}/${Blockchain}`);
  }

  getNFTByBlockchain(Blockchain:string): Observable<GetNFT[]> {
    //request to get collection name according to user public key
    return this.http.get<GetNFT[]>(`${this.baseUrlfilter}/${Blockchain}`);
  }


  updateNFTStatusBackend(st: SalesBE): Observable<SalesBE> {
    console.log("data: ",st)
    return this.http.put<SalesBE>(this.baseUrlUpdateStatusBE, st, {headers: this.headers});
  }

  updateNFTStatusGateway(price:string,status:string,amount:string,nfttxnhash:string): Observable<any> {

    return this.http.put<any>(this.baseUrlUpdateStatusGW
      + `/nft/updatesell?Price=${price}&Status=${status}&Amount=${amount}&NFTTxnHash=${nfttxnhash}`,
      {headers: this.headers});
  }

  updateNFTBuyStatusGateway(sellingStatus:string,currentPK:string,previousPK:string,nfthash:string): Observable<BuyNFTGW> {
    return this.http.put<any>(this.baseUrlUpdateStatusGW
      + `/nft/updatebuy?sellingStatus=${sellingStatus}&currentPK=${currentPK}&previousPK=${previousPK}&nfthash=${nfthash}`,
      {headers: this.headers});
  }

  getNFT(): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http.get<NFT[]>(`${this.baseUrlGetAllNFT}`);
  }

  getNFTOnSale(sellingstatus):Observable<NFT[]>{
     //request to get collection name according to user public key
     return this.http.get<NFT[]>(`${this.baseUrlGetOnSaleNFT}/${sellingstatus}`);
    }


getMyNFTStatus(sellingstatus,userId):Observable<NFT[]>{
  //request to get collection name according to user public key
  return this.http.get<NFT[]>(`${this.baseUrlGetMyNFTByStatus}/${sellingstatus}/${userId}`);
 }

 getMyNFT(userId):Observable<NFT[]>{
  //request to get collection name according to user public key
  return this.http.get<NFT[]>(`${this.baseUrlGetMyNFT}/${userId}`);
 }

 getNFTByBlockchainandUser(blockchain,userId):Observable<NFT[]>{
  //request to get collection name according to user public key
  return this.http.get<NFT[]>(`${this.baseUrlGetOnSaleNFT}/${userId}/${blockchain}`);
 }

 getTXNByBlockchainandIdentifier(id,blockchain):Observable<TXN[]>{
  //request to get collection name according to user public key
  return this.http.get<TXN[]>(`${this.baseUrlTxn}/${id}/${blockchain}`);
 }

 getNFTpaginated (blockchain : string, requestedPage : number) : Observable<GetNFT[]> {
  return this.http.get<GetNFT[]>(`${this.baseUrlPaginated}/${blockchain}/${this.pageSize}/${requestedPage}`);
 }
}
