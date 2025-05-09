import { NewsAggregatorService } from './news-aggregator.service';
import { Injectable } from '@angular/core';
import { NewsFeed } from '../models/news-feed';
import { HttpErrorResponse, HttpParams} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsPagginatorService {
  private newsPageResource : string = 'NewsPagginator';
  private readonly newsAggregator : NewsAggregatorService;

  constructor(newsAggregator : NewsAggregatorService) { this.newsAggregator = newsAggregator}

  getNewsFeed(minRate: number, pageNumber : number, pageSize : number) : Observable<NewsFeed> {
    let params = new HttpParams();
    params = params.appendAll({minRate, pageNumber, pageSize});
    return this.newsAggregator.get<NewsFeed>(this.newsPageResource, params).pipe (
      map(data => new NewsFeed(data.newsCards, data.pageNumber, data.pageSize, data.totalNews)),
      catchError((error : HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
