import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Contact } from "src/app/models/contact";
import { ContactService } from "src/app/services/contact.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = this.formBuilder.group({});

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private _snackBar: MatSnackBar
  ) {}

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

  onSubmit(): void {
    if (this.contactForm.valid) {
      const contactData: Contact = {
        firstName: this.contactForm.get("firstName")?.value,
        lastName: this.contactForm.get("lastName")?.value,
        email: this.contactForm.get("email")?.value,
        phoneNumber: this.contactForm.get("phoneNumber")?.value,
        message: this.contactForm.get("message")?.value,
        medicProblem: this.contactForm.get("medicProblem")?.value,
        appointmentProblem: this.contactForm.get("appointmentProblem")?.value,
        scheduleProblem: this.contactForm.get("scheduleProblem")?.value,
        accountProblem: this.contactForm.get("accountProblem")?.value,
        otherProblem: this.contactForm.get("otherProblem")?.value,
        medicJoin: this.contactForm.get("medicJoin")?.value,
        otherReason: this.contactForm.get("otherReason")?.value,
      };

      this.contactService.addContactData(contactData).subscribe({
        next: () => {
          this.contactForm.reset();
          this.openSnackBar("Successfully sent your message. A member of our team will review it as soon as possible");
        },
        error: (error) => {
          console.error(error);
          this.openSnackBar("There was an error sending your request. Please try again");
        },
      });
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, undefined, {
      duration: 10000,
    });
  }
}
