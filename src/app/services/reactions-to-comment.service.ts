import { Injectable } from '@angular/core';
import { NewsAggregatorService } from './news-aggregator.service';
import { catchError, Observable, throwError } from 'rxjs';
import { ReactionToComment } from '../models/reaction-to-comment';
import { HttpParams } from '@angular/common/http';
import { AddResourceResponse } from '../models/add-resource-response';

@Injectable({
  providedIn: 'root'
})
export class ReactionsToCommentService {
  private getReactionByUserIdResource : string = 'CommentReaction/get-comment-reaction-by-user-id';
  private getReactionsByReactionNameResource : string = 'CommentReaction/get-comment-reactions-by-reaction-name';
  private addReactionResource : string = 'CommentReaction';
  private updateReactionResource : string = 'CommentReaction';
  private readonly newsAggregatorService : NewsAggregatorService

  constructor(newsAggregatorService : NewsAggregatorService) {
    this.newsAggregatorService = newsAggregatorService;
  }

  getReactionByUserId(commentId : string, userId : string) : Observable<ReactionToComment> {
    let params = new HttpParams();
    params = params.appendAll({commentId, userId});
    return this.newsAggregatorService.get<ReactionToComment>(this.getReactionByUserIdResource, params).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  getReactionsByReactionName(commentId : string, reactionName : string) : Observable<ReactionToComment[]> {
    let params = new HttpParams();
    params = params.appendAll({commentId, reactionName});
    return this.newsAggregatorService.get<ReactionToComment[]>(this.getReactionsByReactionNameResource, params).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  addReaction(userId : string, commentId : string, reactionName : string) : Observable<AddResourceResponse> {
    const body = {
      reactionName,
      userId,
      commentId
    };
    return this.newsAggregatorService.post<AddResourceResponse>(this.addReactionResource, body).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  updateReaction(userId : string, commentId : string, reactionName : string) : Observable<void> {
    const body = {
      reactionName,
      userId,
      commentId
    };
    return this.newsAggregatorService.patch<void>(this.updateReactionResource, body).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
}
