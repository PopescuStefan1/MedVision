import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of, switchMap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: "root",
})
export class AppointmentsGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.waitForAuthStateInitialization().pipe(
      switchMap(() => {
        return this.authService.isAuthenticated();
      }),
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(true); // Wrap boolean value in observable
        } else {
          return of(this.router.createUrlTree(["/not-authorized"])); // Wrap UrlTree value in observable
        }
      })
    );
  }
}
