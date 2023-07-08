import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthInput, AuthResponse, RefreshTokenResponse } from '@auth/types';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient) {}

  login({ email, password }: AuthInput): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password });
  }

  register({ email, password, username }: AuthInput): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', { email, password, username });
  }

  logout() {
    return this.http.get('/api/auth/logout');
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + refreshToken )
    return this.http.get<RefreshTokenResponse>('/api/auth/refresh', { headers: headers });
  }
}
