import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-ai-photo-check",
  templateUrl: "./ai-photo-check.component.html",
  styleUrls: ["./ai-photo-check.component.css"],
})
export class AIPhotoCheckComponent implements OnInit {
  uploadedFile?: File;

  constructor() {}

  ngOnInit(): void {}

  onFileChange(event: any): void {
    this.uploadedFile = event.target.files[0];
    console.log(this.uploadedFile);
  }

  onFileDrop(fileList: File[]): void {
    this.uploadedFile = fileList[0];
    console.log(this.uploadedFile);
  }
}
