ReadMe for EMA-App and EMA-Service

Table of Contents

Overview

EMA-App

Features

Installation and Setup

Usage

Project Structure

EMA-Service

Features

Installation and Setup

API Endpoints

Project Structure

Contributing

License

Overview

The EMA-App and EMA-Service together form a photo-sharing platform prototype. This project demonstrates features such as user registration, photo uploads, voting, and commenting. While the EMA-App is a client-side React Native application, the EMA-Service is a Node.js-based backend API.

EMA-App

Features

User registration and authentication.

Photo uploads with support for camera and library images.

Voting on and commenting on photos.

Viewing all submitted photos.

Integration with a RESTful backend API (EMA-Service).

Installation and Setup

Clone the repository:

git clone <repository-url>
cd ema-app

Install dependencies:

npm install

Start the development server:

npm start

Launch the app on a connected device or emulator:

npm run android   # For Android
npm run ios       # For iOS

Usage

Open the app on your device/emulator.

Enter your username and register.

Upload photos by selecting images from your library or taking new ones using the camera.

View photos uploaded by other users, vote, and leave comments.

Project Structure

ema-app/
├── components/
│   ├── PhotoEditor.tsx       # Photo editing component
│   ├── ScaledImage.tsx       # Component for scaling and displaying images
├── libraries/
│   ├── PhotoService.ts       # Service library for API interactions
├── App.tsx                   # Main entry point of the app
├── package.json              # Node.js package metadata
└── README.md                 # ReadMe for the project

EMA-Service

Features

RESTful API to support EMA-App functionality.

Endpoints for user registration, photo uploads, voting, and commenting.

In-memory data storage for prototype demonstration.

Error handling and validation for all endpoints.

Installation and Setup

Clone the repository:

git clone <repository-url>
cd ema-service

Install dependencies:

npm install

Start the server:

npm run dev

The API server will be available at http://localhost:3000.

API Endpoints

Method

Endpoint

Description

GET

/photo

Retrieves all photos

GET

/photo/:id

Retrieves a specific photo by ID

POST

/photo

Uploads a new photo

POST

/photo/vote/:id

Adds a vote to a specific photo

POST

/photo/users

Registers a new user

POST

/photo/comment/:id

Adds a comment to a specific photo

Project Structure

ema-service/
├── src/
│   ├── Photo.ts              # Photo class definition
│   ├── server.ts             # Main server file
├── package.json              # Node.js package metadata
├── tsconfig.json             # TypeScript configuration
└── README.md                 # ReadMe for the project

Contributing

Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch:

git checkout -b feature-name

Commit your changes:

git commit -m "Description of changes"

Push to the branch:

git push origin feature-name

Create a Pull Request.
