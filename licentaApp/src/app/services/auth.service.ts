import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, finalize, from, map, tap, throwError } from "rxjs";
import { User } from "../models/user.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { UserProfile } from "../models/user-profile";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {}

  get user(): Observable<User | null> {
    return this._user.asObservable();
  }

  updateUser(user: User | null, expirationTime?: number): void {
    this._user.next(user);

    if (user && expirationTime) {
      this.autoLogout(expirationTime);
    }
  }

  isAuthenticated(): boolean {
    const userData = localStorage.getItem("userData");
    return !!userData;
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDE8NW8L3l2Rtf0chpZqlUWZVwBPxSm18I",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          );

          const userData: UserProfile = {
            email: responseData.email,
            role: "patient",
          };

          this.addUserToFirestore(responseData.localId, userData).subscribe();
        })
      );
  }

  private addUserToFirestore(userId: string, userData: any) {
    const userDocRef = this.firestore.collection("users").doc(userId);

    return from(userDocRef.set(userData)).pipe(
      catchError((error) => {
        console.error("Error adding document:", error);
        throw error;
      }),
      finalize(() => {
        console.log("Document added successfully!");
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDE8NW8L3l2Rtf0chpZqlUWZVwBPxSm18I",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userString = localStorage.getItem("userData");
    if (!userString) {
      return;
    }

    const userData = JSON.parse(userString);
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      const expirationDuration = loadedUser._tokenExpirationDate.getTime() - new Date().getTime();
      this.updateUser(loadedUser, expirationDuration);
    } else {
      localStorage.removeItem("userData");
    }
  }

  logout(): void {
    localStorage.removeItem("userData");
    this.updateUser(null);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private async handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    localStorage.setItem("userData", JSON.stringify(user));
    this.updateUser(user, expiresIn * 1000);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage: string = `There was an error, please try again! Error: `;
    if (!errorResponse.error || !errorResponse.error.error) {
      const err = new Error(errorMessage);
      return throwError(() => err);
    }
    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage += "The email address is already in use by another account.";
        break;
      case "INVALID_LOGIN_CREDENTIALS":
        errorMessage += "Invalid login credentials";
        break;
      default:
        errorMessage += "Unknown error.";
        break;
    }

    const err = new Error(errorMessage);
    return throwError(() => err);
  }
}
