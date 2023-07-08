import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { mergeMap, take, takeWhile, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthApiService } from '@auth/services/auth-api.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AuthInput, AuthResponse, UserFromAuth } from '@auth/types';
import { ToastService } from '@shared/components/toast/toast.service';
import { ToastType } from '@shared/components/toast/toast.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _accessToken = new BehaviorSubject<string | null>(null);
  private _loggedInUser = new BehaviorSubject<UserFromAuth | null>(null);
  public accessToken$: Observable<string | null>;
  public loggedInUser$: Observable<UserFromAuth | null>;

  get accessToken() {
    return this._accessToken.value;
  }
  get loggedInUser() {
    return this._loggedInUser.value;
  }

  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private localStorage: LocalStorageService,
    private toastService: ToastService
  ) {
    this.checkIsUserLoggedIn();
    this.loggedInUser$ = this._loggedInUser.asObservable();
    this.accessToken$ = this._accessToken.asObservable();
  }

  public login(authData: AuthInput): Observable<AuthResponse> {
    return this.authApi.login(authData).pipe(
      tap((result: AuthResponse) => {
        this.handleAuth(result);
      })
    );
  }

  public register(authData: AuthInput): Observable<AuthResponse> {
    return this.authApi.register(authData).pipe(
      tap((result: AuthResponse) => {

        this.toastService.toast({
          toastType: ToastType.Success,
          title: 'Successfully registered',
          message: result.message,
        });
        this.router.navigateByUrl('/auth/login');
      })
    );
  }

  public logout(): void {
    this.authApi.logout().pipe(
      take(1),
    ).subscribe();

    this.localStorage.delete('jwt_token');
    this.localStorage.delete('jwt_token_refresh');
    this.localStorage.delete('logged_user');
    this._loggedInUser.next(null);
    this._accessToken.next(null);
    this.router.navigateByUrl('/auth/login');
  }

  public setRefreshingToken(): void {
    const refreshInterval = 1000 * 60 * 9;

    interval(refreshInterval).pipe(
      takeWhile(() => this._accessToken.value !== null),
      mergeMap(() => {
        const refreshToken = this.localStorage.get<string>('jwt_token_refresh');
        return this.authApi.refreshToken(refreshToken);
      }),
    ).subscribe(response => {
      this._accessToken.next(response.accessToken);
      this.localStorage.set<string>('jwt_token', response.accessToken);
      this.localStorage.set<string>('jwt_token_refresh', response.refreshToken);
    });
  }

  private handleAuth(result: AuthResponse): void {
    const { accessToken, user } = result;
    this.localStorage.set<string>('jwt_token', accessToken);
    this.localStorage.set<string>('jwt_token_refresh', user.refreshToken);
    this.localStorage.set<UserFromAuth>('logged_user', user);

    this._accessToken.next(accessToken);
    this._loggedInUser.next(user);
    this.setRefreshingToken();
    this.router.navigateByUrl('');
  }

  private checkIsUserLoggedIn(): void {
    const tokenFromStorage = this.localStorage.get<string>('jwt_token');
    const userFromStorage = this.localStorage.get<UserFromAuth>('logged_user');
    if (tokenFromStorage) {
      this._accessToken.next(tokenFromStorage);
      this._loggedInUser.next(userFromStorage);
      this.setRefreshingToken();
    } else {
      this._accessToken.next(null);
    }
  }
}
