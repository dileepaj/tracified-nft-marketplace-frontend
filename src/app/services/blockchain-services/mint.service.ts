import {Injectable} from '@angular/core';
import {HttpClient,HttpParams, HttpHeaders} from "@angular/common/http";
import {Observable,BehaviorSubject,Subject} from "rxjs";
import { Collection } from 'src/app/models/collection';
import { Mint2Component } from 'src/app/nft/mint2/mint2.component';
import { Issuer, Ownership ,NFT,tags} from 'src/app/models/minting';
import { Properties } from '../../shared/properties';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MintService {
  baseUrlSave: string = 'http://localhost:6081/api/marketplace/save';
  baseUrlOwner: string ='http://localhost:6081/api/marketplace/owner';
  baseUrlTags:string='http://localhost:6081/api/tags/save';
  baseUrlGet: string = 'http://localhost:6081/api/collection/save';
  baseUrlGetIssuer = 'http://localhost:9080/nft/createNFTIssuerAccount';
  baseUrlMintStellar='http://localhost:9080/nft/mintStellar';

  
 
  mint:NFT
  
  tag:tags
  reqOpts: any;

  private content= new Subject<any>();
  

  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

setData(st:any){
  this.content.next(st);
  console.log("-------------set------",this.content)
 
}



getData():Observable<any>{
  console.log("-------------------get------------------",this.content)
  return this.content.asObservable();
}



  addOwner(st:Ownership):Observable<Ownership>{
    console.log("-------------------------------------test 4 ------------------------------Minted NFT ",st)
    return this.http.post<Ownership>(this.baseUrlOwner, st, {headers: this.headers});
  }

  add(st: NFT): Observable<NFT> {
    console.log("-------------------------------------test 4 ------------------------------Minted NFT ",st)
    return this.http.post<NFT>(this.baseUrlSave, st, {headers: this.headers});
  }

createIssuer():Observable<Issuer>{
  console.log("-------------------------------------create issuer on stellar ------------------------------ ")
    return this.http.get<Issuer>(this.baseUrlGetIssuer, {headers: this.headers});
}


  getAll(): Observable<Collection[]> {
    return this.http.get<Collection[]>(this.baseUrlGet);
  }

  addTags(st: tags): Observable<tags> {
    console.log("-------------------------------------test 4 ------------------------------Minted NFT ",st.NFTName)
    return this.http.post<tags>(this.baseUrlTags, st, {headers: this.headers});
  }

  // getIssuerPK(userId:string): Observable<Collection[]> {
  //   return this.http.get<Collection[]>(`${this.baseUrlGet}/${userId}`);
  // }
  // add(st: Collection): Observable<Collection> {
  //   console.log("-------------------------------------test 4 ------------------------------",st.organizationName)
  //   return this.http.post<Collection>(this.baseUrlSave, st, {headers: this.headers});
  // }

  // update(st: Collection): Observable<Collection> {
  //   return this.http.put<Collection>(
  //     `${this.baseUrl}/${st.collectionId}`, st, {headers: this.headers}
  //   );
  // }

  // delete(id: string): Observable<Collection> {
  //   return this.http.delete<Collection>(`${this.baseUrl}/${id}`);
  // }

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
    copies:number,
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
            console.log("------------------------------------response caught--------------------------------")
            resolve(response);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
    });
  }
}



