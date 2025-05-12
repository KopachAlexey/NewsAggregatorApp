import { NewsCard } from "./news-card";

export class NewsFeed {

  newsCards : NewsCard[];
  pageNumber : number;
  pageSize : number;
  totalNews : number;


  constructor(newsCards : NewsCard[], pageNumber : number, pageSize : number, totalNews : number) {
    this.newsCards = newsCards;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalNews = totalNews;
    this.mapDates();
  }

  public totalPages() : number {
    if(this.pageSize == 0)
      return 0;
    let totalPages : number = Math.round(this.totalNews / this.pageSize);
    return totalPages!= 0? totalPages : 1;
  }

  private mapDates() : void {
    this.newsCards.forEach(newsCard => {
      newsCard.publicationDate = new Date(newsCard.publicationDate);
    });
  }
}
