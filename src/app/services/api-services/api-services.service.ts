import { Injectable } from '@angular/core';
import { NFT, SVG, TXN, UpdateSVG } from 'src/app/models/minting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { Endorse, UpdateEndorse, UpdateStatus } from 'src/app/models/endorse';
import { Partners, UpdatePartners } from 'src/app/models/admin';
import { NFTStory, Reviews } from 'src/app/models/nft';
import { Subscription } from 'src/app/models/mail';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  baseUrlSaveSvg: string = 'http://localhost:6081/svg/save';
  baseUrlSaveTxn: string = 'http://localhost:6081/txn/save';
  baseUrlUpdateSVGBC:string='http://localhost:6081/svg';
  baseUrlSaveFavs:string='http://localhost:6081/favourites/save';
  baseUrlSaveWatchlist:string='http://localhost:6081/watchlists/save';
  baseUrlGetFavs:string='http://localhost:6081/favourites';
  baseUrlFindFavs:string='http://localhost:6081/favourite';
  baseUrlGetWatchlist:string='http://localhost:6081/watchlists';
  baseUrlGetWatched:string='http://localhost:6081/watched';
  baseUrlEndorse:string='http://localhost:6081/endorser/save';
  baseUrlEndorsement='http://localhost:6081/endorsement/status';
  baseUrlUpdateEndorse='http://localhost:6081/endorsement';
  baseUrlPartner='http://localhost:6081/partner/'
  baseUrlSaveReview='http://localhost:6081/review/';
  baseUrlSaveStory='http://localhost:6081/story/';
  baseUrlSubscribe ='http://localhost:6081/subscribe/';

  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  UpdatesvgResponseObservable: Observable<UpdateSVG>;
  constructor(private http: HttpClient) { }

  addSVG(st: SVG): Observable<SVG> {//request to add collection into the nft backend DB
    const svgToAdd = this.http.post<SVG>(this.baseUrlSaveSvg, st, {headers: this.headers});
    return svgToAdd
  }
  addSubscription(st: Subscription): Observable<Subscription> {//request to add collection into the nft backend DB
    const svgToAdd = this.http.post<Subscription>(this.baseUrlSubscribe, st, {headers: this.headers});
    return svgToAdd
  }
  updateSVGBlockchain(st:UpdateSVG):Observable<UpdateSVG>{
    this.UpdatesvgResponseObservable= this.http.put<UpdateSVG>(this.baseUrlUpdateSVGBC, st, {headers: this.headers})
    this.UpdatesvgResponseObservable.subscribe(res=>{
    })
    return this.UpdatesvgResponseObservable
  }

  addTXN(st: TXN): Observable<TXN> {//request to add collection into the nft backend DB
    return this.http.post<TXN>(this.baseUrlSaveTxn, st, {headers: this.headers});
  }

  addToWatchList(st:WatchList):Observable<WatchList>{
    return this.http.post<WatchList>(this.baseUrlSaveWatchlist, st, {headers: this.headers});
  }

  addToFavourites(st:Favourites):Observable<Favourites>{
    return this.http.post<Favourites>(this.baseUrlSaveFavs, st, {headers: this.headers});
  }

  getWatchLists(): Observable<WatchList[]> {
    //request to get collection name according to user public key
    return this.http.get<WatchList[]>(`${this.baseUrlGetWatchlist}`);
  }

  getWatchListByBlockchain(Blockchain:string): Observable<WatchList[]> {
    //request to get collection name according to user public key
    return this.http.get<WatchList[]>(`${this.baseUrlGetWatchlist}/${Blockchain}`);
  }

  getFavourites(): Observable<Favourites[]> {
    //request to get collection name according to user public key
    return this.http.get<Favourites[]>(`${this.baseUrlGetFavs}`);
  }

  getFavouritesByBlockchain(Blockchain:string): Observable<Favourites[]> {
    //request to get collection name according to user public key
    return this.http.get<Favourites[]>(`${this.baseUrlGetFavs}/${Blockchain}`);
  }

  getFavouritesByUserId(userId:string): Observable<Favourites[]> {
    //request to get collection name according to user public key
    return this.http.get<Favourites[]>(`${this.baseUrlGetFavs}/${userId}`);
  }

  getWatchListByUserId(userId:string): Observable<WatchList[]> {
    //request to get collection name according to user public key
    return this.http.get<WatchList[]>(`${this.baseUrlGetWatchlist}/${userId}`);
  }

  endorse(st: Endorse): Observable<Endorse> {//request to add collection into the nft backend DB
    return this.http.post<Endorse>(this.baseUrlEndorse, st, {headers: this.headers});
  }

  getEndorsement(userId:string): Observable<Endorse[]> {
    //request to get collection name according to user public key
    return this.http.get<Endorse[]>(`${this.baseUrlUpdateEndorse}/${userId}`);
  }

  updateEndorsement(st:UpdateEndorse):Observable<UpdateEndorse>{
  return this.http.put<UpdateEndorse>(this.baseUrlUpdateEndorse, st, { headers: this.headers }); 
  }

  updateEndorsementStatus(st:UpdateStatus):Observable<UpdateStatus>{
    return this.http.put<UpdateStatus>(this.baseUrlEndorsement, st, { headers: this.headers }); 
    }

  getEndorsementByStatus(status:string): Observable<Endorse[]> {
      //request to get collection name according to endorsment status
      return this.http.get<Endorse[]>(`${this.baseUrlEndorsement}/${status}`);
    }

  registerPartner(st: Partners): Observable<Partners> {//request to add collection into the nft backend DB
      return this.http.post<Partners>(this.baseUrlPartner, st, {headers: this.headers});
    }
  
  getPartners(): Observable<Partners[]> {
      //request to get collection name according to user public key
      return this.http.get<Partners[]>(`${this.baseUrlPartner}`);
    }
  
    updatePartner(st:UpdatePartners):Observable<UpdatePartners>{
      return this.http.put<UpdatePartners>(this.baseUrlPartner, st, { headers: this.headers }); 
      }

    getFavouritesByBlockchainAndNFTIdentifier(blockchain:string,nftidentifier:string):Observable<NFT[]>{
      return this.http.get<NFT[]>(`${this.baseUrlGetFavs}/${blockchain}/${nftidentifier}`);
    }

    findFavouritesByBlockchainAndNFTIdentifier(blockchain:string,nftidentifier:string):Observable<NFT[]>{
      return this.http.get<NFT[]>(`${this.baseUrlFindFavs}/${blockchain}/${nftidentifier}`);
    }
  
    getWatchlistByBlockchainAndNFTIdentifier(blockchain:string,nftidentifier:string):Observable<NFT[]>{
      return this.http.get<NFT[]>(`${this.baseUrlGetWatchlist}/${blockchain}/${nftidentifier}`);
    }

    findWatchlistByBlockchainAndNFTIdentifier(blockchain:string,nftidentifier:string):Observable<NFT[]>{
      return this.http.get<NFT[]>(`${this.baseUrlGetWatched}/${blockchain}/${nftidentifier}`);
    }

    getUSD(currency:string){
      return this.http.get(`${"https://api.cryptonator.com/api/full"}/${currency}`);
    }

    addReviews(st: Reviews): Observable<Reviews> {
      return this.http.post<Reviews>(this.baseUrlSaveReview, st, {headers: this.headers});
    }

    getAllReviewsByNFTId(id:string):Observable<Reviews[]> {
      console.log("inside service review")
      return this.http.get<Reviews[]>(`${this.baseUrlSaveReview}/${id}`);
    }

    addStory(st: NFTStory): Observable<NFTStory> {
      return this.http.post<NFTStory>(this.baseUrlSaveStory, st, {headers: this.headers});
    }

    getAllStoryByNFTIdAndBlockchain(id:string, blockchain:string):Observable<any> {
      return this.http.get<any>(`${this.baseUrlSaveStory}/${id}/${blockchain}`);
    }
}

