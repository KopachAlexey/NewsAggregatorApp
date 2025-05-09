import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReturnUrlService {
  private readonly router : Router

  constructor(router : Router) {
    this.router = router;
   }

  clearReurnUrl() : void {
    localStorage.removeItem('returnUrl');
  }

  setReturnUrl() : void {
    localStorage.setItem('returnUrl', this.router.url);
  }

  redirectToReturnUrl() : void {
    let returnUrl = localStorage.getItem('returnUrl');
    this.clearReurnUrl();
    this.router.navigateByUrl(returnUrl ?? '');
  }
}
