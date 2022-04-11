import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Review } from 'src/models/reviewModel';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  baseUrl: string = "http://localhost:6081/api/review/save";
  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  //Does the service call to the nft backend server transmitting data using the POST method
  add(st: Review): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, st, {headers: this.headers});
  }
}
