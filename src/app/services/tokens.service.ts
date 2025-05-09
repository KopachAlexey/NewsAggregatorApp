import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { TokenData } from '../models/token-data';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  private readonly accessTokenKey : string = 'accessToken';
  private readonly refreshTokenKey : string = 'refreshToken';
  private readonly accessTokenExpirationKey : string = 'accessTokenExpiration';

  private accessTokenSubject : BehaviorSubject<string | null>;
  private refreshTokenSubject : BehaviorSubject<string | null>;

  constructor() {
    const accessToken = localStorage.getItem(this.accessTokenKey);
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    this.accessTokenSubject = new BehaviorSubject<string | null>(accessToken);
    this.refreshTokenSubject = new BehaviorSubject<string | null>(refreshToken);
  }

  setTokens(accessToken : string, refreshToken : string, accessTokenExpiration : Date) : void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.accessTokenExpirationKey, accessTokenExpiration.toUTCString());
    this.accessTokenSubject.next(accessToken);
    this.refreshTokenSubject.next(refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.accessTokenExpirationKey);
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
  }

  getAccessTokenData() : Observable<TokenData | null> {
    return this.accessTokenSubject.asObservable().pipe(
      catchError((err) => {
        return throwError( () => err);
      }),
      map((token) => {
        return token? jwtDecode<TokenData>(token) : null;
      }),
    );
  }

  getAccessToken() : string | null {
    return this.accessTokenSubject.value;
  }

  getRefreshToken() : string | null {
    return this.refreshTokenSubject.value;
  }

  isAccessTokenExpired() : boolean | null {
    const accessTokenExpiration = localStorage.getItem(this.accessTokenExpirationKey);
    if(!accessTokenExpiration)
      return null;
    if(new Date() > new Date(accessTokenExpiration))
      return true;
    else
      return false;
  }

}
