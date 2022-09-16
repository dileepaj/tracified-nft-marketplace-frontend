import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable,Subject} from "rxjs";
import { Collection } from 'src/app/models/collection';
import { Issuer, Ownership ,NFT,tags, Minter,StellarTXN,Contracts} from 'src/app/models/minting';

@Injectable({
  providedIn: 'root'
})
export class MintService {
  baseUrlSave: string = 'http://localhost:6081/marketplace/save';
  baseUrlSaveGW: string = 'http://localhost:9080/nft/mintcontract';
  baseUrlOwner: string ='http://localhost:6081/marketplace/owner';
  baseUrlTags:string='http://localhost:6081/tags/save';
  baseUrlNftByTags:string='http://localhost:6081/tags/'
  baseUrlGet: string = 'http://localhost:6081/collection/save';
  baseUrlGetIssuer = 'http://localhost:9080/nft/issueaccount';
  baseUrlMintStellar='http://localhost:9080/nft/mintStellar';
  baseUrlMintSolana = 'http://localhost:9080/nft/mintSolana';
  baseUrlMinter='http://localhost:9080/nft/minter';
  baseUrlUpdate="http://localhost:6081/marketplace/nft";
  baseUrlStellarUpdate="http://localhost:6081/marketplace/txn";
  baseUrlGetStellarTXN='http://localhost:9080/nft/gettxn';
  mint:NFT
  tag:tags
  reqOpts: any;
  private content= new Subject<any>();
  

  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}
   
  addOwner(st:Ownership):Observable<Ownership>{
    return this.http.post<Ownership>(this.baseUrlOwner, st, {headers: this.headers});
  }

  addNFTBE(st: NFT): Observable<NFT> {
    return this.http.post<NFT>(this.baseUrlSave, st, {headers: this.headers});
  }

  addNFTGW(st: Contracts): Observable<Contracts> {
    return this.http.post<Contracts>(this.baseUrlSaveGW, st, {headers: this.headers});
  }

  createIssuer():Observable<Issuer>{
    return this.http.get<Issuer>(this.baseUrlGetIssuer, {headers: this.headers});
}

 getMinter(ImageBase64:string,blockChain:string): Observable<Minter[]> {
    const response:Observable<Minter[]>=this.http.get<Minter[]>(`${this.baseUrlMinter}/${ImageBase64}/${blockChain}`, {headers: this.headers});
    return response
  }

  getStellarTXN(ImageBase64:string,Blockchain:string): Observable<StellarTXN[]> {
    const stellarTxnResponse = this.http.get<StellarTXN[]>(`${this.baseUrlGetStellarTXN}/${ImageBase64}/${Blockchain}`, {headers: this.headers});
    return stellarTxnResponse
  }

  getAll(): Observable<Collection[]> {
    return this.http.get<Collection[]>(this.baseUrlGet);
  }

  addTags(st: tags): Observable<tags> {
    return this.http.post<tags>(this.baseUrlTags, st, {headers: this.headers});
  }

  getNFTByTag(tag:string){
    return this.http.get<NFT[]>(`${this.baseUrlNftByTags}/${tag}`);
  }
  
  updateNFTSolana(st: Minter): Observable<Minter> {
    const updateMinterResult: Observable<Minter>= this.http.put<Minter>(this.baseUrlUpdate, st, {headers: this.headers});
    return updateMinterResult
  }

  updateTXNStellar(st: StellarTXN): Observable<StellarTXN> {
    const stellarTxnUpdateResponse= this.http.put<StellarTXN>(this.baseUrlStellarUpdate, st, {headers: this.headers});
    return stellarTxnUpdateResponse
  }

  minNFTStellar(
    transactionResultSuccessful:string,
    issuerPublicKey:string,
    distributorPublickKey:string,
    asset_code:string,
    asset_url:string,
    description:string,
    collection:string,
    NFTBlockChain:string,
    tags:string,
    categories:string,
    copies:string,
    nftLink:string,
    created_at:string,
    artist:string,
    artistLink:string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.reqOpts = {
        observe: "response",
        headers: new HttpHeaders({
          Accept: "application/json",
          "Content-Type": "Application/json",
        }),
      };
      let NFTModel = {
        DistributorPublickKey: distributorPublickKey,
        IssuerPublicKey:issuerPublicKey,
        Asset_code: asset_code,
        NFTURL: asset_url,
        Description: description,
        Collection: collection,
        NFTBlockChain: NFTBlockChain,
        Tags: tags,
        Categories:categories,
        Copies:copies,
        NFTLinks:nftLink,
        ArtistName:artist,
        ArtistLink:artistLink,
        Successfull: transactionResultSuccessful,
        TrustLineCreatedAt: created_at,
        
      };
      this.http
        .post(this.baseUrlMintStellar, NFTModel, this.reqOpts)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
    });
  }

  minNFTSolana(
    distributorPublickKey:string,
    asset_code:string,
    asset_url:string,
    description:string,
    collection:string,
    NFTBlockChain:string,
    tags:string,
    categories:string,
    copies:string,
    nftLink:string,
    artist:string,
    artistLink:string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.reqOpts = {
        observe: "response",
        headers: new HttpHeaders({
          Accept: "application/json",
          "Content-Type": "Application/json",
        }),
      };
      let NFTModel = {
        OwnerPK: distributorPublickKey,
        Asset_code: asset_code,
        NFTURL: asset_url,
        Description: description,
        Collection: collection,
        NFTBlockChain: NFTBlockChain,
        Tags: tags,
        Categories:categories,
        Copies:copies,
        NFTLinks:nftLink,
        ArtistName:artist,
        ArtistLink:artistLink,
        
      };
      this.http
        .post(this.baseUrlMintSolana, NFTModel, this.reqOpts)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

 
}



