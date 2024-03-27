import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = this.formBuilder.group({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createContactForm();
  }

  private createContactForm(): void {
    this.contactForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.required, Validators.pattern("^[23467](\\d){8}$")]],
      message: ["", [Validators.required, Validators.minLength(50)]],
      medicProblem: [false],
      appointmentProblem: [false],
      scheduleProblem: [false],
      accountProblem: [false],
      otherProblem: [false],
      medicJoin: [false],
      otherReason: [false],
    });
  }
}
