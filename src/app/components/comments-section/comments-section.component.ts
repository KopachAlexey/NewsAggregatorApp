import { TokensService } from './../../services/tokens.service';
import { NewComment } from './../../models/new-comment';
import { Comment } from './../../models/comment';
import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { TokenData } from '../../models/token-data';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule, MatListModule,
    CommentComponent],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.scss'
})
export class CommentsSectionComponent implements OnInit {
  private readonly tokensService : TokensService;
  private readonly commentService : CommentService;
  newComment : NewComment = {newsId : '', userId : '', text : '', creationDate : new Date()};
  comments : Comment[] = [];
  tokenData? : TokenData | null;
  @Input() newsId? : string;

  constructor(tokensService : TokensService, commentService : CommentService) {
    this.tokensService = tokensService,
    this.commentService = commentService;
  };

  ngOnInit(): void {
    this.tokensService.getAccessTokenData().subscribe({
      next : (tokenData) => {
        this.tokenData = tokenData;
      },
      error : (err) => {
        console.error('error when get data from token', err);
      }
    })
    this.getCommentsData();
  }

  getCommentsData() : void {
    if(!this.newsId)
      return;
    this.commentService.getCommentsByNewsId(this.newsId).subscribe({
      next : (comments : Comment[]) => {
        this.comments = comments.reverse();
      },
      error : (err) => {
        console.error('Error when get comments for news', err);
      }
    });
  }

  addComment() : void{
    if(!this.tokenData || !this.newsId || this.newComment.text.length < 1)
      return;
    this.newComment.newsId = this.newsId;
    this.newComment.userId = this.tokenData.nameid;
    this.newComment.creationDate = new Date();
    this.commentService.addComment(this.newComment).subscribe({
      next : (response) => {
        if(!this.tokenData)
          return;
        this.comments.unshift({
          text : this.newComment.text,
          userId : this.newComment.userId,
          creationDate : this.newComment.creationDate,
          id : response.id,
          userLogin : this.tokenData?.unique_name,
          userRoleName : this.tokenData?.role,
        });
        this.newComment.text = '';
      },
      error : (err) => {
        console.error('Error when try add new comment', err);
      }
    })
  }
}
