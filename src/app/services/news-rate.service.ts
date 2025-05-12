import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { NewsAggregatorConsts } from '../models/news-aggregator-consts';

@Injectable({
  providedIn: 'root'
})
export class NewsRateService {

  private readonly newsRateKey : string = 'userNewsRate';

  private newsRateSubject : BehaviorSubject<number>;

  constructor() {
    const newsRateString = localStorage.getItem(this.newsRateKey);
    const newsRate : number = newsRateString? parseFloat(newsRateString)
      : NewsAggregatorConsts.DefaultNewsRate;
    this.newsRateSubject = new BehaviorSubject<number>(newsRate);
  }

  setNewsRate(newsRate :  number) : void {
    localStorage.setItem(this.newsRateKey, newsRate.toFixed(2));
    this.newsRateSubject.next(newsRate);
  }

  clearNewsRate() : void {
    localStorage.removeItem(this.newsRateKey);
    this.newsRateSubject.next(NewsAggregatorConsts.DefaultNewsRate);
  }

  getNewsRate() : Observable<number> {
    return this.newsRateSubject.asObservable().pipe(
      catchError(err => {
        return throwError( () => err);
      })
    );
  }
}
