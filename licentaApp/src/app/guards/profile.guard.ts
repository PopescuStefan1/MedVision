import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
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
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        if (user) {
          const userId = user.id;
          const requestedUserId = route.paramMap.get("userId");

          if (!requestedUserId || userId === requestedUserId) {
            return true;
          } else {
            return this.router.createUrlTree(["profile", userId]);
          }
        } else {
          return this.router.createUrlTree(["/login"]);
        }
      })
    );
  }
}
