import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './services/auth.service'
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.userData().pipe(
      take(1),
      map(user => {
        switch (state.url.split("?")[0].split("/")[1]) {
          case "":
            return true;
          case "home":
            if (!user) {
              this.router.navigate(['/login']);
              return false;
            } else {
              return true;
            }
          case "login":
            if (user) {
              this.router.navigate(['/']);
              return false;
            } else {
              return true;
            }
          case "chat":
            if (!user) {
              this.router.navigate(['/login']);
              return false;
            } else {
              return true;
            }
          default:
            this.router.navigate(['/']);
            return false
        }
      }),
    );
  }
}