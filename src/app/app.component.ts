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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule,  AvatarComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly router : Router;
  private readonly returnUrlService : ReturnUrlService;
  private readonly authServices : AuthenticationService
  private readonly tokensService : TokensService;
  userData? : TokenData | null;
  title = 'News Aggregator';
  isAuthenticated : boolean = false;

  constructor(authServices : AuthenticationService, returnUrlService : ReturnUrlService, router : Router, tokensService : TokensService) {
    this.authServices = authServices;
    this.returnUrlService = returnUrlService;
    this.router = router;
    this.tokensService = tokensService;
  }

  ngOnInit() : void {
    this.tokensService.getAccessTokenData().subscribe( {
      next : (tokenData)=> {
        this.userData = tokenData;
        if(tokenData)
          this.isAuthenticated = true;
        else
          this.isAuthenticated = false;
      },
      error : (err) => {
        console.error('error when trying get data from token', err);
      }
    });
  }

  login() : void {
    this.returnUrlService.setReturnUrl();
    this.router.navigate(['/login']);
  }

  logout() : void {
    this.authServices.logout().subscribe({
      next : () => {
        this.isAuthenticated = false;
      },
      error : (err) => {
        console.error("logout faild", err);
      }
    });

  }

}
