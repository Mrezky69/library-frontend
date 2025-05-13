import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private api = 'http://localhost:8080/v1/books';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getBooks(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(this.api, {
      params: httpParams,
      headers: this.getAuthHeaders()
    });
  }

  getBookById(id: number): Observable<any> {
    return this.http.get(`${this.api}/${id}`, { headers: this.getAuthHeaders() });
  }

  createBook(data: any): Observable<any> {
    return this.http.post(this.api, data, { headers: this.getAuthHeaders() });
  }

  updateBook(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`, { headers: this.getAuthHeaders() });
  }
}
