import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { User } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-not-authorized",
  templateUrl: "./not-authorized.component.html",
  styleUrls: ["./not-authorized.component.css"],
})
export class NotAuthorizedComponent implements OnInit {
  currentUser: User | null = null;
  userSub: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.currentUser = user;
    });
  }

  onLogoutClick(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  onReturnToMainPageClick(): void {
    this.router.navigate(["/"]);
  }
}
