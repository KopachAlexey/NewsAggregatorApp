import { NotFoundComponent } from './components/not-found/not-found.component';
import { Routes } from '@angular/router';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { NewsDetailsComponent } from './components/news-details/news-details.component';
import { LoginComponent } from './components/login/login.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AppSettingsComponent } from './components/app-settings/app-settings.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';

export const routes: Routes = [
  {path: '', redirectTo: '/news-feed?pageNumber=1', pathMatch: 'full'},
  {path: 'news-feed', component: NewsFeedComponent },
  {path: 'news/:id', component: NewsDetailsComponent },
  {path: 'login', component: LoginComponent },
  {path: 'new-user', component: AddUserComponent},
  {path: 'edit-user', component: EditUserComponent},
  {path: 'app-settings', component: AppSettingsComponent},
  {path: '**', component: NotFoundComponent }
];
