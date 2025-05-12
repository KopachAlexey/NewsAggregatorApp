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
    localStorage.removeItem('elementId');
  }

  clearReurnUrlAfterLogin() : void {
    localStorage.removeItem('returnAfterLogin');
  }

  setReturnUrlAfterLogin() : void {
    localStorage.setItem('returnAfterLogin', this.router.url);
  }

  returnAfterLogin() : void {
    let returnUrl = localStorage.getItem('returnAfterLogin');
    this.clearReurnUrlAfterLogin();
    this.router.navigateByUrl(returnUrl ?? '');
  }

  setReturnUrl(elementId? : string) : void {
    localStorage.setItem('returnUrl', this.router.url);
    if(elementId)
      localStorage.setItem('elementId', elementId);
  }

  redirectToReturnUrl() : void {
    let returnUrl = localStorage.getItem('returnUrl');
    let elementId = localStorage.getItem('elementId');
    this.clearReurnUrl();
    if(elementId) {
      this.router.navigateByUrl(returnUrl ?? '' , {
        state : {elementId},
      });
    }
    else {
      this.router.navigateByUrl(returnUrl ?? '');
    }

  }


}
