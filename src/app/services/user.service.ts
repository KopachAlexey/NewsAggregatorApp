import { Injectable } from '@angular/core';
import { NewUser } from '../models/new-user';
import { catchError, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { AddResourceResponse } from '../models/add-resource-response';
import { NewsAggregatorService } from './news-aggregator.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userResource : string = 'User';
  private readonly newsAggregator : NewsAggregatorService;

  constructor(newsAggregator : NewsAggregatorService) {this.newsAggregator = newsAggregator}

  addUser(newUser : NewUser) : Observable<AddResourceResponse> {
    let newUserFromData = new FormData();
    newUserFromData.append('password', newUser.password);
    newUserFromData.append('login', newUser.login);
    newUserFromData.append('email', newUser.email);
    return this.newsAggregator.post<AddResourceResponse>(this.userResource, newUserFromData).pipe(
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }

  getUserById(id : string) : Observable<User> {
    const userResourceById = `${this.userResource}/${id}`;
    return this.newsAggregator.get<User>(userResourceById).pipe(
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }


}
