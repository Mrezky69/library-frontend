import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RentService {
  private baseUrl = 'http://localhost:8080/v1';

  constructor(private http: HttpClient, private router: Router) {}

  rent(credentials: { memberId: string; bookId: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/rent`, credentials);
  }
}