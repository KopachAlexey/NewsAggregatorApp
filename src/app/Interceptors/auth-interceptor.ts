import { TokensService } from './../services/tokens.service';
import { HttpInterceptorFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) : Observable<HttpEvent<unknown>> => {
  const tokensServices = inject(TokensService);
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const accessToken = tokensServices.getAccessToken();
  const refreshToke = tokensServices.getRefreshToken();
  const authReq = accessToken?
    req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      })
    : req;
  const isTokenExpired = tokensServices.isAccessTokenExpired();
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToke && isTokenExpired && req.url != 'https://localhost:7032/api/Authentication/update-tokens') {
        return authService.refreshTokens(accessToken, refreshToke).pipe(
          switchMap(() => {
            const newAccessToken = tokensServices.getAccessToken();
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` },
            });
            console.log('succesful token refreshing');
            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            console.error('error when refresh token', refreshError)
            tokensServices.clearTokens();
            router.navigate(['login']);
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
