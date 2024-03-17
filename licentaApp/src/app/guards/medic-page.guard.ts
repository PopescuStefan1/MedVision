import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, of, switchMap, take } from "rxjs";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: "root",
})
export class MedicPageGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          const userId = user.id;
          const requestedUserId = route.paramMap.get("userId");

          return this.userService.getUserData(user.id).pipe(
            take(1),
            map((userData) => {
              if (userData && userData.role === "medic") {
                if (userId === requestedUserId) {
                  return true;
                } else {
                  return this.router.createUrlTree(["medic-page", user.id]);
                }
              } else {
                return this.router.createUrlTree(["not-authorized"]);
              }
            })
          );
        } else {
          return of(this.router.createUrlTree(["not-authorized"]));
        }
      })
    );
  }
}
