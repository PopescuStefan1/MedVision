import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from "rxjs";
import { User } from "../models/user.model";

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

  get user(): Observable<User | null> {
    return this._user.asObservable();
  }

  constructor(private http: HttpClient) {}

  updateUser(user: User | null): void {
    this._user.next(user);
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

  logout(): void {
    this.updateUser(null);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.updateUser(user);
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
