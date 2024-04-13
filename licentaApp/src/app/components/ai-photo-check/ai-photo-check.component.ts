import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DescriptionDialogComponent } from "./description-dialog/description-dialog.component";
import { HelpDialogComponent } from "./help-dialog/help-dialog.component";

@Component({
  selector: "app-ai-photo-check",
  templateUrl: "./ai-photo-check.component.html",
  styleUrls: ["./ai-photo-check.component.css"],
})
export class AIPhotoCheckComponent implements OnInit {
  uploadedFile?: File;
  imageUrl: string | ArrayBuffer | null = null;

  mockResults = [
    {
      name: "Actinic keratosis and intraepithelial carcinoma / Bowen's disease",
      shortName: "akiec",
      value: 0,
      description:
        "Actinic Keratoses (AKs), also known as Solar Keratoses, are precancerous skin lesions that typically develop on areas of the skin that have been exposed to the sun over time. If left untreated, some AKs may progress to intraepithelial Carcinoma, also known as Bowen's disease.",
      needsConsult: true,
    },
    {
      name: "Basal cell carcinoma",
      shortName: "bcc",
      value: 0,
      description:
        "Basal cell carcinoma (BCC) is the most common type of skin cancer, accounting for about 80% of all skin cancer cases. It typically develops in areas of the skin that have been exposed to the sun, such as the face, neck, ears, scalp, shoulders, and back. BCC arises from the basal cells, which are found in the deepest layer of the epidermis, the outermost layer of the skin.",
      needsConsult: true,
    },
    {
      name: "Benign keratosis-like lesion",
      shortName: "bkl",
      value: 0.001,
      description:
        "Benign keratosis-like lesions, also known as seborrheic keratoses, are common non-cancerous growths that appear on the skin, especially in older adults. They are usually painless and do not pose any health risks.",
      needsConsult: false,
    },
    {
      name: "Dermatofibroma",
      shortName: "df",
      value: 0,
      description:
        "Dermatofibroma is a common benign skin lesion, often referred to as a fibrous histiocytoma. They are usually harmless and don't require treatment unless they become symptomatic or cosmetically bothersome.",
      needsConsult: false,
    },
    {
      name: "Melanoma",
      shortName: "mel",
      value: 0.003,
      description:
        "Melanoma is a type of skin cancer that originates in melanocytes, the cells responsible for producing melanin, the pigment that gives skin its color. Melanoma is a potentially serious form of skin cancer that requires prompt diagnosis and treatment for the best outcome.",
      needsConsult: true,
    },
    {
      name: "Melanocytic nevus",
      shortName: "nv",
      value: 0.996,
      description:
        "Melanocytic nevi, commonly known as moles, are benign growths on the skin that develop when melanocytes (pigment-producing cells) grow in clusters. Although most moles are benign, it's essential to monitor them for any changes that could indicate skin cancer, such as melanoma.",
      needsConsult: false,
    },
    {
      name: "Vascular lesion",
      shortName: "vasc",
      value: 0,
      description:
        "Vascular lesions are abnormalities in the blood vessels that can occur anywhere in the body. These lesions can vary in size, shape, and severity, and they may present as visible abnormalities on the skin or within deeper tissues.",
      needsConsult: true,
    },
  ];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

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

    reader.onload = (e) => {
      this.imageUrl = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  // Mock method, change later
  getTopResults(): {
    name: string;
    shortName: string;
    value: number;
    description: string;
    needsConsult: boolean;
  }[] {
    const sortedResults = this.mockResults.sort((a, b) => b.value - a.value);

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
