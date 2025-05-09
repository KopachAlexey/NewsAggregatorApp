import { CommentService } from './../../services/comment.service';
import { Component, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { ActivatedRoute, Params } from '@angular/router';
import { NewsServices } from '../../services/news.service';
import { Location } from '@angular/common';
import { Comment } from '../../models/comment';
import { CommentsSectionComponent } from '../comments-section/comments-section.component';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommentsSectionComponent,  MatCardModule, MatButtonModule],
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.scss'
})
export class NewsDetailsComponent implements OnInit {
  private activatedRoute: ActivatedRoute;
  private newsServices: NewsServices;
  private location : Location;
  news?: News;
  newsId? : string;
  comments? : Comment[];

  constructor(activatedRoute: ActivatedRoute, newsServices: NewsServices, location : Location) {
    this.activatedRoute = activatedRoute;
    this.newsServices = newsServices;
    this.location = location;
  }

  ngOnInit(): void {
    this.getIdFromRoute();
  }



  getIdFromRoute() : void {
    this.activatedRoute.params.subscribe({
      next : (params : Params) => {
        this.newsId = params["id"];
        this.getNewsData();
      },
      error : (err) => {
        console.error("Error when try get news id from route", err);
      }
    })
  }

  getNewsData() : void {
    if(!this.newsId)
      return;
    this.newsServices.getNews(this.newsId).subscribe({
      next : (news) => {
        this.news = news;
      },
      error : (err) => {
        console.error("error when try get data for news ", err);
      }
    });
  }

  goBack() : void {
    this.location.back();
  }
}
