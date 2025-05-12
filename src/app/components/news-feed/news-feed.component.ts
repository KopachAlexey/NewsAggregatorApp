import { NewsRateService } from './../../services/news-rate.service';
import { NewsPagginatorService } from './../../services/news-pagginator.service';
import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NewsFeed } from '../../models/news-feed';
import { NewsAggregatorConsts } from '../../models/news-aggregator-consts';
import { ActivatedRoute, Params, RouterLink, Router, NavigationStart} from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { AddCardComponent } from '../add-card/add-card.component';
import { AddCard } from '../../models/add-card';
import { RouterModule,} from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [NewsCardComponent, MatGridListModule, MatPaginatorModule, MatSliderModule, FormsModule,
    MatIconModule, MatCardModule, AddCardComponent, MatProgressSpinnerModule, MatSelectModule,
  MatButtonModule],
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.scss'
})
export class NewsFeedComponent implements OnInit, AfterViewInit{

  private newsPagginatorService : NewsPagginatorService;
  private activatedRoute: ActivatedRoute;
  private router : Router;
  private newsRateServices : NewsRateService;
  newsFeed? : NewsFeed;
  currentPage : number = NewsAggregatorConsts.DefaultPageNumber;
  minRate : number = NewsAggregatorConsts.DefaultNewsRate;
  addCards : AddCard[] = NewsAggregatorConsts.addCards;

  constructor(newsPagginatorService : NewsPagginatorService, activatedRoute: ActivatedRoute,
    router : Router, newsRateServices : NewsRateService) {
    this.newsPagginatorService = newsPagginatorService;
    this.activatedRoute = activatedRoute;
    this.router = router;
    this.newsRateServices = newsRateServices;
  }

  ngOnInit(): void {
    this.getqueryParams();
  }

  ngAfterViewInit(): void {

  }

  private loadNewsFeed(minRate: number, pageNumber : number, pageSize : number) : void {
    let newsFeed = this.newsPagginatorService.getNewsFeed(minRate, pageNumber, pageSize);
    newsFeed.subscribe({
      next:  (response : NewsFeed) => {
        this.newsFeed = response;
        this.router.events.subscribe({
          next : (event) => {
            if (event instanceof NavigationStart) {
              const navigation = this.router.getCurrentNavigation();
              const newsId = navigation?.extras?.state?.['elementId'];
              if (newsId) {
                setTimeout(() => {
                  const card = document.getElementById(`${newsId}`);
                  if (card) {
                    card.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 200);
              }
              else {
                window.scrollTo(0 , 0);
              }
            }
          }
        });
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
        this.getNewsRate();
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

  getNewsRate() : void {
    this.newsRateServices.getNewsRate().subscribe({
      next : (newsRate) => {
        this.minRate = newsRate;
        this.loadNewsFeed(this.minRate, this.currentPage, NewsAggregatorConsts.DefaultPageSize);
      },
      error : (err) => {
        console.error('error when trying get current news rate', err);
      }
    });
  }
}
