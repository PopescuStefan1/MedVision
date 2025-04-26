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
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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
  hidePass = true;
  hideRepeatPass = true;
  isLoginMode = true;
  isLoading = false;
  error = '';
  redirectUrl = '';

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
        try {
          this.redirectUrl = atob(encryptedRedirectUrl);
        } catch {
          this.redirectUrl = '';
        }
      }
    });
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
    if (!this.authForm.valid) {
      return;
    }
    this.isLoading = true;
    this.error = '';

    const email = this.authForm.get('email')!.value;
    const password = this.authForm.get('password')!.value;

    let authObs: Observable<any>;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: () => {
        this.isLoading = false;

        const redirect = this.redirectUrl || '';
        if (redirect && this.isValidUrl(redirect)) {
          this.document.location.href = redirect;
        } else {
          this.router.navigate([redirect]);
        }
      },
      error: (errMsg: string) => {
        this.error = errMsg;
        this.isLoading = false;
        this.authForm.reset();
      },
    });
  }

  onEnterPressed(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pwd = this.authForm.get('password')!.value;
      const rpt = control.value;
      if (!rpt) {
        return null;
      }
      return pwd === rpt ? null : { mismatch: true };
    };
  }

  private isValidUrl(url: string): boolean {
    return /^https?:\/\//.test(url);
  }

  updatePasswordsValidators() {
    if (!this.isLoginMode) {
      this.authForm.get('repeatPass')?.updateValueAndValidity();
    }
  }
}
