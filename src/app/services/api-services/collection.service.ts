import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Collection } from 'src/app/models/collection';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  baseUrlSave: string = 'http://localhost:6081/api/collection/save';
 // baseUrlGet: string = 'http://localhost:6081/api/collection/save';

  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  // getAll(): Observable<Collection[]> {
  //   return this.http.get<Collection[]>(this.baseUrlGet);
  // }

  add(st: Collection): Observable<Collection> {
    console.log("-------------------------------------test 4 ------------------------------",st.organizationName)
    return this.http.post<Collection>(this.baseUrlSave, st, {headers: this.headers});
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


