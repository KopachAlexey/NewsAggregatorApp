import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsAggregatorService {
  private readonly httpClient : HttpClient

  constructor(httpClient : HttpClient) { this.httpClient = httpClient}

  getResourceUrl(resource : string) : string {
    return environment.apiUrl + resource;
  }

  get<T>(resource : string, params? : HttpParams) : Observable<T> {
    const resourceUrl = this.getResourceUrl(resource);
    return this.httpClient.get<T>(resourceUrl, {params : params});
  }

  post<T>(resource : string, body : object, params? : HttpParams) : Observable<T> {
    const resourceUrl = this.getResourceUrl(resource);
    return this.httpClient.post<T>(resourceUrl, body, {params : params});
  }

  patch<T>(resource : string,  body : object, params? : HttpParams) : Observable<T> {
    const resourceUrl = this.getResourceUrl(resource);
    return this.httpClient.patch<T>(resourceUrl, body, {params : params});
  }

}
