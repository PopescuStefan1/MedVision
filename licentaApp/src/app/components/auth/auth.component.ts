import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "src/app/services/auth.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl<any> | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  hidePass: boolean = true;
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = "";

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.authForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)]],
    });
  }

  ngOnInit(): void {}

  toggleLoginMode(event: Event) {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.isLoading = true;
      const email = this.authForm.get("email")?.value;
      const password = this.authForm!.get("password")?.value;

      let authObs: Observable<AuthResponseData>;

      if (this.isLoginMode) {
        authObs = this.login(email, password);
      } else {
        authObs = this.signup(email, password);
      }

      authObs.subscribe({
        next: (responseData) => {
          console.log(responseData);

          this.isLoading = false;
          this.authForm.reset();
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
}
