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

  // getAll(): Observable<Collection[]> {
  //   return this.http.get<Collection[]>(this.baseUrl);
  // }

  add(st: Review): Observable<Review> {
    console.log("service call")
    console.log("serive rating : ",st.Rating)
    return this.http.post<Review>(this.baseUrl, st, {headers: this.headers});
  }

  // update(st: Collection): Observable<Collection> {
  //   return this.http.put<Collection>(
  //     `${this.baseUrl}/${st.collectionId}`, st, {headers: this.headers}
  //   );
  // }

  // delete(id: string): Observable<Collection> {
  //   return this.http.delete<Collection>(`${this.baseUrl}/${id}`);
  // }
}
