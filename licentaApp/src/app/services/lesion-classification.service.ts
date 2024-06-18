import { Injectable } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LesionClassificationService {
  // mockResults = [
  //   {
  //     name: "Actinic keratosis and intraepithelial carcinoma / Bowen's disease",
  //     shortName: "akiec",
  //     value: 0,
  //     description:
  //       "Actinic Keratoses (AKs), also known as Solar Keratoses, are precancerous skin lesions that typically develop on areas of the skin that have been exposed to the sun over time. If left untreated, some AKs may progress to intraepithelial Carcinoma, also known as Bowen's disease.",
  //     needsConsult: true,
  //   },
  //   {
  //     name: "Basal cell carcinoma",
  //     shortName: "bcc",
  //     value: 0,
  //     description:
  //       "Basal cell carcinoma (BCC) is the most common type of skin cancer, accounting for about 80% of all skin cancer cases. It typically develops in areas of the skin that have been exposed to the sun, such as the face, neck, ears, scalp, shoulders, and back. BCC arises from the basal cells, which are found in the deepest layer of the epidermis, the outermost layer of the skin.",
  //     needsConsult: true,
  //   },
  //   {
  //     name: "Benign keratosis-like lesion",
  //     shortName: "bkl",
  //     value: 0.001,
  //     description:
  //       "Benign keratosis-like lesions, also known as seborrheic keratoses, are common non-cancerous growths that appear on the skin, especially in older adults. They are usually painless and do not pose any health risks.",
  //     needsConsult: false,
  //   },
  //   {
  //     name: "Dermatofibroma",
  //     shortName: "df",
  //     value: 0,
  //     description:
  //       "Dermatofibroma is a common benign skin lesion, often referred to as a fibrous histiocytoma. They are usually harmless and don't require treatment unless they become symptomatic or cosmetically bothersome.",
  //     needsConsult: false,
  //   },
  //   {
  //     name: "Melanoma",
  //     shortName: "mel",
  //     value: 0.003,
  //     description:
  //       "Melanoma is a type of skin cancer that originates in melanocytes, the cells responsible for producing melanin, the pigment that gives skin its color. Melanoma is a potentially serious form of skin cancer that requires prompt diagnosis and treatment for the best outcome.",
  //     needsConsult: true,
  //   },
  //   {
  //     name: "Melanocytic nevus",
  //     shortName: "nv",
  //     value: 0.996,
  //     description:
  //       "Melanocytic nevi, commonly known as moles, are benign growths on the skin that develop when melanocytes (pigment-producing cells) grow in clusters. Although most moles are benign, it's essential to monitor them for any changes that could indicate skin cancer, such as melanoma.",
  //     needsConsult: false,
  //   },
  //   {
  //     name: "Vascular lesion",
  //     shortName: "vasc",
  //     value: 0,
  //     description:
  //       "Vascular lesions are abnormalities in the blood vessels that can occur anywhere in the body. These lesions can vary in size, shape, and severity, and they may present as visible abnormalities on the skin or within deeper tissues.",
  //     needsConsult: true,
  //   },
  // ];
  realResults = [
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
      value: 0,
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
      value: 0,
      description:
        "Melanoma is a type of skin cancer that originates in melanocytes, the cells responsible for producing melanin, the pigment that gives skin its color. Melanoma is a potentially serious form of skin cancer that requires prompt diagnosis and treatment for the best outcome.",
      needsConsult: true,
    },
    {
      name: "Melanocytic nevus",
      shortName: "nv",
      value: 0,
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

  linearModel!: tf.Sequential;
  prediction: any;

  model!: tf.GraphModel;
  predictions: any;

  private predictionStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  predictionStatus$: Observable<boolean> = this.predictionStatusSubject.asObservable();

  private isProcessingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isProcessing$: Observable<boolean> = this.isProcessingSubject.asObservable();

  constructor() {}

  async loadModel() {
    this.model = await tf.loadGraphModel("/assets/resnet50/model.json");
    this.predictionStatusSubject.next(false);
  }

  predict(image: HTMLImageElement): void {
    this.isProcessingSubject.next(true);
    this.predictionStatusSubject.next(false);

    const pred = tf.tidy(() => {
      let img = tf.browser.fromPixels(image);
      img = tf.image.resizeBilinear(img, [224, 224]); // Resize the image to match model input shape
      img = tf.cast(img, "float32");

      // Preprocessing specific to ResNet model
      const meanValues = tf.tensor([103.939, 116.779, 123.68]);
      img = img.sub(meanValues); // Subtract mean RGB values
      img = tf.reverse(img, 2); // Convert RGB to BGR (for models trained on ImageNet)
      img = img.expandDims(); // Expand dimensions to match model input shape (batch size 1)

      const output = this.model.predict(img) as any;

      this.predictions = Array.from(output.dataSync());
    });

    for (let i = 0; i < this.realResults.length; i++) {
      console.log(this.realResults[i].name);
      this.realResults[i].value = this.predictions[i];
    }

    this.predictionStatusSubject.next(true);
    this.isProcessingSubject.next(false);
  }

  predictFromImageUrl(imageUrl: string): void {
    this.predictionStatusSubject.next(false);

    const img = new Image();
    img.onload = () => {
      const imageElement: HTMLImageElement = img;
      this.predict(imageElement);
    };
    img.onerror = () => {
      console.error("Failed to load image from URL:", imageUrl);
    };
    img.src = imageUrl;
    img.crossOrigin = "Anonymous";
  }
}
