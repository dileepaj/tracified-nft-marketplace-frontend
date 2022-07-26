import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuyNFTGW, GetNFT, NFTMarket, SalesBE, SalesGW } from 'src/app/models/nft';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { NFT, SVG } from 'src/app/models/minting';

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
  baseUrlGetAllNFT:string='http://localhost:6081/api/marketplace';
  baseUrlGetOnSaleNFT:string='http://localhost:6081/api/nft';
  baseUrlGetMyNFTByStatus:string='http://localhost:6081/api/selling'
  baseUrlGetMyNFT:string='http://localhost:6081/api/userid'
  baseUrlfilter:string='http://localhost:6081/api/blockchain'
  reqOpts: any;

  constructor(private http: HttpClient) { }

  getLastNFTDetails(InitialDistributorPK:string): Observable<NFTMarket[]> {
    //request to get collection name according to user public key
    return this.http.get<NFTMarket[]>(`${this.baseUrlGetLastNFT}/${InitialDistributorPK}`);
  }

  getSVGByHash(Hash:string): Observable<SVG[]> {
    //request to get collection name according to user public key
    console.log("inside get svg service: ",Hash)
    return this.http.get<SVG[]>(`${this.baseUrlSVG}/${Hash}`);
  }

  // getSVGByHash(Hash:string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.reqOpts = {
  //       observe: "response",
  //       headers: new HttpHeaders({
  //         Accept: "application/json",
  //         "Content-Type": "Application/json",
  //       }),
  //     };
  //     this.http.get(this.baseUrlSVG + "/"+Hash).subscribe(
  //       (response) => {
  //         resolve(response);
  //       },
  //       (error) => {
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  getNFTDetails(NFTIdentifier:string,SellingStatus:string,Blockchain:string): Observable<GetNFT[]> {
    //request to get collection name according to user public key
    return this.http.get<GetNFT[]>(`${this.baseUrlGetNFT}/${SellingStatus}/${NFTIdentifier}/${Blockchain}`);
  }

  getNFTByBlockchain(Blockchain:string): Observable<GetNFT[]> {
    console.log("service.................",Blockchain)
    //request to get collection name according to user public key
    return this.http.get<GetNFT[]>(`${this.baseUrlfilter}/${Blockchain}`);
  }

  
  updateNFTStatusBackend(st: SalesBE): Observable<SalesBE> {
    return this.http.put<SalesBE>(this.baseUrlUpdateStatusBE, st, {headers: this.headers});
  }

  updateNFTStatusGateway(price:string,status:string,amount:string,nfttxnhash:string): Observable<any> {
   
    return this.http.put<any>(this.baseUrlUpdateStatusGW
      + `/nft/updateStellarMarketplaceSell?Price=${price}&Status=${status}&Amount=${amount}&NFTTxnHash=${nfttxnhash}`,
      {headers: this.headers});
  }

  updateNFTBuyStatusGateway(sellingStatus:string,currentPK:string,previousPK:string,nfthash:string): Observable<BuyNFTGW> {
    return this.http.put<any>(this.baseUrlUpdateStatusGW
      + `/nft/updateStellarMarketplaceBuy?sellingStatus=${sellingStatus}&currentPK=${currentPK}&previousPK=${previousPK}&nfthash=${nfthash}`,
      {headers: this.headers});
  }

  getNFT(): Observable<NFT[]> {
    console.log("inside service")
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
}