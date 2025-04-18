import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from 'src/app/services/auth.service';
import { DOCUMENT } from '@angular/common';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl<any> | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  hidePass: boolean = true;
  hideRepeatPass: boolean = true;
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = '';
  redirectUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/),
        ],
      ],
      repeatPass: [
        '',
        this.isLoginMode
          ? []
          : [Validators.required, this.matchPasswordValidator()],
      ],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const encryptedRedirectUrl = params['obsrdr'] || '';
      if (encryptedRedirectUrl) {
        this.redirectUrl = this.decodeRedirectUrl(encryptedRedirectUrl);
      }
    });
  }

  decodeRedirectUrl(encodedUrl: string): string {
    try {
      const decoded = atob(encodedUrl);
      return decoded;
    } catch (error) {
      return '';
    }
  }

  toggleLoginMode(event: Event) {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;

    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/),
        ],
      ],
      repeatPass: [
        '',
        this.isLoginMode
          ? []
          : [Validators.required, this.matchPasswordValidator()],
      ],
    });
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.isLoading = true;
      const email = this.authForm.get('email')?.value;
      const password = this.authForm!.get('password')?.value;

      let authObs: Observable<AuthResponseData>;

      if (this.isLoginMode) {
        authObs = this.login(email, password);
      } else {
        authObs = this.signup(email, password);
      }

      authObs.subscribe({
        next: () => {
          this.isLoading = false;

          const redirectUrl = this.redirectUrl || '';

          if (redirectUrl && this.isValidUrl(redirectUrl)) {
            this.document.location.href = redirectUrl;
            return;
          } else {
            return this.router.navigate([redirectUrl]);
          }
        },
        error: (errorMessage) => {
          this.error = errorMessage;

          this.isLoading = false;
          this.authForm.reset();
        },
      });
    }
  }

  login(email: string, password: string) {
    return this.authService.login(email, password);
  }

  signup(email: string, password: string) {
    return this.authService.signup(email, password);
  }

  onEnterPressed(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = this.authForm.get('password')?.value;
      const repeatPass = control.value;

      if (!repeatPass) {
        return null;
      }

      const isValid = password === repeatPass;

      return isValid ? null : { mismatch: true };
    };
  }

  updatePasswordsValidators() {
    if (!this.isLoginMode) {
      this.authForm.get('repeatPass')?.updateValueAndValidity();
    }
  }

  private isValidUrl(url: string): boolean {
    return /^https?:\/\//.test(url);
  }
}
