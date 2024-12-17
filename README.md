# MedVision

This repository contains a modern web application developed as part of a thesis project. The platform streamlines patient management, medical appointments, and provides AI-based skin lesion analysis.

![Medics page](https://github.com/user-attachments/assets/083fc280-3b35-4f88-a2a4-68d5842470a1)
_Medics page_

![image](https://github.com/user-attachments/assets/12604af0-7e0c-4299-a272-209b82215b3f)
_"Create an Appointment" form_

![image](https://github.com/user-attachments/assets/83ea602f-7b03-4c1d-a261-0ff10e11bdb1)
_Automatic completion of user data_

![image](https://github.com/user-attachments/assets/766161e0-d3a6-49e3-ad0f-c283dad600ab)



## Overview

The project addresses inefficiencies in healthcare systems, offering:
1. Simplified appointment scheduling for patients and doctors.
2. An intuitive interface for easy interaction by patients and medical staff.
3. AI-powered diagnostics for presumptive skin lesion analysis using trained neural network models.

## Features

- **Frontend:** Angular, Angular Material, Bootstrap for a responsive and modern UI.
- **Backend:** Firebase for authentication, cloud storage, and database management.
- **AI Integration:** Trained models (ResNet50, EfficientNet, VGG19, etc.) for lesion analysis.
- **Authentication:** Secure login system for different user roles (patients and doctors).
- **Dynamic Pages:**
    - Profile and Appointments Management
    - Doctors List and Details
    - Skin Lesion Analysis Page with AI Results
    - Contact and About Sections

## Technologies

- **Frontend:** Angular, RxJS, TypeScript, Angular Material, Bootstrap
- **Backend:** Firebase (Firestore, Storage, Authentication)
- **AI Models:** TensorFlow, Keras (ResNet50, InceptionV3, EfficientNet, and others)

## AI Skin Lesion Analyzer

- Upload images of skin lesions.
- Receive AI-based presumptive analysis powered by advanced convolutional neural networks.

## Installation

1. Clone the repo:
```
git clone https://github.com/PopescuStefan1/MedVision.git
cd MedVision
```

2. Install dependencies:
```
npm install
```

3. Run the project:
```
ng serve
```

## Author
**Stefan-Tudor Popescu**, 2024
