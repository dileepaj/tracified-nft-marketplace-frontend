import { GetNFT } from './../../models/nft';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatrixViewService {
  baseURLGetOnSale = 'http://localhost:6081/api/selling/ON SALE'
  jwtToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6IiIsImFkZHJlc3MiOnsiZm9ybWF0dGVkIjoibm9uZSJ9LCJhdXRoX3RpbWUiOjE2NDkzMzE1NjUsImJhY2tlbmRWZXJzaW9uIjoidjEiLCJjb21wYW55IjoiUUEiLCJkZXZpY2VJZCI6IjYwNDgyM2YwLWI2NjctMTFlYy1iMTk3LTk5Njc0MDgzOGZmMCIsImRpc3BsYXlJbWFnZSI6Im5vbmUiLCJkb21haW4iOiJBZ3JpY3VsdHVyZSIsImVtYWlsIjoidGhpbnVyaXdAdHJhY2lmaWVkLmNvbSIsImxvY2FsZSI6IlNyaSBMYW5rYSIsIm5hbWUiOiJRQSAiLCJwZXJtaXNzaW9ucyI6eyIwIjpbIjEwIiwiMTIiLCIxNyIsIjYwIiwiMTgiLCI0MSIsIjQyIiwiNjciLCI2OCIsIjYxIiwiMTkiLCI0MyIsIjQ0IiwiNjIiLCIyMCIsIjQ1IiwiNDYiLCI2MyIsIjIxIiwiNDciLCI0OCIsIjIyIiwiMjMiLCIyNCIsIjI1IiwiMjYiLCIyNyIsIjI4IiwiNDAiLCIyOSIsIjUwIiwiMzAiLCIzMSIsIjQ5IiwiNTMiLCIzMiIsIjUxIiwiNTIiLCIzMyIsIjM0IiwiMzUiLCIzNiIsIjM3IiwiMzgiLCIzOSIsIjY0IiwiNTQiLCI1NSIsIjU2IiwiNjUiLCI1NyIsIjU4IiwiNTkiLCI2MCIsIjYxIiwiNjIiLCI2MyIsIjY0IiwiNjUiLCI2NyIsIjY4IiwiNjkiLCI3MCIsIjczIl19LCJwaG9uZV9udW1iZXIiOiIrOTQ3NzAzMTkxNjIiLCJwaWQiOiIiLCJ0ZW5hbnRJRCI6Ijc4NGI1MDcwLTgyNDgtMTFlYi1iY2FjLTMzOTQ1NGE5OTZiZSIsInRlbmFudFR5cGUiOjAsInR5cGUiOiJBZG1pbiIsInVzZXJJRCI6Ijc4NGI1MDcwLTgyNDgtMTFlYi1iY2FjLTMzOTQ1NGE5OTZiZSIsInVzZXJuYW1lIjoidGhpbnVyaXdAdHJhY2lmaWVkLmNvbSIsImlhdCI6MTY0OTMzMTU2NSwiZXhwIjo5NjQ5OTM2MzY1fQ.IFMfdCSzgJVD2hcUdf41SQUZVs20CgxiLYSv1uuBPgA'

  private setHeaders():HttpHeaders{
    const headerConfig={
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization : this.jwtToken
    }
    return new HttpHeaders(headerConfig);
  }
  readonly headers = this.setHeaders()
  
  constructor(private http: HttpClient) { }

  getNFTOnSale(identifier:string): Observable<GetNFT[]> {
    return this.http.get<GetNFT[]>(`${this.baseURLGetOnSale}/${identifier}`,{
      headers: this.setHeaders()
    })

  }

}