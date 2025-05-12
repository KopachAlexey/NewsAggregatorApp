import { Component, Input } from '@angular/core';
import { NewsCard } from '../../models/news-card';
import { RouterLink } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../avatar/avatar.component';
import {MatChipsModule} from '@angular/material/chips';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { ReturnUrlService } from '../../services/return-url.service';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, AvatarComponent,
    MatChipsModule
  ],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent {
  private router : Router;
  private returnUrlService : ReturnUrlService;

  @Input() newsCard?: NewsCard

  constructor(router : Router, returnUrlService : ReturnUrlService) {
    this.returnUrlService = returnUrlService;
    this.router = router;
  }

  openDetails(newsId : string) : void {
    this.returnUrlService.setReturnUrl(newsId);
    this.router.navigate(['/news/', newsId]);
  }

  chechIsNewsNews() : boolean {
    if(!this.newsCard)
      return false;
     const hourAgo = new Date().getTime() - 60*60*1000;
     return new Date(this.newsCard.publicationDate).getTime() > hourAgo;
  }
}

