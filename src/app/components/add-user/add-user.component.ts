import { AuthenticationService } from './../../services/authentication.service';
import { NewUser } from './../../models/new-user';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ErrorResponse } from '../../models/error-response';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { NewsAggregatorConsts } from '../../models/news-aggregator-consts';
import { ReturnUrlService } from '../../services/return-url.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule,  MatIconModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  private readonly authServices : AuthenticationService;
  private readonly userServices : UserService;
  private readonly returnUrlService : ReturnUrlService;
  private _isPasswordVisible : boolean = false;
  private _isRepeatPasswordVisible : boolean = false;
  serverErrors : string[] =[];
  newUser? : NewUser;
  id? : string;
  addUserForm : FormGroup;
  minLoginLenth : number;
  minPasswordLenth : number;

  get isPasswordVisible() : boolean {
    return this._isPasswordVisible;
  }

  get isRepeatPasswordVisible() : boolean {
    return this._isRepeatPasswordVisible;
  }

  constructor(userServices : UserService, returnUrlService : ReturnUrlService, authServices : AuthenticationService) {
    this.userServices = userServices;
    this.minLoginLenth = NewsAggregatorConsts.MinLoginLenth;
    this.minPasswordLenth = NewsAggregatorConsts.MinPasswordLenth;
    this.returnUrlService = returnUrlService;
    this.authServices = authServices;
    this.addUserForm = new FormGroup({
      login : new FormControl('',[Validators.required, Validators.minLength(NewsAggregatorConsts.MinLoginLenth)]),
      email : new FormControl('',[Validators.required, Validators.email]),
      password : new FormControl('',[Validators.required, Validators.minLength(NewsAggregatorConsts.MinPasswordLenth)]),
      repeatPassword : new FormControl('',[Validators.required])
    },
    {
      validators: this.checkPasswordConfirmed
    }
  );
  }

  private checkPasswordConfirmed(addUserForm : AbstractControl) : ValidationErrors | null {
    let password : string = addUserForm.get<string>('password')?.value;
    let repeatPassword : string = addUserForm.get<string>('repeatPassword')?.value;
    if(password === repeatPassword)
      return null;
    else {
      addUserForm.get<string>('repeatPassword')?.setErrors({mismatch : true});
      return  {mismatch : true};
    }
  }

  addUser() : void {
    if(this.addUserForm.invalid)
      return;
    this.newUser = {
      email : this.addUserForm.get<string>('email')?.value,
      login : this.addUserForm.get<string>('login')?.value,
      password : this.addUserForm.get<string>('password')?.value
    }
    this.serverErrors = [];
    this.userServices.addUser(this.newUser).subscribe({
      next : (response) => {
        this.id = response.id;
        this.addUserForm.reset();
        this.loginNewUser();
      },
      error : (error : HttpErrorResponse) => {
        if(error.status === 409) {
          const responseError = error.error as ErrorResponse
          if(responseError.messages) {
            responseError.messages.forEach((message) => {
              this.serverErrors.push(message);
            })
          }
        }
        this.addUserForm.get('password')?.setValue('');
        this.addUserForm.get('repeatPassword')?.setValue('');
        console.error('Error when try add user', error);
      }
    });

  }

  private loginNewUser() : void {
    if(!this.newUser)
      return;
    this.authServices.login(this.newUser.password, this.newUser.login).subscribe({
      next : () => {
        this.returnUrlService.redirectToReturnUrl();
      },
      error : (err : HttpErrorResponse) => {
        console.error("Authentication, after add user, faild");
      }
    });
  }

  changePasswordVisibility() : void {
    this._isPasswordVisible = !this._isPasswordVisible;
  }

  changeRepeatPasswordVisibility() : void {
    this._isRepeatPasswordVisible = !this._isRepeatPasswordVisible;
  }
}
