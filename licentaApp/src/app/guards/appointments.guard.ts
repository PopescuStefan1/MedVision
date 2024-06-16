import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, of, switchMap, take } from "rxjs";
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
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          return this.router.createUrlTree(["/not-authorized"]);
        }
      })
    );
  }
}
