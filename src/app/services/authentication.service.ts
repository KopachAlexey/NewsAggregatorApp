import { TokensService } from './tokens.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Tokens } from '../models/tokens';
import { NewsAggregatorService } from './news-aggregator.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loginResource : string = 'Authentication/login';
  private logoutResource : string = 'Authentication/logout';
  private refreshTokenResource : string = 'Authentication/update-tokens';
  private readonly newsAggregatorService : NewsAggregatorService
  private readonly tokensService : TokensService;

  constructor(newsAggregatorService : NewsAggregatorService, tokensService : TokensService)
  {
    this.newsAggregatorService = newsAggregatorService;
    this.tokensService = tokensService;
  }

  login(password : string, login : string) : Observable<Tokens> {
    const body = {password, login};
    return this.newsAggregatorService
    .post<Tokens>(this.loginResource, body).pipe(
      catchError((error : HttpErrorResponse) => {
        return throwError( () => error)
      }),
      tap((tokens) => {
        this.tokensService.setTokens(
          tokens.accessToken,
          tokens.refreshToken,
          new Date(tokens.accessTokenExpiration)
        );
      })
    );
  }

  logout() : Observable<void> {
    return this.newsAggregatorService.post<void>(this.logoutResource, {}).pipe(
      catchError((error : HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  refreshTokens(accessToken : string | null, refreshToken : string | null) : Observable<Tokens>{
    const body = {
      accessToken : accessToken,
      refreshToken : refreshToken
    }
    return this.newsAggregatorService.post<Tokens>(this.refreshTokenResource, body).pipe(
      catchError((error : HttpErrorResponse) => {
        return throwError(() => error)
      }),
      tap((tokens) => {
        this.tokensService.setTokens(
          tokens.accessToken,
          tokens.refreshToken,
          new Date(tokens.accessTokenExpiration)
        );
      })
    );
  }

}
