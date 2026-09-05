# 🥭 Mango Traceability System

A full-stack web and mobile-enabled application designed to digitally manage **mango farms, farmer information, cultivation activities, geographical farm boundaries, weather conditions, notifications, and traceability certificates**.

The system provides role-based interfaces for **Farmers, Managers, and Administrators**, allowing agricultural information to be recorded, managed, monitored, and presented through a centralized platform.

---

## 📌 Overview

The **Mango Traceability System (MTS)** is built to digitize and streamline the management of mango farming information.

The platform enables farmers to:

- Register and manage their farms
- Define farm boundaries using geographical coordinates
- Store crop and variety information
- Track important farming activities
- View farm information on interactive maps
- Monitor current and forecast weather conditions
- Receive weather-related notifications
- Generate farm traceability certificates and PDF reports

Administrators can manage users, approve registrations, view farmer and farm information, and modify farm records through a dedicated administration dashboard.

The application also includes an Android wrapper built using **Capacitor**, allowing the web application to be packaged and used as a mobile application.

---

## ✨ Key Features

### 👨‍🌾 Farmer Portal

Farmers have access to a dedicated dashboard for managing their agricultural information.

#### Farm Management

Farmers can:

- Create new farm records
- Provide farm name, crop, variety, and landmark information
- Define farm boundaries using latitude/longitude coordinates
- View their registered farms
- Search and access individual farm records
- Edit farm information
- Delete their own farm records
- View farm area and geographical information

Farm boundaries are stored as geofence coordinates, with a minimum of three coordinates required when registering a farm.

#### Farm Traceability

Farm records can contain information associated with agricultural activities such as:

- Ploughing
- Planting/Sowing
- Flowering
- Pheromone trap
- Lure changes
- Harvest
- Yield
- Other farm-care information

These details are incorporated into generated farm reports and traceability certificates.

#### Weather Monitoring

Farmers can access weather information associated with their farm locations.

The system retrieves:

- Current temperature
- Weather conditions
- Wind information
- Humidity
- Forecast information

Weather data is fetched using the farm's geographical coordinates.

#### Weather Notifications

The backend can periodically evaluate weather conditions for connected users and send weather-related notifications through Socket.IO.

When a farmer connects, the system can immediately retrieve weather information for the farmer's farms and send the corresponding alert information.

---

### 🛡️ Admin Portal

The administrator has centralized control over users and farm information.

Admin capabilities include:

- View system overview
- Manage users
- Search users
- View pending registration requests
- Approve users
- Reject users
- Assign roles such as `Manager` or `Farmer`
- View farmer information
- View manager information
- View farmer farm lists
- View individual farm records
- Add farm information
- Edit farm information
- Delete farm information

The frontend contains dedicated administration routes for user management, pending requests, farmer management, manager information, farm management, and administrator profile management.

The user model explicitly supports the following roles:

```text
Admin
Manager
Farmer
```



---

### 👤 User Authentication & Authorization

The application implements authentication using:

- JWT
- HTTP cookies
- Role-based middleware
- Password hashing using bcrypt
- Email OTP verification
- Phone OTP verification
- Google reCAPTCHA
- Password reset through OTP

Passwords are hashed before being stored using `bcryptjs`, while authentication tokens are generated using JSON Web Tokens.

Dedicated middleware protects Admin and Farmer routes:

```text
authenticateAdmin
authenticateFarmer
authenticateUser
```

The backend also applies rate limiting to authentication and sensitive endpoints.

---

### 🔐 OTP Verification

The system supports OTP-based verification through both:

- Email
- Phone/SMS

Email OTPs are sent using **Nodemailer/Gmail**, while phone OTPs are sent through **Twilio**.

OTP records have a five-minute validity period and are removed after successful verification or expiration.

---

### 📄 Traceability Certificate & PDF Reports

The system provides a dedicated certificate view for individual farms.

A certificate can display information including:

- Farm name
- Farm ID
- Crop
- Farm geographical boundary
- Farm area
- Agricultural activity dates
- Harvest information
- Yield information
- Farmer information

The frontend uses `@react-pdf/renderer` to render certificate documents, while the backend can generate an A4 PDF using **Puppeteer**. 
### QR Code Integration

Certificates can also expose a QR code associated with the farm report.

The QR code points to the generated farm PDF endpoint, allowing the certificate/report to be accessed using the farm identifier.

---

### 🗺️ Geographical Farm Mapping

The application uses geographical coordinates to represent farm boundaries.

Farmers can select coordinates when creating a farm, and the coordinates are stored as:

```text
{
  lat: number,
  lng: number
}
```

The frontend uses **Leaflet** and **React Leaflet** for map-based visualization.

Farm area information can also be displayed alongside the geographical representation of the farm.

---

### 🔔 Real-Time Communication

The application integrates **Socket.IO** for real-time communication.

The backend maintains a mapping between users and their active socket connections and can emit weather notification events to connected users.

```text
weather_notification
```

The frontend initializes the socket connection when an authenticated user is available.

---

### 📧 Email Communication

The backend uses **Nodemailer** for email communication.

Email functionality includes:

- Email OTP verification
- Password recovery OTP
- Contact-us messages
- System-related email communication

Contact-us messages can be forwarded to authenticated administrators through email.

---

### 📱 Android Application

The project includes an Android application wrapper built using **Capacitor**.

The mobile project contains:

- Capacitor Android integration
- Android Gradle configuration
- Android Manifest
- Native Android activity
- WebView-based application container
- Release APK configuration

The Android application uses:

```text
App ID: com.example.mangoapp
App Name: Mango Traceability
```



A release APK configuration is also present in the project with version `1.0`.

---

# 🏗️ System Architecture

The project follows a full-stack architecture consisting of:

```text
                         ┌─────────────────────────┐
                         │       User / Farmer     │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │   Next.js Web Client    │
                         │ TypeScript + React      │
                         └────────────┬────────────┘
                                      │
                         REST API / Socket.IO
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │    Express.js Server    │
                         │ Authentication & APIs   │
                         └────────────┬────────────┘
                                      │
                  ┌───────────────────┼───────────────────┐
                  │                   │                   │
                  ▼                   ▼                   ▼
          ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
          │   MongoDB    │    │  OpenWeather │    │   Twilio /   │
          │   Database   │    │     API      │    │   Nodemailer │
          └──────────────┘    └──────────────┘    └──────────────┘
                                      │
                                      ▼
                              Weather Monitoring
                              & Notifications
```

---

# 🧰 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js 15 | React application framework |
| React 18 | UI development |
| TypeScript | Static typing |
| Tailwind CSS | Utility-first styling |
| Material UI | UI components |
| Redux Toolkit | State management |
| Redux Persist | Persistent client state |
| React Leaflet | Interactive maps |
| Leaflet | Geographical mapping |
| Socket.IO Client | Real-time communication |
| React PDF Renderer | Client-side PDF rendering |
| React QR Code | QR code generation |
| React Google reCAPTCHA | Bot protection |
| Next PWA | Progressive Web App functionality |

The frontend dependencies include Next.js, React, TypeScript, Tailwind CSS, Redux Toolkit, Leaflet, React Leaflet, Socket.IO Client, PDF rendering and QR-code libraries.

---

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email delivery |
| Twilio | SMS/OTP delivery |
| Socket.IO | Real-time communication |
| Puppeteer | PDF generation |
| express-rate-limit | API rate limiting |
| CORS | Cross-origin communication |
| dotenv | Environment configuration |

The backend package configuration includes Express, MongoDB/Mongoose, JWT, bcrypt, Nodemailer, Puppeteer, Socket.IO, Twilio, and rate limiting dependencies.

---

## Mobile

| Technology | Purpose |
|---|---|
| Capacitor | Web-to-mobile application bridge |
| Android | Mobile platform |
| Gradle | Android build system |
| WebView | Application container |

---

## DevOps & Deployment

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container development |
| MongoDB Docker Image | Local database |
| Vercel configuration | Backend/frontend deployment support |
| Node.js 22 | Application runtime |

The Docker Compose configuration defines separate containers for the client, server, and MongoDB database.

---

# 📂 Project Structure

```text
mango_traceability_system/
│
├── docker-compose.yml
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── farmer/
│   │   │   ├── certificate/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── map/
│   │   │   └── contact-us/
│   │   │
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── farmer/
│   │   │   └── common/
│   │   │
│   │   ├── store/
│   │   │   └── features/
│   │   │
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── server/
│   ├── db/
│   ├── functions/
│   ├── middleware/
│   ├── model/
│   ├── notification/
│   ├── router/
│   │   ├── admin/
│   │   ├── common/
│   │   └── farmer/
│   ├── utils/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── vercel.json
│
└── mobile/
    ├── android/
    ├── capacitor.config.json
    ├── package.json
    └── server.js
```

The repository is organized into separate `client`, `server`, and `mobile` applications, with Docker Compose orchestrating the client, server, and MongoDB services. 
---

# 🔄 Application Workflow

## 1. User Registration

```text
User
  │
  ▼
Registration Form
  │
  ├── Email Verification
  │
  ├── Phone Verification
  │
  └── CAPTCHA Verification
  │
  ▼
User Account
  │
  ▼
Admin Review
```

The registration flow includes email and phone OTP mechanisms along with reCAPTCHA integration.

---

## 2. User Authentication

```text
Login
  │
  ▼
Credential Verification
  │
  ▼
JWT Generation
  │
  ▼
HTTP Cookie
  │
  ▼
Role-Based Dashboard
```

JWT authentication is implemented on the server and authentication middleware validates the token from the request cookie before protected routes are accessed.

---

## 3. Farm Registration

```text
Farmer
   │
   ▼
Enter Farm Details
   │
   ├── Farm Name
   ├── Crop
   ├── Variety
   ├── Landmark
   ├── Coordinates
   └── Area
   │
   ▼
Geographical Address Resolution
   │
   ▼
Generate Farm ID
   │
   ▼
Store Farm in MongoDB
```

The backend uses the submitted coordinates to obtain address information and generates a unique farm identifier before saving the farm record.

---

## 4. Weather Monitoring

```text
Farm Coordinates
       │
       ▼
OpenWeatherMap API
       │
       ├── Current Weather
       │
       └── Forecast
       │
       ▼
Weather Processing
       │
       ▼
Farmer Notification
```

Weather information is requested using the farm's geographic center and processed into temperature, weather condition, wind, humidity, and forecast information.

---

## 5. Certificate Generation

```text
Farm ID
   │
   ▼
Fetch Farm Data
   │
   ▼
Certificate View
   │
   ├── Farm Information
   ├── Crop Information
   ├── Farm Activities
   ├── Harvest Data
   └── Geographical Information
   │
   ▼
PDF Generation
   │
   ▼
Download / View / QR Access
```

The backend generates farm reports as A4 PDFs through Puppeteer, while the frontend also provides PDF certificate rendering.

---

# 🔌 API Modules

The backend APIs are organized according to functionality and user role.

## Common APIs

```text
/register-user
/signin-user
/logout
/send-otp-email
/send-otp-phone
/verify-otp-email
/verify-otp-phone
/forgot-password/send-otp-email
/update-password
/certificate-farm-detail
/generate-pdf
/contact-us-mail
/get-notification
```

## Admin APIs

```text
/pending-requests
/user-management
/search-user-management
/search-pending-requests
/farmer-management
/fetch-farmer-farms-list
/fetch-farmer-farm-data
/authenticate-user
/edit-farm-data
/add-farm-data
/delete-farm-data
```

## Farmer APIs

```text
/fetch-farms-list
/fetch-search-farms-list
/fetch-few-farms-list
/fetch-farm-data
/new-farm
/save-farm-data
/delete-farm
```

The frontend API constants demonstrate the separation of common, admin, and farmer API modules.

---

# 🗄️ Data Models

The backend primarily uses MongoDB with Mongoose.

### User

The user model contains information such as:

```text
name
email
phone
password
role
isAuthenticated
isRejected
uniqueID
tokens
createdAt
updatedAt
```

Supported roles:

```text
Admin
Manager
Farmer
```



### Farmer / Farm

Farm records maintain information associated with:

```text
User
Farm
Crop
Variety
Landmark
Address
Geofence Coordinates
Area
Agricultural Activities
Harvest
Yield
```

Each farm receives a generated unique identifier.

### Notification

Notifications contain:

```text
userUniqueId
farmUniqueId
message
read
createdAt
```



---

# 🐳 Running with Docker

The project provides a Docker Compose configuration containing:

```text
Client     → Port 3000
Server     → Port 5000
MongoDB    → Port 27017
```

The MongoDB service uses a persistent Docker volume named:

```text
mongo-data
```



### Start the Application

From the project root:

```bash
docker compose up --build
```

The services will start as:

```text
Frontend  → http://localhost:3000
Backend   → http://localhost:5000
MongoDB   → localhost:27017
```

### Stop the Application

```bash
docker compose down
```

To remove the MongoDB volume as well:

```bash
docker compose down -v
```

---

# 💻 Local Development

## Prerequisites

Make sure the following are installed:

- Node.js 22+
- npm
- MongoDB
- Git

For Android development:

- Android Studio
- Android SDK
- Gradle/Gradle Wrapper

---

## Frontend Setup

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required frontend environment variables.

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

The project is configured to use Next.js with Turbopack for development.

---

## Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file containing the required backend configuration.

Start the backend:

```bash
npm start
```

The server defaults to port `5000` when `PORT` is not provided.

---

# 🔑 Environment Variables

The application requires environment-specific configuration for database access, authentication, external APIs, and communication services.

### Backend

Typical variables used by the backend include:

```env
PORT=5000

DATABASE=<MONGODB_CONNECTION_STRING>

SECRET_KEY=<JWT_SECRET>

EMAIL_ID=<EMAIL_ADDRESS>
PASSWORD=<EMAIL_APP_PASSWORD>

RECAPTCHA_SECRET_KEY=6LceNOMqAAAAAKj1EMZvjxlkKa2_5EJnqjPEfc7C

OPENWEATHER_API_KEY=<OPENWEATHER_API_KEY>

OPENCAGEDATA_API_KEY=<OPENCAGE_API_KEY>
```

### Frontend

```env
NEXT_PUBLIC_BASE_URL=<BACKEND_URL>
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<RECAPTCHA_SITE_KEY>
```

> **Important:** Never commit `.env` files, API keys, passwords, JWT secrets, Twilio credentials, or other sensitive credentials to version control.

---

# 🛡️ Security Considerations

The project incorporates several security mechanisms:

- Password hashing using bcrypt
- JWT-based authentication
- HTTP cookie-based token handling
- Role-specific route middleware
- Email OTP verification
- Google reCAPTCHA
- Authentication rate limiting
- Sensitive-operation rate limiting
- CORS configuration
- Authorization checks for farm operations

For example, protected admin and farmer routes are mounted behind their respective authentication middleware, while sensitive endpoints additionally use rate limiting.

---

# 📱 Mobile Build

The project contains a Capacitor-based Android application.

The mobile application uses the existing web client and provides an Android application container.

The Android project can be opened through Android Studio.

The project uses Gradle `8.12` through the Gradle wrapper.

The generated release artifact is configured as:

```text
app-release.apk
```

with:

```text
Version Name: 1.0
Version Code: 1
```



---

# 🧩 Major Modules

```text
Authentication
     │
     ├── Registration
     ├── Login
     ├── OTP Verification
     ├── Forgot Password
     └── Logout

Farmer Management
     │
     ├── Farm Registration
     ├── Farm Editing
     ├── Farm Deletion
     ├── Farm Search
     └── Farm Details

Geospatial Management
     │
     ├── Farm Coordinates
     ├── Geofencing
     ├── Map Visualization
     └── Farm Area

Weather Management
     │
     ├── Current Weather
     ├── Forecast
     ├── Weather Processing
     └── Real-Time Alerts

Traceability
     │
     ├── Farm Activities
     ├── Harvest Information
     ├── Certificate
     ├── PDF Report
     └── QR Code

Administration
     │
     ├── User Management
     ├── Pending Requests
     ├── Role Assignment
     ├── Farmer Management
     └── Farm Management
```

---

# 📊 Technology Architecture

```text
                    ┌─────────────────────┐
                    │      End Users      │
                    │ Farmer / Admin /    │
                    │       Manager       │
                    └──────────┬──────────┘
                               │
                               ▼
                 ┌──────────────────────────┐
                 │      Next.js Client      │
                 │                          │
                 │ React + TypeScript       │
                 │ Tailwind + Material UI   │
                 │ Redux + Leaflet          │
                 └────────────┬─────────────┘
                              │
                     REST / Socket.IO
                              │
                              ▼
                 ┌──────────────────────────┐
                 │      Node.js Server      │
                 │        Express.js        │
                 │                          │
                 │ Auth / APIs / Middleware │
                 │ Notifications / PDF      │
                 └──────┬──────┬──────┬─────┘
                        │      │      │
                        ▼      ▼      ▼
                   MongoDB  Weather  Messaging
                             API      Services
                             
                        │
                        ▼
                  ┌─────────────┐
                  │  Capacitor  │
                  │   Android   │
                  └─────────────┘
```

---

# 🚀 Deployment

The project contains deployment configuration for both client and server applications.

The backend includes a `vercel.json` configuration that maps incoming requests to `index.js`.

For production deployment:

1. Configure production environment variables.
2. Configure the MongoDB production database.
3. Configure the frontend API base URL.
4. Configure external services such as:
   - OpenWeatherMap
   - OpenCage
   - Gmail/Nodemailer
   - Google reCAPTCHA
5. Build and deploy the frontend.
6. Deploy the backend.
7. Update the frontend API URL to point to the deployed backend.
8. Configure Socket.IO and CORS for the production domains.

---

# 📈 Future Improvements

The current architecture provides a strong foundation for further development.

Potential improvements include:

- Complete traceability across the entire mango supply chain
- Batch and shipment tracking
- QR-based consumer traceability
- Harvest-to-market tracking
- Role-specific Manager workflows
- Advanced analytics dashboards
- Historical weather analytics
- Automated agricultural recommendations
- Improved notification rules
- Audit logs for farm-data modifications
- Cloud object storage for agricultural documents/images
- Automated CI/CD pipelines
- Comprehensive automated testing
- Production-grade background job processing
- Centralized logging and monitoring

---

# 🤝 Contribution

Contributions are welcome.

### 1. Fork the repository

```bash
git fork <repository-url>
```

### 2. Clone the repository

```bash
git clone <repository-url>
```

### 3. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 4. Make your changes

### 5. Commit your changes

```bash
git add .
git commit -m "feat: add your feature"
```

### 6. Push the branch

```bash
git push origin feature/your-feature
```

### 7. Open a Pull Request

---

# 👨‍💻 Project Highlights

This project demonstrates practical implementation of:

- Full-stack application architecture
- Next.js and TypeScript development
- RESTful API development
- MongoDB data modeling
- JWT authentication
- Role-based authorization
- OTP-based verification
- Geospatial farm mapping
- External API integration
- Weather monitoring
- Real-time communication with Socket.IO
- PDF report generation
- QR code integration
- Progressive Web App capabilities
- Android application packaging with Capacitor
- Docker-based development environment

---

## 🌱 Built for Digital Agriculture

**Mango Traceability System** brings farm information, geographical data, weather intelligence, user management, and traceability documentation together into a single digital platform.

```text
Farm Data
    +
Geospatial Information
    +
Agricultural Activities
    +
Weather Intelligence
    +
Digital Certificates
    =
Mango Traceability System
```

---
