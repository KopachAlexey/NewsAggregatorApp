import { Injectable } from '@angular/core';
import { NewUser } from '../models/new-user';
import { catchError, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { AddResourceResponse } from '../models/add-resource-response';
import { NewsAggregatorService } from './news-aggregator.service';
import { EditUser } from '../models/edit-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userResource : string = 'User';
  private updateUserNewsRareResource : string = 'User/update-user-news-rate';
  private readonly newsAggregator : NewsAggregatorService;

  constructor(newsAggregator : NewsAggregatorService) {this.newsAggregator = newsAggregator}

  addUser(newUser : NewUser) : Observable<AddResourceResponse> {
    const body = {
      password : newUser.password,
      login : newUser.login,
      email : newUser.email
    };
    return this.newsAggregator
    .post<AddResourceResponse>(this.userResource, body).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getUserById(id : string) : Observable<User> {
    const userResourceById = `${this.userResource}/${id}`;
    return this.newsAggregator.get<User>(userResourceById).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  editUserById(id : string, editUser : EditUser) : Observable<void> {
    const userResourceById = `${this.userResource}/${id}`;
    return this.newsAggregator.patch<void>(userResourceById, editUser).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  updateUserNewsRateById(id : string, newsRate : number) : Observable<void> {
    const userResourceById = `${this.updateUserNewsRareResource}/${id}`
    return this.newsAggregator.patch<void>(userResourceById, {newsRate}).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
