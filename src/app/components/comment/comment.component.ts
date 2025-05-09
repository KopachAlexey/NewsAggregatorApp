import { Comment } from './../../models/comment';
import { Component, Input } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { ReactionsToCommentComponent } from '../reactions-to-comment/reactions-to-comment';
import { TokenData } from '../../models/token-data';

@Component({
  selector: 'app-comment',
  imports: [AvatarComponent, ReactionsToCommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() comment? : Comment;
  @Input() userData? : TokenData;
}
