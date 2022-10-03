import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFAQ } from 'src/app/models/mail';
import { UpdateUserFAQResponse } from 'src/app/models/userFAQ';

@Injectable({
  providedIn: 'root'
})
export class UserFAQService {
  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  private baseURL='http://localhost:6081/'
  private addUserFAQURL :string = this.baseURL+"userfaq/"
  private getPendingQuestionsURL : string = this.baseURL+"userfaq/status/Pending"
  private updateFAQURL: string = this.baseURL+"userfaq/status"
  constructor(private http: HttpClient) { }
  addUserFAQ(userFAQ: UserFAQ): Observable<string>{
    return this.http.post<string>(this.addUserFAQURL,userFAQ,{headers:this.headers})
  }
  getPendingQuestions():Observable<UserFAQ[]>{
    return this.http.get<UserFAQ[]>(this.getPendingQuestionsURL,{headers:this.headers})
  }
  updateFAQ(userFAQ: UpdateUserFAQResponse):Observable<string>{
    return this.http.put<string>(this.updateFAQURL,userFAQ,{headers:this.headers})
  }
}
