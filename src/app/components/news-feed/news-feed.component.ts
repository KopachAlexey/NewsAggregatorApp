import { NewsPagginatorService } from './../../services/news-pagginator.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NewsFeed } from '../../models/news-feed';
import { NewsAggregatorConsts } from '../../models/news-aggregator-consts';
import { ActivatedRoute, Params, RouterLink, Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [NewsCardComponent, MatGridListModule, MatPaginatorModule, MatSliderModule, FormsModule, MatIconModule, MatSliderModule],
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.scss'
})
export class NewsFeedComponent implements OnInit{

  private newsPagginatorService : NewsPagginatorService;
  private activatedRoute: ActivatedRoute;
  private router : Router;
  newsFeed? : NewsFeed;
  currentPage : number = NewsAggregatorConsts.DefaultPageNumber;
  minRate : number = NewsAggregatorConsts.DefaultNewsRate;

  //@ViewChild(MatPaginator) matPagginator! : MatPaginator;

  constructor(newsPagginatorService : NewsPagginatorService, activatedRoute: ActivatedRoute, router : Router) {
    this.newsPagginatorService = newsPagginatorService;
    this.activatedRoute = activatedRoute;
    this.router = router;
  }

  ngOnInit(): void {
    this.getqueryParams();
  }

  private loadNewsFeed(minRate: number, pageNumber : number, pageSize : number) : void {
    let newsFeed = this.newsPagginatorService.getNewsFeed(minRate, pageNumber, pageSize);
    newsFeed.subscribe({
      next:  (response : NewsFeed) => {
        this.newsFeed = response;
      },
      error : (err) => {
        console.error('error when load news feed data', err);
      }
    });
  }

  getqueryParams() : void {
    this.activatedRoute.queryParams.subscribe({
      next: (params : Params) => {
        let currentPage = parseInt(params["pageNumber"]);
        if(!Number.isNaN(currentPage) && currentPage >= NewsAggregatorConsts.DefaultPageNumber)
          this.currentPage = currentPage;
        this.loadNewsFeed(this.minRate, this.currentPage, NewsAggregatorConsts.DefaultPageSize);
      },
      error: (err) => {
        console.log('no news feed queryParams', err);
      }
    }
    );
  }

  pageEventHandler(event : PageEvent) : void {
    let nextPage : number = event.pageIndex + 1;
    this.router.navigate(
      ['/news-feed'],
      {
        queryParams : {
          'pageNumber' : nextPage
        }
      }
    );
    window.scroll(0,0);
  }

  onPositivityChange() {
    this.loadNewsFeed(this.minRate, this.currentPage, NewsAggregatorConsts.DefaultPageSize);
  }

}
