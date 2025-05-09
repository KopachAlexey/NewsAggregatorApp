export interface News {
  id : string;
  headline : string;
  summary? : string;
  content : string;
  publicationDate : Date;
  url : string;
  imageUrl? : string;
  positivityRate? : number;
  sourceName : string;
}
