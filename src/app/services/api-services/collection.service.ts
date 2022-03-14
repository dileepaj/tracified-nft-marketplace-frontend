import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Collection } from 'src/app/models/collection';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  baseUrl: string = "'/collections'";
  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  // getAll(): Observable<Collection[]> {
  //   return this.http.get<Collection[]>(this.baseUrl);
  // }

  add(st: Collection): Observable<Collection> {
    return this.http.post<Collection>(this.baseUrl, st, {headers: this.headers});
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


