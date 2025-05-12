import { AuthenticationService } from './../../services/authentication.service';
import { EditUser } from '../../models/edit-user';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ErrorResponse } from '../../models/error-response';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { NewsAggregatorConsts } from '../../models/news-aggregator-consts';
import { ReturnUrlService } from '../../services/return-url.service';
import { TokensService } from '../../services/tokens.service';
import { TokenData } from '../../models/token-data';
@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule,
    MatIconModule, MatSnackBarModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  private readonly authServices : AuthenticationService;
  private readonly userServices : UserService;
  private readonly returnUrlService : ReturnUrlService;
  private readonly tokensService : TokensService;
  private _isPasswordVisible : boolean = false;
  private _isneWPasswordVisible : boolean = false;
  private _isRepeatPasswordVisible : boolean = false;
  private snackBar: MatSnackBar;
  userData? : TokenData | null;
  editUserData? : EditUser;
  editUserForm : FormGroup;
  minLoginLenth : number;
  minPasswordLenth : number;

  get isPasswordVisible() : boolean {
    return this._isPasswordVisible;
  }

  get isneWPasswordVisible() : boolean {
    return this._isneWPasswordVisible;
  }

  get isRepeatPasswordVisible() : boolean {
    return this._isRepeatPasswordVisible;
  }


  constructor(userServices : UserService, returnUrlService : ReturnUrlService,
    authServices : AuthenticationService, tokensService : TokensService, snackBar: MatSnackBar) {
    this.userServices = userServices;
    this.returnUrlService = returnUrlService;
    this.authServices = authServices;
    this.tokensService = tokensService;
    this.snackBar = snackBar;
    this.minLoginLenth = NewsAggregatorConsts.MinLoginLenth;
    this.minPasswordLenth = NewsAggregatorConsts.MinPasswordLenth;
     this.editUserForm = new FormGroup({
      login : new FormControl('',[Validators.minLength(NewsAggregatorConsts.MinLoginLenth)]),
      email : new FormControl('',[Validators.email]),
      password : new FormControl('',[Validators.required, Validators.minLength(NewsAggregatorConsts.MinPasswordLenth)]),
      newPassword : new FormControl('',[Validators.minLength(NewsAggregatorConsts.MinPasswordLenth)]),
      repeatPassword : new FormControl('')
    },
    {
      validators: [
        this.checkPasswordConfirmed,
        this.checkNewUserDataExists
      ]
    });
  }

  ngOnInit() : void {
    this.tokensService.getAccessTokenData().subscribe( {
      next : (tokenData) => {
        this.userData = tokenData;
      },
      error : (err) => {
        console.error('error when trying get data from token', err);
      }
    });
  }

  private checkPasswordConfirmed(editUserForm : AbstractControl) : ValidationErrors | null {
    let password : string = editUserForm.get<string>('newPassword')?.value;
    let repeatPassword : string = editUserForm.get<string>('repeatPassword')?.value;
    if(password === repeatPassword)
      return null;
    else {
      editUserForm.get<string>('repeatPassword')?.setErrors({mismatch : true});
      return  {mismatch : true};
    }
  }

  private checkNewUserDataExists(editUserForm : AbstractControl) : ValidationErrors | null {
    let newPassword : string = editUserForm.get<string>('newPassword')?.value;
    let newEmail : string =  editUserForm.get<string>('email')?.value;
    let newLogin : string =  editUserForm.get<string>('login')?.value;
    if(newLogin === '' && newEmail === '' && newPassword === '') {
      editUserForm.setErrors({newDataEmpty : true});
      return  {newDataEmpty : true};;
    }
    else
      return null;
  }

  editUser() : void {
    if(this.checkNewUserDataExists(this.editUserForm)) {
      this.snackBar.open('Нет данных для изменения', 'ОК', {
        panelClass: ['info-snackbar'],
        duration: 3000,
        verticalPosition: 'top'
      });
    }
    if(this.editUserForm.invalid || !this.userData)
      return;
    const newEmail : string | undefined = this.editUserForm.get<string>('email')?.value === ''? null
      : this.editUserForm.get<string>('email')?.value;
    const newLogin : string | undefined = this.editUserForm.get<string>('login')?.value === ''? null
      : this.editUserForm.get<string>('login')?.value;
    const newPassword : string | undefined = this.editUserForm.get<string>('newPassword')?.value === ''? null
      : this.editUserForm.get<string>('newPassword')?.value;
    this.editUserData = {
      email : newEmail,
      login : newLogin,
      password : this.editUserForm.get<string>('password')?.value,
      newPassword : newPassword
    }
    this.userServices.editUserById(this.userData.nameid, this.editUserData).subscribe({
      next : () => {
        this.editUserForm.reset();
        this.loginEditUser();
      },
      error : (error : HttpErrorResponse) => {
        if(error.status === 409) {
          this.snackBar.open('Ошибка: Пользователь с такими данными уже существует', 'ОК', {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top'
          });
        }
        else if(error.status === 401) {
          this.snackBar.open('Ошибка: Неверный пароль', 'ОК', {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top'
          });
        }
        else if(error.status === 400) {
          this.snackBar.open('Ошибка', 'Закрыть', {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top'
          });
        }
        else if(error.status === 500) {
          this.snackBar.open('Ошибка: На сервере произошла ошибка', 'ОК', {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top'
          });
        }
        this.editUserForm.get('password')?.setValue('');
        this.editUserForm.get('newPassword')?.setValue('');
        this.editUserForm.get('repeatPassword')?.setValue('');
        console.error('Error when try add user', error);
      }
    });
  }

  private loginEditUser() : void {
    if(!this.editUserData || !this.userData)
      return;
    const login = this.editUserData.login?? this.userData?.unique_name;
    const password = this.editUserData.newPassword?? this.editUserData.password;
    this.authServices.login(password, login).subscribe({
      next : () => {
        this.snackBar.open('Изменения прошли успешно!', 'OK', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      },
      error : (err : HttpErrorResponse) => {
        console.error("Authentication, after edit user, faild");
      }
    });
  }

  goBack() : void {
    this.returnUrlService.redirectToReturnUrl();
  }

  changePasswordVisibility() : void {
    this._isPasswordVisible = !this._isPasswordVisible;
  }

  changeneWPasswordVisibility() : void {
    this._isneWPasswordVisible = !this._isneWPasswordVisible;
  }

  changeRepeatPasswordVisibility() : void {
    this._isRepeatPasswordVisible = !this._isRepeatPasswordVisible;
  }

}
