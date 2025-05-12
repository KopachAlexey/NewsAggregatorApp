import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
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
  imports: [ReactiveFormsModule, MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule,
    MatCardModule, RouterLink, MatRippleModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly authServices : AuthenticationService;
  private readonly returnUrlService : ReturnUrlService;
  private _isPasswordVisible : boolean = false;
  private snackBar: MatSnackBar;
  loginForm : FormGroup;
  minLoginLenth : number;
  minPasswordLenth : number;
  returnUrl : string = '';

  get isPasswordVisible() : boolean {
    return this._isPasswordVisible;
  }

  ngOnInit(): void {
    window.scrollTo(0 , 0);
  }

  constructor(authServices : AuthenticationService, returnUrlService : ReturnUrlService,
    snackBar: MatSnackBar)
  {
    this.authServices = authServices;
    this.returnUrlService = returnUrlService;
    this.snackBar = snackBar;
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
        this.returnUrlService.returnAfterLogin();
      },
      error : (err : HttpErrorResponse) => {
        console.error("Authentication faild");
        if(err.status === 401) {
          this.snackBar.open('Ошибка: Неверное имя пользователя или пароль', 'ОК', {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top'
          });
        }
        else if(err.status === 400) {
          this.snackBar.open('Ошибка', 'Закрыть', {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top'
          });
        }
        else if(err.status === 500) {
          this.snackBar.open('Ошибка: На сервере произошла ошибка', 'ОК', {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top'
          });
        }
      }
    });
  }
  changePasswordVisibility() : void {
    this._isPasswordVisible = !this._isPasswordVisible;
  }

}
