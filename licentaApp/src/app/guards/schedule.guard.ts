import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of, switchMap, take } from "rxjs";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: "root",
})
export class ScheduleGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          return this.userService.getUserData(user.id).pipe(
            switchMap((userData) => {
              if (userData.role === "patient") {
                return of(this.router.createUrlTree(["/not-authorized"]));
              } else {
                return of(true);
              }
            })
          );
        } else {
          return of(this.router.createUrlTree(["/not-authorized"]));
        }
      })
    );
  }
}
