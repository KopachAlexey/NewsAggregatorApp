export interface NewsCard {
  id : string;
  headline : string;
  summary? : string;
  publicationDate : Date;
  url : string;
  imageUrl : string;
  positivityRate : number;
  sourceName : string;
}
