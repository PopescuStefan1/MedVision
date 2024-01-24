import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  userId: string | undefined;
  userForm!: FormGroup;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params["userId"];
      console.log("User ID: ", this.userId);
    });

    this.userForm = this.formBuilder.group({
      firstName: ["", []],
      email: ["", [Validators.required, Validators.email]],
    });
  }
}
