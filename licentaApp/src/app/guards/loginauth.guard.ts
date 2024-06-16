import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of, switchMap, take } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class LoginauthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.waitForAuthStateInitialization().pipe(
      switchMap(() => {
        return this.authService.isAuthenticated();
      }),
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return of(true);
        } else {
          return of(this.router.createUrlTree(["/"]));
        }
      })
    );
  }
}
