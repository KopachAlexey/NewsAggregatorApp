import { ReactionToComment } from "./reaction-to-comment";

export interface Comment {
  id : string;
  text : string;
  creationDate : Date;
  userId : string;
  userLogin : string;
  userRoleName? : string;
  userCommentReactions? : ReactionToComment[]
}
