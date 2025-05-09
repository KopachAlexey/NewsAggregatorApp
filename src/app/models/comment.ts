export interface Comment {
  id : string;
  text : string;
  creationDate : Date;
  userId : string;
  userLogin : string;
  userRoleName? : string;
}
