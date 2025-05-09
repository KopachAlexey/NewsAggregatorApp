import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactionsToCommentService } from '../../services/reactions-to-comment.service';
import { ReactionToComment } from '../../models/reaction-to-comment';
import { NewReactionToComment } from '../../models/new-reaction-to-comment';
import { TokenData } from '../../models/token-data';

@Component({
  selector: 'app-comments-reactions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './reactions-to-comment.component.html',
  styleUrl: './reactions-to-comment.component.scss'
})
export class ReactionsToCommentComponent implements OnInit {
  readonly likeName : string = 'like';
  readonly dislikeName : string = 'dislike';
  private readonly reactionsToCommentService : ReactionsToCommentService;

  likesReactions : ReactionToComment[] = [];
  dislikesReactions : ReactionToComment[] = [];
  currentUserReaction? : ReactionToComment;
  @Input() commentId? : string;
  @Input() userData? : TokenData;

  @Output() userReactionChanged = new EventEmitter<NewReactionToComment | null>();

  constructor(reactionsToCommentService : ReactionsToCommentService) {
    this.reactionsToCommentService = reactionsToCommentService;
  }

  ngOnInit(): void {
    if(this.commentId) {
      this.reactionsToCommentService.getReactionsByReactionName(this.commentId, this.likeName).subscribe({
        next : (likesReactions) => {
          this.likesReactions = likesReactions;
        },
        error : (err) => {
          console.log('error when trying get like reactions',err);
        }
      });
      this.reactionsToCommentService.getReactionsByReactionName(this.commentId, this.dislikeName).subscribe({
        next : (dislikesReactions) => {
          this.dislikesReactions = dislikesReactions;
        },
        error : (err) => {
          console.log('error when trying get dislike reactions',err);
        }
      });
      if(this.userData)
        this.getUserReaction(this.commentId, this.userData.nameid);
    }
  }

  ChangeReaction(reactionName : string) : void {
    if(!this.userData || !this.commentId)
      return;
    const newReactionToComment : NewReactionToComment = {
      reactionName : reactionName,
      commentId : this.commentId,
      userId : this.userData.nameid
    }
    if(this.currentUserReaction) {
      if(this.currentUserReaction.reactionName === reactionName)
        return;
      this.updateUserReaction(this.currentUserReaction, reactionName);
    }
    else {
      this.addUserReaction(this.commentId, this.userData, reactionName);
    }
  }

  getUserReaction(commentId : string, userId : string) : void {
    this.reactionsToCommentService.getReactionByUserId(commentId, userId).subscribe({
      next : (currentUserReaction) => {
        this.currentUserReaction = currentUserReaction;
      },
      error : (err) => {
        console.log('error when trying get user reaction',err);
      }
    });
  }

  addUserReaction(commentId : string, userData : TokenData, reactionName : string) : void {
    this.reactionsToCommentService.addReaction(userData.nameid, commentId, reactionName).subscribe({
      next : (response) => {
        this.currentUserReaction = {
          id : response.id,
          commentId : commentId,
          userId : userData.nameid,
          userLogin : userData.unique_name,
          reactionName : reactionName
        };
        if(reactionName === this.likeName)
          this.likesReactions.push(this.currentUserReaction);
        else
          this.dislikesReactions.push(this.currentUserReaction)
      },
      error : (err) => {
        console.error('error when trying to add reaction',err);
      }
    });
  }

  updateUserReaction(currentUserReaction : ReactionToComment, newReactionName : string) : void {
    this.reactionsToCommentService.updateReaction(currentUserReaction.userId, currentUserReaction.commentId, newReactionName).subscribe({
      next : () => {
        currentUserReaction.reactionName = newReactionName;
        if(newReactionName === this.likeName) {
          let userReactionIndex : number = this.dislikesReactions.indexOf(currentUserReaction);
          this.dislikesReactions.slice(userReactionIndex, 1);
          this.likesReactions.push(currentUserReaction);
        }
        else {
          let userReactionIndex : number = this.likesReactions.indexOf(currentUserReaction);
          this.likesReactions.slice(userReactionIndex, 1);
          this.dislikesReactions.push(currentUserReaction);
        }
      },
      error : (err) => {
        console.error('error when trying to update reaction',err);
      }
    });
  }
}
