import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  userId: string | undefined;
  userForm!: FormGroup;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params["userId"];
      console.log("User ID: ", this.userId);

      this.userForm = this.formBuilder.group({
        email: ["", [Validators.required, Validators.email]],
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        sex: ["", [Validators.required]],
        dateOfBirth: ["", [Validators.required]],
        address: this.formBuilder.group({
          street: ["", [Validators.required]],
          city: ["", [Validators.required]],
          state: ["", [Validators.required]],
          postalCode: ["", [Validators.required]],
        }),
        nationality: ["", [Validators.required]],
      });
    });
  }
}
