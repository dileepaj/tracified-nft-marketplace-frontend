import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  BuyNFTGW,
  GetNFT,
  NFTMarket,
  QueueNFT,
  SalesBE,
  SalesGW,
} from 'src/app/models/nft';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { NFT, SVG, Thumbnail, TXN } from 'src/app/models/minting';
import { APIConfigENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NftServicesService {
  private readonly nftBackendBaseURL = APIConfigENV.nftbackendBaseURL;
  private readonly gateWayBaseURL = APIConfigENV.gatewayBaseURL;
  readonly headers = new HttpHeaders().set('Content-Type', 'application/json');
  baseUrlGetLastNFT: string = this.gateWayBaseURL + 'lastnft';
  baseUrlGetNFT: string = this.nftBackendBaseURL + 'buying';
  baseUrlUpdateStatusBE: string = this.nftBackendBaseURL + 'nft/sale';
  baseUrlUpdateStatusGW: string = this.gateWayBaseURL;
  baseUrlSVG: string = this.nftBackendBaseURL + 'svg';
  baseUrlThumbnail: string = this.nftBackendBaseURL + 'explore/thumbnail';
  baseUrlGetAllNFT: string = this.nftBackendBaseURL + 'marketplace';
  baseUrlGetOnSaleNFT: string = this.nftBackendBaseURL + 'nft/sales';
  baseUrlGetYourNFT: string = this.nftBackendBaseURL + 'nft';
  baseUrlGetMyNFTByStatus: string = this.nftBackendBaseURL + 'selling';
  baseUrlGetMyNFT: string = this.nftBackendBaseURL + 'userid';
  baseUrlfilter: string = this.nftBackendBaseURL + 'blockchain';
  baseUrlTxn: string = this.nftBackendBaseURL + 'txn';
  baseUrlPaginated: string = this.nftBackendBaseURL + 'nftspaginate';
  baseUrlPaginatedFiltering: string =
    this.nftBackendBaseURL + 'nftspaginate/filterby';
  baseUrlBestCreators: string =
    this.nftBackendBaseURL + 'explore/bestcreations';
  baseUrlOnSale: string = this.nftBackendBaseURL + 'onsale';
  reqOpts: any;

  pageSize: number = 8;
  baseUrlQueue: string=this.gateWayBaseURL + 'lock';
  baseUrlGetQueueData:string=this.gateWayBaseURL+'queue';

  constructor(private http: HttpClient) {}

  getLastNFTDetails(InitialDistributorPK: string): Observable<NFTMarket[]> {
    //request to get collection name according to user public key
    return this.http.get<NFTMarket[]>(
      `${this.baseUrlGetLastNFT}/${InitialDistributorPK}`
    );
  }

  getSVGByHash(Hash: string): Observable<SVG[]> {
    //request to get collection name according to user public key
    return this.http.get<SVG[]>(`${this.baseUrlSVG}/${Hash}`);
  }

  getThumbnailId(Id: string): Observable<Thumbnail[]> {
    //request to get collection name according to user public key
    return this.http.get<Thumbnail[]>(`${this.baseUrlThumbnail}/${Id}`);
  }

  getNFTDetails(
    NFTIdentifier: string,
    SellingStatus: string,
    Blockchain: string
  ): Observable<GetNFT[]> {
    //request to get collection name according to user public key
    return this.http.get<GetNFT[]>(
      `${this.baseUrlGetNFT}/${SellingStatus}/${NFTIdentifier}/${Blockchain}`
    );
  }

  getNFTByBlockchain(Blockchain: string): Observable<GetNFT[]> {
    //request to get collection name according to user public key
    return this.http.get<GetNFT[]>(`${this.baseUrlfilter}/${Blockchain}`);
  }

  updateNFTStatusBackend(st: SalesBE): Observable<SalesBE> {
    return this.http.put<SalesBE>(this.baseUrlUpdateStatusBE, st, {
      headers: this.headers,
    });
  }

  queueBuys(st:QueueNFT):Observable<QueueNFT> {
    //request to add collection into the nft backend DB
    return this.http.post<QueueNFT>(this.baseUrlQueue, st, {
      headers: this.headers,
    });
  }

  getQueueData(ImageBase64:string,blockchain:string,version:number): Observable<QueueNFT[]> {
    //request to get collection name according to user public key
    return this.http.get<QueueNFT[]>(`${this.baseUrlGetQueueData}/${ImageBase64}/${blockchain}/${version}`);
  }

  updateNFTStatusGateway(
    price: string,
    status: string,
    amount: string,
    nfttxnhash: string
  ): Observable<any> {
    return this.http.put<any>(
      this.baseUrlUpdateStatusGW +
        `nft/updatesell?Price=${price}&Status=${status}&Amount=${amount}&NFTTxnHash=${nfttxnhash}`,
      { headers: this.headers }
    );
  }

  updateNFTBuyStatusGateway(
    sellingStatus: string,
    currentPK: string,
    previousPK: string,
    nfthash: string
  ): Observable<BuyNFTGW> {
    return this.http.put<any>(
      this.baseUrlUpdateStatusGW +
        `nft/updatebuy?sellingStatus=${sellingStatus}&currentPK=${currentPK}&previousPK=${previousPK}&nfthash=${nfthash}`,
      { headers: this.headers }
    );
  }

  getNFT(): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http.get<NFT[]>(`${this.baseUrlGetAllNFT}`);
  }

  getNFTOnSale(sellingstatus): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http.get<NFT[]>(`${this.baseUrlGetOnSaleNFT}/${sellingstatus}`);
  }

  getMyNFTStatus(sellingstatus, userId): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http.get<NFT[]>(
      `${this.baseUrlGetMyNFTByStatus}/${sellingstatus}/${userId}`
    );
  }

  getMyNFT(userId): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http.get<NFT[]>(`${this.baseUrlGetMyNFT}/${userId}`);
  }

  getNFTByBlockchainandUser(blockchain, userId): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http
      .get<NFT[]>(`${this.baseUrlGetYourNFT}/${userId}/${blockchain}`)
      .pipe(catchError(this.handleError));
  }

  getNFTByBlockchainandUserPaginated(
    blockchain: string,
    userId: string,
    filter: string,
    pageSize: number,
    requestedPage: number
  ): Observable<NFT[]> {
    //request to get collection name according to user public key
    return this.http.get<NFT[]>(
      `${this.nftBackendBaseURL}/profilecontent/${userId}/${blockchain}/${filter}/${pageSize}/${requestedPage}`
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getTXNByBlockchainandIdentifier(id, blockchain): Observable<TXN[]> {
    //request to get collection name according to user public key
    return this.http.get<TXN[]>(`${this.baseUrlTxn}/${id}/${blockchain}`);
  }

  getNFTpaginated(
    blockchain: string,
    requestedPage: number
  ): Observable<GetNFT[]> {
    return this.http.get<GetNFT[]>(
      `${this.baseUrlPaginated}/${blockchain}/${this.pageSize}/${requestedPage}`
    );
  }

  getNFTpaginatedOnSALE(
    blockchain: string,
    requestedPage: number,
    filter: string
  ): Observable<GetNFT[]> {
    return this.http.get<GetNFT[]>(
      `${this.baseUrlPaginated}/${blockchain}/${filter}/${this.pageSize}/${requestedPage}`
    );
  }

  getNFTpaginatedTrendsHotpicks(
    blockchain: string,
    requestedPage: number,
    filter: string
  ): Observable<GetNFT[]> {
    return this.http.get<GetNFT[]>(
      `${this.baseUrlPaginatedFiltering}/${filter}/${blockchain}/${this.pageSize}/${requestedPage}`
    );
  }

  getBestCreators(
    requestedPage: number,
    blockchain: string
  ): Observable<GetNFT[]> {
    return this.http.get<GetNFT[]>(
      `${this.baseUrlBestCreators}/${blockchain}/${this.pageSize}/${requestedPage}`
    );
  }

  getFilteredNFTs(
    blockchain: string,
    requestedPage: number,
    filter: string,
    pageSize: number
  ): Observable<NFT[]> {
    return this.http.get<NFT[]>(
      `${this.baseUrlOnSale}/${filter}/${blockchain}/${pageSize}/${requestedPage}`
    );
  }
}
