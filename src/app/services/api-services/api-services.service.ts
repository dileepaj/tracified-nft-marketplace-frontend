import { Injectable } from '@angular/core';
import { NFT, SVG, TXN, UpdateSVG } from 'src/app/models/minting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Favourites, WatchList } from 'src/app/models/marketPlaceModel';
import { Endorse, UpdateEndorse, UpdateStatus } from 'src/app/models/endorse';
import { Partners, UpdatePartners } from 'src/app/models/admin';
import { NFTStory, Reviews } from 'src/app/models/nft';
import { Subscription } from 'src/app/models/mail';
import { APIConfigENV } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  private readonly nftBackendBaseURL = APIConfigENV.nftbackendBaseURL
  baseUrlSaveSvg: string = this.nftBackendBaseURL+'svg/save';
  baseUrlSaveTxn: string = this.nftBackendBaseURL+'txn/save';
  baseUrlUpdateSVGBC:string=this.nftBackendBaseURL+'svg';
  baseUrlSaveFavs:string=this.nftBackendBaseURL+'favourites/save';
  baseUrlSaveWatchlist:string=this.nftBackendBaseURL+'watchlists/save';
  baseUrlGetFavs:string=this.nftBackendBaseURL+'favourites';
  baseUrlFindFavs:string=this.nftBackendBaseURL+'favourite';
  baseUrlGetWatchlist:string=this.nftBackendBaseURL+'watchlists';
  baseUrlGetWatched:string=this.nftBackendBaseURL+'watched';
  baseUrlEndorse:string=this.nftBackendBaseURL+'endorser/save';
  baseUrlEndorsement=this.nftBackendBaseURL+'endorsement/status';
  baseUrlUpdateEndorse=this.nftBackendBaseURL+'endorsement';
  baseUrlPartner=this.nftBackendBaseURL+'partner/'
  baseUrlSaveReview=this.nftBackendBaseURL+'review/';
  baseUrlFilterReview=this.nftBackendBaseURL+'review/filterby';
  baseUrlSaveStory=this.nftBackendBaseURL+'story/';
  baseUrlSubscribe =this.nftBackendBaseURL+'subscribe/';
  baseURLSubscribeCheck=this.nftBackendBaseURL+'subscribe/check'
  baseUrlNFT =this.nftBackendBaseURL+'nft/';
  getwatchlistbyUserPK = this.nftBackendBaseURL+'verify/watchlistCount/'
  removeUserfromWatchList = this.nftBackendBaseURL+'watchlist'
  getfavouritebyUserPK = this.nftBackendBaseURL+'verify/favouriteCount/'
  removeUserfromFavourite = this.nftBackendBaseURL+'favourite'
  getNFTByIdandBC =this.nftBackendBaseURL+'nftstats'
  pageSize : number = 10;

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
  checkifSubscribed(email:string):Observable<Subscription>{
      return this.http.get<Subscription>(`${this.baseURLSubscribeCheck}/${email}`)
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

  getFavouritebyBlockchainandUserPK(blockchain:string,userPK:string,nftidentifier:string):Observable<NFT>{
    return this.http.get<NFT>(`${this.getfavouritebyUserPK}/${blockchain}/${userPK}/${nftidentifier}`);
  }

  removeuserfromFavourite(favouriteID:string):Observable<NFT>{
    return this.http.delete<NFT>(`${this.removeUserfromFavourite}/${favouriteID}`);
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

  getImagebase64(imgb64:string): Observable<NFT> {
    //request to get imagebase64
    return this.http.get<NFT>(`${this.baseUrlNFT}/${imgb64}`);
  }

  getSimilarOwner(publickey:string,issuer:string): Observable<NFT> {
    //request to get owner
    return this.http.get<NFT>(`${this.baseUrlNFT}/${publickey}/${issuer}`);
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

    getWatchlistbyBlockchainandUserPK(blockchain:string,userPK:string,nftidentifier:string):Observable<NFT>{
      return this.http.get<NFT>(`${this.getwatchlistbyUserPK}/${blockchain}/${userPK}/${nftidentifier}`);
    }
    removeuserfromWatchList(watchlistID:string):Observable<NFT>{
      return this.http.delete<NFT>(`${this.removeUserfromWatchList}/${watchlistID}`);
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

    getReviewsByFilter(filter:string,page:number,id:string):Observable<Reviews[]> {
      return this.http.get<Reviews[]>(`${this.baseUrlFilterReview}/${filter}/${id}/${this.pageSize}/${page}`);
    }

    getAllReviewsByNFTId(id:string):Observable<Reviews[]> {
      return this.http.get<Reviews[]>(`${this.baseUrlSaveReview}/${id}`);
    }

    addStory(st: NFTStory): Observable<NFTStory> {
      return this.http.post<NFTStory>(this.baseUrlSaveStory, st, {headers: this.headers});
    }

    getAllStoryByNFTIdAndBlockchain(id:string, blockchain:string):Observable<any> {
      return this.http.get<any>(`${this.baseUrlSaveStory}/${id}/${blockchain}`);
    }
    
    getNFTIdAndBlockchain(id:string, blockchain:string):Observable<any> {
      return this.http.get<any>(`${this.getNFTByIdandBC}/${id}/${blockchain}`);
    }
    ///nftstats/{nftidentifier}/{blockchain}
}

