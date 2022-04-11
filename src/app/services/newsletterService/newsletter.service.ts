import { NewsLetter } from './../../../models/newsletterModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  baseUrl: string = "http://localhost:6081/api/newsletter/save";
  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  add(st: NewsLetter): Observable<NewsLetter> {
    return this.http.post<NewsLetter>(this.baseUrl, st, {headers: this.headers});
  }
}
