import { ReturnUrlService } from './../../services/return-url.service';
import { Component, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { ActivatedRoute, Params } from '@angular/router';
import { NewsServices } from '../../services/news.service';
import { Location } from '@angular/common';
import { Comment } from '../../models/comment';
import { CommentsSectionComponent } from '../comments-section/comments-section.component';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { AddCardComponent } from '../add-card/add-card.component';
import { AddCard } from '../../models/add-card';
import { NewsAggregatorConsts } from '../../models/news-aggregator-consts';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../avatar/avatar.component';
import {MatChipsModule} from '@angular/material/chips';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommentsSectionComponent,  MatCardModule, MatButtonModule, AddCardComponent,
    MatIconModule, AvatarComponent, MatChipsModule, MatGridListModule
  ],
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.scss'
})
export class NewsDetailsComponent implements OnInit {
  private activatedRoute: ActivatedRoute;
  private returnUrlService : ReturnUrlService;
  private router : Router;
  private newsServices: NewsServices;
  private sanitizer : DomSanitizer;
  private location : Location;
  news?: News;
  newsId? : string;
  comments? : Comment[];
  newsContent : SafeHtml = '';

  addCards : AddCard[] = NewsAggregatorConsts.addCards;

  constructor(activatedRoute: ActivatedRoute, newsServices: NewsServices, location : Location,
    sanitizer : DomSanitizer, router : Router, returnUrlService : ReturnUrlService
  ) {
    this.returnUrlService = returnUrlService;
    this.activatedRoute = activatedRoute;
    this.router = router;
    this.newsServices = newsServices;
    this.location = location;
    this.sanitizer = sanitizer;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
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
        this.newsContent = this.sanitizer.bypassSecurityTrustHtml(this.news.content);
      },
      error : (err) => {
        console.error("error when try get data for news ", err);
      }
    });
  }

  visibleNewsDate(date : Date) : string {
    return new Date(date).toDateString();
  }

  visibleNewsRate(newsRate : number) : number {
    return Math.round(newsRate * 10 + 50);
  }

  goBack() : void {
    this.returnUrlService.redirectToReturnUrl();
  }
}
