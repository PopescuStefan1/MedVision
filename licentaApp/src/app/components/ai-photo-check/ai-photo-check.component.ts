import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DescriptionDialogComponent } from "./description-dialog/description-dialog.component";
import { HelpDialogComponent } from "./help-dialog/help-dialog.component";
import { LesionClassificationService } from "src/app/services/lesion-classification.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-ai-photo-check",
  templateUrl: "./ai-photo-check.component.html",
  styleUrls: ["./ai-photo-check.component.css"],
})
export class AIPhotoCheckComponent implements OnInit, OnDestroy {
  uploadedFile?: File;
  imageUrl: string | ArrayBuffer | null = null;
  predictionMade: boolean = false;
  modelLoaded: boolean = false;
  predictionStatusSubscription: Subscription = new Subscription();
  isProcessingSubscription: Subscription = new Subscription();
  isProcessing: boolean = false;

  constructor(public dialog: MatDialog, private lesionClassificationService: LesionClassificationService) {}

  ngOnInit(): void {
    this.predictionStatusSubscription = this.lesionClassificationService.predictionStatus$.subscribe(
      (predictionStatus) => {
        this.predictionMade = predictionStatus;
      }
    );

    this.isProcessingSubscription = this.lesionClassificationService.isProcessing$.subscribe((isProcessing) => {
      this.isProcessing = isProcessing;
      console.log(isProcessing);
    });

    this.lesionClassificationService.loadModel().then(() => {
      this.modelLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.predictionStatusSubscription.unsubscribe();
  }

  onFileChange(event: any): void {
    this.uploadedFile = event.target.files[0];

    this.handleFile(this.uploadedFile);
  }

  onFileDrop(fileList: File[]): void {
    this.uploadedFile = fileList[0];

    this.handleFile(this.uploadedFile);
  }

  private handleFile(file?: File): void {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      this.imageUrl = reader.result;
      img.onload = () => {
        this.lesionClassificationService.predict(img);
      };
      img.src = reader.result as string;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  getTopResults(): {
    name: string;
    shortName: string;
    value: number;
    description: string;
    needsConsult: boolean;
  }[] {
    const sortedResults = [...this.lesionClassificationService.realResults].sort((a, b) => b.value - a.value);

    return sortedResults.slice(0, 3);
  }

  openDescription(name: string, description: string, needsConsult: boolean): void {
    this.dialog.open(DescriptionDialogComponent, {
      width: "600px",
      data: { name: name, description: description, needsConsult: needsConsult },
    });
  }

  openHelpDialog(): void {
    this.dialog.open(HelpDialogComponent, {
      width: "600px",
    });
  }
}
