import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of, switchMap, take } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProfileGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.waitForAuthStateInitialization().pipe(
      switchMap(() => {
        return this.authService.user.pipe(
          take(1),
          switchMap((user) => {
            if (user) {
              const userId = user.id;
              const requestedUserId = route.paramMap.get("userId");

              if (userId === requestedUserId) {
                return of(true);
              } else {
                return of(this.router.createUrlTree(["profile", userId]));
              }
            } else {
              return of(this.router.createUrlTree(["/not-authorized"]));
            }
          })
        );
      })
    );
  }
}
