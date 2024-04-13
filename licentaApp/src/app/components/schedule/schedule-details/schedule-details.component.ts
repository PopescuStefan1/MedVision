import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Appointment } from "src/app/models/appointment";

interface DialogData {
  appointment: Appointment;
  appointmentDuration: number;
}

@Component({
  selector: "app-schedule-details",
  templateUrl: "./schedule-details.component.html",
  styleUrls: ["./schedule-details.component.css"],
})
export class ScheduleDetailsComponent implements OnInit {
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
  mockAnalysisClicked: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private datePipe: DatePipe) {}

  ngOnInit(): void {}

  getAppointmentTimesAsString(date: Date) {
    const endTime = new Date(date);
    endTime.setMinutes(endTime.getMinutes() + this.data.appointmentDuration);

    const startTimeString = this.datePipe.transform(date, "HH:mm");
    const endTimeString = this.datePipe.transform(endTime, "HH:mm");

    return `${startTimeString} - ${endTimeString}`;
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

  onGetAnalysisClick(): void {
    this.mockAnalysisClicked = true;
  }
}
