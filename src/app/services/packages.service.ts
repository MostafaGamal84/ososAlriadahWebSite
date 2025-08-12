import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private apiUrl = 'https://ajyalalquran.somee.com/api/Subscribe';

  constructor(private http: HttpClient) {}

  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  sendEmail(
    email: string,
    name: string,
    message: string,
    phone: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('name', name)
      .set('message', message)
      .set('phone', phone);

    return this.http.post(`${this.apiUrl}/SendEmailForNewRequests`, null, {
      params,
    });
  }
}
