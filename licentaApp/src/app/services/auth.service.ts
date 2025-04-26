// auth.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  mapTo,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserProfile } from '../models/user-profile';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  private authStateInitialized = false;

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {
    this.initAuthListener();
  }

  get user(): Observable<User | null> {
    return this._user.asObservable();
  }

  isAuthenticated() {
    return this.user.pipe(map((user) => !!user));
  }

  private initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        user.getIdTokenResult().then((tokenResult) => {
          const loadedUser = new User(user.email!, user.uid, tokenResult.token);
          this._user.next(loadedUser);
          this.setAutoLogout(
            new Date(tokenResult.expirationTime).getTime() -
              new Date().getTime()
          );
          this.authStateInitialized = true;
        });
      } else {
        this._user.next(null);
        this.authStateInitialized = true;
      }
    });
  }

  signup(email: string, password: string): Observable<any> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      catchError(this.handleError),

      // 1️⃣ after account creation, write profile to Firestore and wait for it
      switchMap((credential) => {
        const { email: userEmail, uid } = credential.user!;
        const userData: UserProfile = {
          email: userEmail ?? '',
          role: this.userService.getUserRole('patient'), // your existing logic
        };
        return this.addUserToFirestore(uid, userData).pipe(
          // once Firestore write completes, pass the original credential along
          mapTo(credential)
        );
      }),

      // 2️⃣ fetch ID token & update local user state
      switchMap((credential) =>
        from(credential.user!.getIdTokenResult()).pipe(
          tap((tokenResult) => {
            const loadedUser = new User(
              credential.user!.email!,
              credential.user!.uid,
              tokenResult.token
            );
            this._user.next(loadedUser);
            this.setAutoLogout(
              new Date(tokenResult.expirationTime).getTime() -
                new Date().getTime()
            );
          }),
          map((tokenResult) => tokenResult.token)
        )
      ),

      // 3️⃣ mint session cookie on the backend
      switchMap((idToken) =>
        this.http.post(
          'https://localhost:3000/sessionLogin',
          { idToken },
          { withCredentials: true }
        )
      )
    );
  }

  private addUserToFirestore(userId: string, userData: any) {
    const userDocRef = this.firestore.collection('users').doc(userId);
    return from(userDocRef.set(userData)).pipe(
      catchError((error) => {
        console.error('Error adding document:', error);
        throw error;
      }),
      tap(() => console.log('Document added successfully!'))
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      catchError(this.handleError),

      // 1️⃣ fetch the ID token, update user state & auto-logout
      switchMap((cred) =>
        from(cred.user!.getIdTokenResult()).pipe(
          tap((tokenResult) => {
            const loadedUser = new User(
              cred.user!.email!,
              cred.user!.uid,
              tokenResult.token
            );
            this._user.next(loadedUser);
            this.setAutoLogout(
              new Date(tokenResult.expirationTime).getTime() -
                new Date().getTime()
            );
          }),
          map((tokenResult) => tokenResult.token)
        )
      ),

      // 2️⃣ send the ID token to backend to mint a session cookie
      switchMap((idToken) =>
        this.http.post(
          'https://localhost:3000/sessionLogin',
          { idToken },
          { withCredentials: true }
        )
      )
    );
  }

  logout(): void {
    from(this.afAuth.signOut()).subscribe(() => {
      this.http
        .post('https://localhost:3000/logout', {}, { withCredentials: true })
        .subscribe({
          next: () => {
            this._user.next(null);
            this.clearAutoLogout();
          },
          error: (error) => {
            console.error('Failed to clear session cookie:', error);
            // Still clear local state even if backend call fails
            this._user.next(null);
            this.clearAutoLogout();
          },
        });
    });
  }

  private setAutoLogout(expirationDuration: number) {
    this.clearAutoLogout();
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private clearAutoLogout() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'There was an error, please try again!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage =
          'The email address is already in use by another account.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid login credentials.';
        break;
      default:
        errorMessage = 'Unknown error.';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }

  waitForAuthStateInitialization(): Observable<boolean> {
    return new Observable((observer) => {
      const checkAuth = () => {
        if (this.authStateInitialized) {
          observer.next(true);
          observer.complete();
        } else {
          setTimeout(checkAuth, 100);
        }
      };
      checkAuth();
    });
  }

  deleteAccount(): Observable<any> {
    return this.http.post(
      'https://localhost:3000/deleteAccount',
      {},
      { withCredentials: true }
    );
  }
}
