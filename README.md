# MedVision

This repository contains a modern web application developed as part of a thesis project. The platform streamlines patient management, medical appointments, and provides AI-based skin lesion analysis.

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
