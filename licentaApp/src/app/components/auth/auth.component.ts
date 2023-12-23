import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { AuthService } from "src/app/services/auth.service";

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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.authForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)],
      ],
    });
  }

  ngOnInit(): void {}

  toggleLoginMode(event: Event) {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.login();
    } else {
      this.signup();
    }
  }

  onEnterPressed(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  signup() {
    if (this.authForm.valid) {
      this.isLoading = true;
      const email = this.authForm.get("email")?.value;
      const password = this.authForm!.get("password")?.value;

      this.authService.signup(email, password).subscribe({
        next: (responseData) => {
          console.log(responseData);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.authForm.reset();
          this.isLoading = false;
        },
      });
    }
  }

  login() {
    if (this.authForm.valid) {
      this.authForm.reset();
    }
  }
}
