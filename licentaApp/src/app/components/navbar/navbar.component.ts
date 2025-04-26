import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userId: string | null = null;
  private userSub: Subscription = new Subscription();
  userData$: Observable<UserProfile> = new Observable();
  redirectUrl = this.document.location.origin;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.userId = user ? user.id : null;
      if (this.userId) {
        this.userData$ = this.userService.getUserData(this.userId);
      }
    });

    this.userData$.subscribe((ud) => console.log(ud));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }

  capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  getUserFullName(
    firstName: string | undefined,
    lastName: string | undefined
  ): string {
    if (!firstName || !lastName) {
      return 'Add your name in your profile';
    }
    return firstName.length > 0 && lastName.length > 0
      ? `${lastName} ${firstName}`
      : 'Add your name in your profile';
  }

  getUserRole(userData: any): string {
    return this.userService.getUserRole(userData?.role);
  }

  encodeRedirectUrl(url: string): string {
    return btoa(url);
  }
}
