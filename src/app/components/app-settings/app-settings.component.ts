import { BackgraundJobService } from '../../services/backgraund-job.service';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule, MatSlideToggleChange} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CronJob } from '../../models/cron-job';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, FormsModule],
  templateUrl: './app-settings.component.html',
  styleUrl: './app-settings.component.scss'
})
export class AppSettingsComponent implements OnInit{

  private readonly backgraundJobService : BackgraundJobService;

  aggregationJobs : CronJob[];
  isAggregationActive : boolean;
  isRatingActive : boolean;
  isDelExpiredTokensActive : boolean;

  constructor(backgraundJobService : BackgraundJobService) {
    this.backgraundJobService = backgraundJobService;
    this.isAggregationActive = false;
    this.isRatingActive = false;
    this.isDelExpiredTokensActive = false;
    this.aggregationJobs = [];
  }

  ngOnInit() : void {

    this.backgraundJobService.getNewsAggregationJobs().subscribe({
      next : (aggregationJobs => {
        this.aggregationJobs = aggregationJobs;
        for(let job of aggregationJobs) {
          if(job.isRunning)
            this.isAggregationActive = true;
        }
      }),
      error : (err => {
        this.isAggregationActive = false;
        console.error('error when try get aggregation jobs', err);
      })
    });

    this.backgraundJobService.getNewsRatingJob().subscribe({
      next : (ratingJob => {
        this.isRatingActive = ratingJob.isRunning;
      }),
      error : (err => {
        this.isRatingActive = false;
        console.error('error when try get rating job', err);
      })
    });

    this.backgraundJobService.getTokensCleanerJob().subscribe({
      next : (tokensCleanerJob => {
        this.isDelExpiredTokensActive = tokensCleanerJob.isRunning;
      }),
      error : (err => {
        this.isDelExpiredTokensActive = false;
        console.error('error when try get tokens cleaner job', err);
      })
    });
    window.scrollTo(0 , 0);
  }

  onAggregationChanged(event: MatSlideToggleChange) : void {
    if(this.isAggregationActive) {
      this.backgraundJobService.startNewsAggregation().subscribe( {
        next : (() => {

        }),
        error : (err => {
          this.isAggregationActive = false;
          console.error('error when try start news aggregation', err);
        })
      });
    }
    else
    {
      this.backgraundJobService.stopNewsAggregation().subscribe( {
        next : (() => {

        }),
        error : (err => {
          this.isAggregationActive = true;
          console.error('error when try stop news aggregation', err);
        })
      });
    }
  }

  onRatingChanged(event: MatSlideToggleChange) : void {
   if(this.isRatingActive) {
    this.backgraundJobService.startNewsRating().subscribe( {
      next : (() => {

      }),
      error : (err => {
        this.isRatingActive = false;
        console.error('error when try start news rating', err);
      })
    });
    }
    else
    {
      this.backgraundJobService.stopNewsRating().subscribe( {
        next : (() => {

        }),
        error : (err => {
          this.isRatingActive = true;
          console.error('error when try stop news rating', err);
        })
      });
    }
  }

  onDelExpiredTokensChanged(event: MatSlideToggleChange) : void {
    if(this.isDelExpiredTokensActive) {
      this.backgraundJobService.startDelExpiredTokens().subscribe( {
        next : (() => {

        }),
        error : (err => {
          this.isDelExpiredTokensActive = false;
          console.error('error when try start del expired tokens', err);
        })
      });
    }
    else
    {
      this.backgraundJobService.stopDelExpiredTokens().subscribe( {
        next : (() => {

        }),
        error : (err => {
          this.isDelExpiredTokensActive = true;
          console.error('error when try stop del expired tokens', err);
        })
      });
    }
  }

}
