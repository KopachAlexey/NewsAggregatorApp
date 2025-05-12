import { NewsAggregatorService } from './news-aggregator.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError,  Observable, throwError, map } from 'rxjs';
import { Comment } from '../models/comment';
import { NewComment } from '../models/new-comment';
import { AddResourceResponse } from '../models/add-resource-response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private getCommentsByNewsIdResource : string = 'Comments/get-comments-by-news-id';
  private addCommentdResource : string = 'Comments/add-comment';
  private readonly newsAggregatorService : NewsAggregatorService

  constructor(newsAggregatorService : NewsAggregatorService) {this.newsAggregatorService = newsAggregatorService}

  getCommentsByNewsId(newsId : string) : Observable<Comment[]> {
    let params = new HttpParams();
    return this.newsAggregatorService.get<Comment[]>(this.getCommentsByNewsIdResource,
      params.appendAll({newsId})).pipe(
      map((comments : Comment[]) => comments.map(comment => ({
        id : comment.id,
        userId : comment.userId,
        creationDate : new Date(comment.creationDate),
        text : comment.text,
        userLogin : comment.userLogin,
        userRoleName : comment.userRoleName,
        userCommentReactions : comment.userCommentReactions
      })),
      catchError((error) => {
        return throwError(() => error);
      }))
    );
  }

  addComment(newComment : NewComment) : Observable<AddResourceResponse> {
    const body = {
      text : newComment.text,
      creationDate : newComment.creationDate,
      newsId : newComment.newsId,
      userId : newComment.userId
    };
    return this.newsAggregatorService
    .post<AddResourceResponse>(this.addCommentdResource, body).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }
}
