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
  private commentResource : string = 'Comments';
  private readonly newsAggregatorService : NewsAggregatorService

  constructor(newsAggregatorService : NewsAggregatorService) {this.newsAggregatorService = newsAggregatorService}

  getCommentsByNewsId(newsId : string) : Observable<Comment[]> {
    let params = new HttpParams();
    return this.newsAggregatorService.get<Comment[]>(this.commentResource, params.appendAll({newsId})).pipe(
      map((comments : Comment[]) => comments.map(comment => ({
        id : comment.id,
        userId : comment.userId,
        creationDate : new Date(comment.creationDate),
        text : comment.text,
        userLogin : comment.userLogin,
        userRoleName : comment.userRoleName
      })),
      catchError((error) => {
        return throwError(() => error);
      }))
    );
  }

  addComment(newComment : NewComment) : Observable<AddResourceResponse> {
    let newCommentData = new FormData();
    newCommentData.append('text', newComment.text);
    newCommentData.append('creationDate', newComment.creationDate.toUTCString());
    newCommentData.append('newsId', newComment.newsId);
    newCommentData.append('userId', newComment.userId);
    return this.newsAggregatorService.post<AddResourceResponse>(this.commentResource, newCommentData).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }
}
