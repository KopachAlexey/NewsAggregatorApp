import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewsAggregatorConsts } from '../../models/news-aggregator-consts';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReturnUrlService } from '../../services/return-url.service';
import { RouterLink } from '@angular/router';
import {MatRippleModule} from '@angular/material/core';

@Component({
  selector: 'app-login',
  standalone : true,
  imports: [ReactiveFormsModule, MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatCardModule, RouterLink, MatRippleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authServices : AuthenticationService;
  private readonly returnUrlService : ReturnUrlService;
  private _isPasswordVisible : boolean = false;
  loginForm : FormGroup;
  serverErrors? : string;
  minLoginLenth : number;
  minPasswordLenth : number;
  returnUrl : string = '';

  get isPasswordVisible() : boolean {
    return this._isPasswordVisible;
  }

  constructor(authServices : AuthenticationService, returnUrlService : ReturnUrlService)
  {
    this.authServices = authServices;
    this.returnUrlService = returnUrlService;
    this.minLoginLenth = NewsAggregatorConsts.MinLoginLenth;
    this.minPasswordLenth = NewsAggregatorConsts.MinPasswordLenth;
    this.loginForm = new FormGroup({
      login : new FormControl('', [Validators.required, Validators.minLength(NewsAggregatorConsts.MinLoginLenth)]),
      password : new FormControl('', [Validators.required, Validators.minLength(NewsAggregatorConsts.MinPasswordLenth)])
    });
  }

  login() : void {
    if(this.loginForm.invalid)
      return;
    let login : string = this.loginForm.get<string>('login')?.value;
    let password : string = this.loginForm.get<string>('password')?.value;
    this.authServices.login(password, login).subscribe( {
      next : (tokens) => {
        this.loginForm.reset();
        this.returnUrlService.redirectToReturnUrl();
      },
      error : (err : HttpErrorResponse) => {
        console.error("Authentication faild");
        if(err.status === 401 || err.status === 400) {
          this.serverErrors = NewsAggregatorConsts.LoginFailedMessage
        }
        if(err.status === 500)
          this.serverErrors = NewsAggregatorConsts.ServerErrorMessage;
        this.loginForm.get<string>('password')?.setValue('');
      }
    });
  }

  changePasswordVisibility() : void {
    this._isPasswordVisible = !this._isPasswordVisible;
  }

}
