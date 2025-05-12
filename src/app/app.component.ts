import { TokensService } from './services/tokens.service';
import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { ReturnUrlService } from './services/return-url.service';
import { Router } from '@angular/router';
import { TokenData } from './models/token-data';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AvatarComponent } from './components/avatar/avatar.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { NewsAggregatorConsts } from './models/news-aggregator-consts';
import { UserService } from './services/user.service';
import { NewsRateService } from './services/news-rate.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule,
    AvatarComponent, RouterLink, MatSliderModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly router : Router;
  private readonly returnUrlService : ReturnUrlService;
  private readonly authServices : AuthenticationService
  private readonly tokensService : TokensService;
  private readonly userService : UserService;
  private readonly newsRateService : NewsRateService;
  newsRate : number = NewsAggregatorConsts.DefaultNewsRate;
  userData? : TokenData | null;
  title = 'News Aggregator';
  isAuthenticated : boolean = false;

  constructor(authServices : AuthenticationService, returnUrlService : ReturnUrlService,
    router : Router, tokensService : TokensService, userService : UserService,
    newsRateService : NewsRateService) {
    this.authServices = authServices;
    this.returnUrlService = returnUrlService;
    this.router = router;
    this.tokensService = tokensService;
    this.newsRateService = newsRateService;
    this.userService = userService;
  }

  ngOnInit() : void {
    this.tokensService.getAccessTokenData().subscribe( {
      next : (tokenData)=> {
        this.userData = tokenData;
        if(tokenData) {
          this.isAuthenticated = true;
          this.setUserNewsRate(tokenData.nameid);
        }
        else {
          this.isAuthenticated = false;
          this.newsRateService.setNewsRate(this.newsRate);
        }
      },
      error : (err) => {
        console.error('error when trying get data from token', err);
      }
    });
  }

  login() : void {
    this.returnUrlService.setReturnUrlAfterLogin();
    this.router.navigate(['/login']);
  }

  logout() : void {
    this.authServices.logout()
    .pipe(
      finalize( () => {
         this.isAuthenticated = false;
         this.tokensService.clearTokens();
         this.newsRateService.clearNewsRate();
         this.router.navigate(['/']);
      })
    )
    .subscribe({
      next : () => {
      },
      error : (err) => {
        console.error("logout faild", err);
      },
    });
  }

  editUser() : void {
    this.router.navigate(['edit-user']);
  }

  onPositivityChange() : void {
    if(!this.userData)
      return;
    this.userService.updateUserNewsRateById(this.userData.nameid, this.newsRate).subscribe({
      next : () => {
        this.newsRateService.setNewsRate(this.newsRate);
      },
      error : (err) => {
        console.error('error when trying update user news rate', err);
      }
    });
  }

  visibleNewsRate() : number {
    return this.newsRate * 10 + 50;
  }

  private setUserNewsRate(userId : string) : void {
    this.userService.getUserById(userId).subscribe( {
      next : (user) => {
        this.newsRateService.setNewsRate(user.newsMinRate);
        this.newsRate = user.newsMinRate;
      },
      error : (err) => {
        console.error('error when trying get user news rate', err);
      }
    });
  }
}
