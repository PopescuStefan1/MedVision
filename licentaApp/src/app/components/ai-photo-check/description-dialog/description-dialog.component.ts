import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-description-dialog",
  templateUrl: "./description-dialog.component.html",
  styleUrls: ["./description-dialog.component.css"],
})
export class DescriptionDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DescriptionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
