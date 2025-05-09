import { Injectable, OnInit } from '@angular/core';
import { NewsAggregatorService } from './news-aggregator.service';
import { catchError, Observable, throwError } from 'rxjs';
import { CronJob } from '../models/cron-job';

@Injectable({
  providedIn: 'root'
})
export class BackgraundJobService{
  private startAggregationResource : string = 'NewsAggregator/start-aggregation';
  private stopAggregationResource : string = 'NewsAggregator/stop-aggregation';
  private getAggregationJobsResource : string = 'NewsAggregator/get-aggregation-jobs';

  private startNewsRatingResource : string = 'NewsRater/start-rating';
  private stopNewsRatingResource : string = 'NewsRater/stop-rating';
  private getRatingJobResource : string = 'NewsRater/get-rating-job';

  private startDelExpiredTokensResource : string = 'TokensCleaner/start-deletion-expired-tokens';
  private stopDelExpiredTokensResource : string = 'TokensCleaner/stop-deletion-expired-tokens';
  private getClearTokensJobResource : string = 'TokensCleaner/get-tokens-cleaner-job';

  private readonly newsAggregatorService : NewsAggregatorService;

  constructor(newsAggregatorService : NewsAggregatorService) {
    this.newsAggregatorService = newsAggregatorService;
  }

  public startNewsAggregation() : Observable<void> {
    return this.newsAggregatorService.post<void>(this.startAggregationResource, {}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public stopNewsAggregation() : Observable<void> {
    return this.newsAggregatorService.post<void>(this.stopAggregationResource, {}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public startNewsRating() : Observable<void> {
    return this.newsAggregatorService.post<void>(this.startNewsRatingResource, {}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public stopNewsRating() : Observable<void> {
    return this.newsAggregatorService.post<void>(this.stopNewsRatingResource, {}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public startDelExpiredTokens() : Observable<void> {
    return this.newsAggregatorService.post<void>(this.startDelExpiredTokensResource, {}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public stopDelExpiredTokens() : Observable<void> {
    return this.newsAggregatorService.post<void>(this.stopDelExpiredTokensResource, {}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public getNewsAggregationJobs() : Observable<CronJob[]> {
    return this.newsAggregatorService.get<CronJob[]>(this.getAggregationJobsResource).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public getNewsRatingJob() : Observable<CronJob> {
    return this.newsAggregatorService.get<CronJob>(this.getRatingJobResource).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public getTokensCleanerJob() : Observable<CronJob> {
    return this.newsAggregatorService.get<CronJob>(this.getClearTokensJobResource).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
