import { NewsAggregatorService } from './news-aggregator.service';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { News } from '../models/news';

@Injectable({
  providedIn: 'root'
})
export class NewsServices {
  private newsResource : string = 'News';
  private readonly newsAggregator : NewsAggregatorService;

  constructor(newsAggregator : NewsAggregatorService) {this.newsAggregator = newsAggregator}

  getNews(id: string) : Observable<News> {
    const newsResourceById =`${this.newsResource}/${id}`
    return this.newsAggregator.get<News>(newsResourceById).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

}
