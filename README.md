# 🏠 Real Estate Management System

A comprehensive, enterprise-grade full-stack web application for real estate property management and transactions. Built with cutting-edge technologies, this platform streamlines the entire real estate workflow—from property listing and discovery to buyer-seller communication and admin oversight.

**What Makes This Special:**

- 🔐 Secure authentication with OTP email verification
- 🏢 Complete property management lifecycle
- 👥 Multi-role access control (Admin, Owner, Buyer)
- 💬 Real-time bidirectional communication with Socket.io
- 🗺️ Interactive maps for property location visualization
- 📊 Advanced admin dashboard with analytics
- ⚡ High-performance React + TypeScript frontend
- 🛡️ Secure Node.js + Express backend
- 🗄️ Normalized MySQL database

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-000000?style=for-the-badge&logo=socket.io&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [User Roles & Use Cases](#-user-roles--use-cases)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Key Features Explained](#-key-features-explained)
- [Real-time Communication](#-real-time-communication)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🎯 Project Overview

This Real Estate Management System is designed to bridge the gap between property owners, buyers, and administrators. It provides a complete ecosystem where:

- **Property Owners** can list their properties, manage inquiries, and communicate with potential buyers
- **Buyers** can browse properties, save favorites, and send inquiries to property owners
- **Administrators** can oversee all listings, approve/reject properties, and manage system users

The platform is built with a scalable architecture supporting thousands of concurrent users with real-time updates and instant messaging capabilities.

## ✨ Features

### 🔐 User Authentication & Authorization

A secure, multi-layered authentication system that protects user accounts and data:

- **User Registration** - Sign up with full name, email, phone, and password. Email verification via OTP ensures only valid email addresses are registered
- **Login System** - Secure JWT-based authentication with token management and refresh token capability
- **OTP Verification** - One-time password sent to email with 10-minute expiration for verified registration
- **Password Reset** - Secure password recovery flow with email verification before allowing password change
- **Change Password** - Authenticated users can change their password anytime
- **Role-Based Access Control** - Three distinct roles:
  - **Admin**: Full system access, property approval, user management
  - **Owner**: Property listing management, inquiry viewing, direct messaging
  - **Buyer**: Property browsing, favorites, inquiry submission

### 🏢 Property Management System

Complete lifecycle management for real estate properties:

- **Property Listings** - Browse all available properties with detailed information including:
  - Property title and description
  - Price and rental rates
  - Location and area (in sqft/sqm)
  - Number of bedrooms and bathrooms
  - Amenities and features
  - Multiple images per property
- **Add Properties** - Property owners can list new properties with:
  - Image upload (multiple images with automatic storage)
  - Detailed property information forms
  - Amenity selection from predefined list
  - Automatic status set to "Pending" for admin review
- **Property Editing** - Update existing property details anytime
- **Property Deletion** - Remove listings (owner or admin only)
- **Property Status Workflow**:
  - `Pending` → Awaiting admin approval
  - `Active` → Listed and visible to all users
  - `Sold` → Property transaction completed
  - `Rejected` → Admin rejected the listing
- **Advanced Property Search** - Filter by:
  - Location and proximity
  - Price range
  - Property type (House, Apartment, Office, Villa)
  - Amenities and features
  - Number of rooms
- **Image Management** - Support for multiple high-quality images with organized storage

### 📍 Interactive Maps & Location Services

- **Property Location Mapping** - Integrated React Leaflet maps showing:
  - Property exact locations
  - Surrounding area information
  - Distance to key landmarks
- **Admin Dashboard Map** - Visual representation of all properties on a map for oversight
- **Location-based Search** - Find properties near specific coordinates
- **Marker Customization** - Color-coded markers based on property status

### ❤️ Favorites & Wishlist System

- **Bookmark Properties** - Save properties of interest with one click
- **Favorites List** - Dedicated page to view all saved properties
- **Quick Access** - Easy navigation from favorites to property details
- **Favorites Count** - Track number of saved properties
- **Persistent Storage** - Favorites saved in database, accessible across sessions

### 💬 Real-Time Messaging & Inquiries

Enterprise-grade communication system powered by Socket.io:

#### Inquiry System

- **Send Inquiries** - Buyers send inquiries to property owners with:
  - Pre-filled inquiry form
  - Property reference
  - Buyer contact information
  - Message content
- **View Inquiries** - Owners see all inquiries for their properties in one place
- **Inquiry Status** - Track inquiry states (New, Pending, Responded, Closed)
- **Inquiry Management** - Mark inquiries as read, prioritize, or archive

#### Real-Time Messaging

- **Instant Chat** - Real-time message exchange between owners and buyers
- **Typing Indicators** - See when someone is typing a response
- **Message History** - Full conversation history preserved
- **Attached Properties** - Messages linked to specific properties for context
- **User Notifications** - Real-time notifications for new messages
- **Online Status** - See when participants are active (future feature ready)

### 📊 Dashboard Analytics

#### Owner Dashboard

- **Property Statistics**:
  - Total properties listed
  - Properties by status (Active, Pending, Sold)
  - Views and inquiries per property
- **Quick Stats Cards** showing:
  - Total inquiries received
  - Pending approvals
  - Recent messages
  - Favorites on your properties
- **Recent Activity Feed** - Latest inquiries and messages
- **Property Management Table** - View, edit, or delete properties
- **Analytics Charts** - Visual representation of performance metrics

#### Admin Dashboard

- **System Overview**:
  - Total registered users
  - Total properties in system
  - Pending approvals queue
  - System health indicators
- **Property Management** with:
  - Interactive map showing all properties
  - Approve/Reject buttons for pending properties
  - Filtering and sorting options
  - Bulk operations capability
- **User Management**:
  - View all registered users
  - User activity tracking
  - Role management
  - User suspension/activation
- **Analytics & Reports**:
  - Properties by status distribution
  - Monthly listings trend
  - User growth metrics
  - Revenue statistics (if applicable)

### 👤 User Profile Management

- **View Profile** - See personal information anytime
- **Edit Profile** - Update name, email, phone, profile picture
- **Profile Picture** - Upload and manage profile avatar
- **Account Settings** - Manage notification preferences and privacy settings
- **Activity History** - View personal activity on the platform

### 🏷️ Property Features & Amenities

- **Predefined Amenities** - System includes common features like:
  - Wi-Fi, Air Conditioning, Parking
  - Garden, Balcony, Security System
  - Swimming Pool, Gym, Elevator
  - Pet-friendly, Furnished, etc.
- **Feature Management** (Admin):
  - Add new amenities to system
  - Delete unused features
  - Organize features in categories
- **Property-Feature Linking** - Each property can have multiple features
- **Feature-based Filtering** - Search properties by amenities

## � User Roles & Use Cases

### 🏡 Property Owners (Sellers/Landlords)

**Who they are:** Individuals or organizations listing properties for sale or rent

**Their Journey:**

1. Sign up with business details
2. Add multiple properties with images and amenities
3. Submit properties for admin approval
4. Receive inquiries from interested buyers
5. Chat with buyers in real-time
6. Manage and update property listings
7. View analytics on property performance
8. Mark properties as sold/unavailable

**Key Pages:**

- Owner Dashboard - Central hub for property management
- Add Property - Create new listings
- Property Details Editor - Modify existing properties
- MyInquiries - View all buyer inquiries
- Chat Interface - Communicate with buyers

---

### 🔍 Buyers (Property Seekers)

**Who they are:** Individuals looking to buy or rent properties

**Their Journey:**

1. Sign up for an account
2. Browse property listings with filters
3. View property details with images and map
4. Add properties to favorites/wishlist
5. Send inquiries to property owners
6. Receive and read messages from owners
7. Chat with owners about property details
8. Schedule viewings through inquiries
9. Compare saved properties in favorites

**Key Pages:**

- Home - Featured and trending properties
- Properties - Browse and search all listings
- PropertyDetails - Comprehensive property information
- Favorites - Saved properties wishlist
- Profile - User account information

---

### 🛡️ Administrators

**Who they are:** System managers and platform moderators

**Their Journey:**

1. Access admin dashboard on login
2. View all pending property listings
3. Review property details, images, and information
4. Approve or reject properties with feedback
5. Monitor all users on the platform
6. Manage amenities and features
7. View system statistics and analytics
8. Handle disputes or issues
9. Generate reports

**Key Pages:**

- Admin Dashboard - System overview and controls
- Properties Map - Visual property management
- User Management - User oversight
- Feature Management - Amenities control

---

## 🏗 Architecture Overview

### Frontend Architecture

```
React Application
    ├── Components Layer (Reusable UI Components)
    ├── Pages Layer (Screen/Route Components)
    ├── State Management
    │   ├── Context API (App-wide state)
    │   └── React Query (Server state)
    ├── API Layer (RESTful API calls)
    ├── Real-time Layer (Socket.io client)
    ├── Styling (Tailwind CSS + Shadcn/ui)
    └── Type System (Full TypeScript coverage)
```

### Backend Architecture

```
Express Server
    ├── Routes Layer (API endpoints)
    ├── Controllers Layer (Business logic)
    ├── Models Layer (Data access)
    ├── Middleware Layer
    │   ├── Authentication (JWT)
    │   ├── File uploads (Multer)
    │   └── Error handling
    ├── Services Layer
    │   ├── Email service (Nodemailer)
    │   └── Utilities
    ├── Socket.io Server (Real-time communication)
    └── Database Connection (MySQL)
```

### Data Flow

```
User Action (Frontend)
    ↓
API Request / Socket Event
    ↓
Backend Route Handler
    ↓
Controller (Business Logic)
    ↓
Model (Database Query)
    ↓
Database (MySQL)
    ↓
Response Back to Frontend
    ↓
UI Update (React Re-render)
```

### Frontend

- **React 18** - Modern UI library with hooks and concurrent rendering
- **TypeScript** - Provides type safety and better developer experience
- **Vite** - Lightning-fast build tool with HMR for rapid development
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion** - Production-ready animation library
- **React Query** - Server state management and caching
- **React Leaflet** - React bindings for Leaflet maps
- **Socket.io Client** - Real-time communication client
- **React Router** - Client-side routing with dynamic code splitting
- **React Hook Form** - Lightweight form state management
- **Shadcn/ui** - High-quality pre-built components

### Backend

- **Node.js** - JavaScript runtime for server-side development
- **Express** - Web framework for building APIs
- **MySQL2** - Efficient MySQL driver with connection pooling
- **Socket.io** - Real-time bidirectional communication
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Secure password hashing and verification
- **Multer** - Middleware for file uploads
- **Nodemailer** - Email service integration
- **CORS** - Cross-origin resource sharing middleware
- **Dotenv** - Environment variable management

### Database

- **MySQL 8.0+** - Relational database with ACID compliance
- **Schema Tables**: Users, Properties, Listings, Favorites, Messages, Inquiries, Features, Amenities
- Normalized design with proper indexing for performance
- Foreign key relationships for data integrity

## 📁 Project Structure

```
RealEstate/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/              # Business logic
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── propertyController.js # Property management
│   │   ├── messageController.js  # Messaging
│   │   ├── inquiryController.js  # Inquiry handling
│   │   ├── admin.controller.js   # Admin functions
│   │   ├── favorite.controller.js# Favorites
│   │   ├── otp.controller.js     # OTP logic
│   │   ├── user.controller.js    # User management
│   │   └── featureController.js  # Feature management
│   ├── models/                   # Data models
│   │   ├── auth.model.js
│   │   ├── propertyModel.js
│   │   ├── message.model.js
│   │   ├── inquiry.model.js
│   │   ├── favorite.model.js
│   │   └── featureModel.js
│   ├── routes/                   # API routes
│   │   ├── auth.routes.js
│   │   ├── propertyRoutes.js
│   │   ├── message.routes.js
│   │   ├── inquiry.routes.js
│   │   ├── admin.routes.js
│   │   ├── favoriteRoutes.js
│   │   ├── otp.routes.js
│   │   └── featureRoutes.js
│   ├── middleware/
│   │   ├── auth.middleware.js    # Authentication middleware
│   │   └── upload.js             # File upload middleware
│   ├── services/
│   │   └── emailService.js       # Email utilities
│   ├── database/                 # Database schemas
│   │   ├── schema2.sql
│   │   └── data.sql
│   ├── uploads/                  # Uploaded files storage
│   ├── server.js                 # Main server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                  # API client code
│   │   │   ├── auth.ts
│   │   │   ├── messages.ts
│   │   │   ├── inquiries.ts
│   │   │   ├── otp.ts
│   │   │   └── utils/
│   │   │       └── fetchWrapper.ts
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ChangePassword.tsx
│   │   │   ├── OTPVerification.tsx
│   │   │   └── ui/               # Radix UI components
│   │   ├── context/
│   │   │   └── FavoritesContext.tsx
│   │   ├── hooks/
│   │   │   └── use-mobile.ts
│   │   ├── lib/
│   │   │   ├── socket.ts         # Socket.io client setup
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Home page
│   │   │   ├── Login.tsx         # Login page
│   │   │   ├── Register.tsx      # Registration page
│   │   │   ├── PropertyDetails.tsx
│   │   │   ├── Properties.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── OwnerDashboard.tsx
│   │   │   ├── MyInquiries.tsx
│   │   │   ├── Favorites.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── AddPropertyPage.tsx
│   │   │   ├── VerifyOTP.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   └── NotFound.tsx
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## �️ Database Schema

### Core Tables Overview

**Users Table**

- Stores user account information (name, email, password hash)
- Tracks user roles (Admin, Owner, Buyer)
- Maintains verification status and OTP details
- Records account creation and modification timestamps

**Properties Table**

- Core property information (title, description, price)
- Location and area details
- Tracks number of bedrooms, bathrooms, and features
- Links to property owner

**Listings Table**

- Extended property details (rental rates, terms)
- Property status (Pending, Active, Sold, Rejected)
- Admin approval tracking
- Enhanced amenities and special features

**Favorites Table**

- User-to-Property relationships
- Tracks which buyers saved which properties
- Enables wishlist functionality

**Messages Table**

- Real-time chat messages between users
- Links to specific inquiries for context
- Timestamps and sender information

**Inquiries Table**

- Property inquiry submissions from buyers
- Links buyer, owner, and property
- Tracks inquiry status and responses
- Communication history

**Features/Amenities Table**

- Predefined amenities (WiFi, AC, Parking, etc.)
- Property-to-Feature relationships
- Admin-managed amenity list

**Relationships:**

```
Users ─────┬──→ Properties (Owner)
           ├──→ Messages (Sender)
           ├──→ Inquiries (Buyer)
           └──→ Favorites

Properties ─┬──→ Listings
            ├──→ Messages
            ├──→ Inquiries
            └──→ Features
```

## �📋 Prerequisites

- **Node.js** v16.0.0 or higher
- **npm** v7.0.0 or higher (or yarn)
- **MySQL** v8.0.0 or higher
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/realEstate.git
cd realEstate
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Setup Database

1. Create a MySQL database named `real_estate`
2. Import the schema files:

```bash
mysql -u root -p real_estate < database/schema2.sql
```

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
# or for production
npm start
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
# The app will typically be available at http://localhost:5173
```

### Build Frontend for Production

```bash
cd frontend
npm run build
npm run preview  # preview the built app
```

## 🔐 Environment Variables

### ⚠️ IMPORTANT: Security Notice
**NEVER commit `.env` files to version control!** Add `.env` to `.gitignore`

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### Backend (.env)

Create a `.env` file in the backend directory with these variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (use your actual credentials)
DB_HOST=<your_mysql_host>
DB_USER=<your_mysql_username>
DB_PASSWORD=<your_mysql_password>
DB_NAME=real_estate

# JWT Configuration (generate a strong secret key)
JWT_SECRET=<generate_a_long_random_string>
JWT_EXPIRE=7d

# Email Service (use Gmail App Password, not regular password)
EMAIL_SERVICE=gmail
EMAIL_USER=<your_gmail@gmail.com>
EMAIL_PASSWORD=<your_gmail_app_password>

# CORS Configuration (update with your production domain)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
CLIENT_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

**How to generate JWT_SECRET:**
```bash
# Linux/macOS
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString()))
```

**For Gmail:**
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the 16-character password in EMAIL_PASSWORD

### Frontend (.env)

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**For Production:**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://yourdomain.com
```

### Environment Variable Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | Yes | `5000` |
| `NODE_ENV` | Node environment | Yes | `development` or `production` |
| `DB_HOST` | MySQL server host | Yes | `localhost` or IP |
| `DB_USER` | MySQL username | Yes | `root` |
| `DB_PASSWORD` | MySQL password | Yes | Your DB password |
| `DB_NAME` | Database name | Yes | `real_estate` |
| `JWT_SECRET` | JWT signing key | Yes | Generated random string |
| `JWT_EXPIRE` | Token expiration | Yes | `7d` |
| `EMAIL_SERVICE` | Email provider | Yes | `gmail` |
| `EMAIL_USER` | Email sender address | Yes | Your Gmail |
| `EMAIL_PASSWORD` | Email app password | Yes | Gmail App Password |
| `CORS_ORIGINS` | Allowed frontend origins | Yes | URLs comma-separated |
| `CLIENT_URL` | Frontend base URL | Yes | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | No | `5242880` (5MB) |
| `UPLOAD_DIR` | File upload directory | No | `./uploads` |

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### OTP

- `POST /api/otp/send` - Send OTP to email
- `POST /api/otp/verify` - Verify OTP

### Properties

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create new property (Owner only)
- `PUT /api/properties/:id` - Update property (Owner only)
- `DELETE /api/properties/:id` - Delete property (Owner/Admin)

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

### Favorites

- `GET /api/favorites` - Get favorite properties
- `POST /api/favorites/:propertyId` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites

### Inquiries

- `GET /api/inquiries` - Get all inquiries
- `POST /api/inquiries` - Create inquiry
- `PUT /api/inquiries/:id` - Update inquiry
- `DELETE /api/inquiries/:id` - Delete inquiry

### Messages

- `GET /api/messages/:inquiryId` - Get messages for inquiry
- `POST /api/messages` - Send message

### Features/Amenities

- `GET /api/features` - Get all features
- `POST /api/features` - Create feature (Admin only)
- `DELETE /api/features/:id` - Delete feature (Admin only)

### Admin

- `GET /api/admin/properties` - Get all properties (Admin only)
- `PUT /api/admin/properties/:id/approve` - Approve property
- `PUT /api/admin/properties/:id/reject` - Reject property
- `GET /api/admin/users` - Get all users
- `GET /api/admin/statistics` - Get system statistics

## 🔑 Key Features Explained

### 🔐 Secure Authentication Flow

**Registration & OTP Verification:**

1. User enters email, password, and basic info
2. System generates 6-digit OTP valid for 10 minutes
3. OTP sent to user's email via Nodemailer
4. User enters OTP to verify email
5. Account created with hashed password (bcryptjs)
6. User can now log in

**Login & JWT Token:**

1. User provides email and password
2. Backend verifies password against stored hash
3. JWT token generated with 7-day expiration
4. Token stored in frontend (localStorage/sessionStorage)
5. Subsequent requests include token in Authorization header
6. Backend validates token with every protected endpoint

**Password Reset:**

1. User requests password reset, provides email
2. Reset link/code sent to email with expiration
3. User follows link and creates new password
4. Old password invalidated, new password hashed
5. User can log in with new credentials

---

### 🏢 Complete Property Lifecycle

**Property Creation by Owner:**

```
1. Owner clicks "Add Property"
   ↓
2. Fill property form with details
   - Basic info (title, description, price)
   - Location and area
   - Bedroom/bathroom count
   - Select amenities
   ↓
3. Upload multiple property images
   - Images stored in backend/uploads
   - File names indexed in database
   ↓
4. Submit for approval
   - Status automatically set to "Pending"
   - Email notification to admins
   ↓
5. Admin reviews property
   - Views all details and images
   - Approves or rejects with feedback
   ↓
6. Status updates to "Active" or "Rejected"
   - Email notification to owner
   - If Active, property visible to all users
```

**Property Browsing by Buyers:**

```
1. Buyer opens Properties page
   ↓
2. Browse with filters:
   - Search by keyword
   - Filter by location
   - Filter by price range
   - Filter by amenities
   ↓
3. View property card preview
   - Image gallery
   - Basic info
   - Quick amenities list
   ↓
4. Click to view full details
   - All images in gallery
   - Complete description
   - Full amenities list
   - Interactive map location
   ↓
5. Actions available:
   - Add to favorites
   - Send inquiry
   - View owner profile
```

---

### 💬 Real-Time Messaging System

**Inquiry-Based Communication:**

```
Buyer sends inquiry
    ↓
Owner receives notification
    ↓
Owner responds in chat
    ↓
Messages linked to specific inquiry
    ↓
Full conversation history preserved
    ↓
Can discuss property details in context
```

**Socket.io Features:**

- **Live Message Delivery** - Messages appear instantly without page refresh
- **Typing Indicators** - Real-time "user is typing" notifications
- **Room-Based Architecture** - Messages organized by inquiry ID
- **Automatic Reconnection** - Handles network interruptions gracefully
- **Offline Support** - Fallback to HTTP polling if WebSocket unavailable

---

### ⭐ Search & Filter System

**Property Discovery:**

- **Text Search** - Search by property title and description
- **Location Filtering** - Filter by city, area, or coordinates
- **Price Range** - Set minimum and maximum price filters
- **Property Type** - Filter by Houses, Apartments, Offices, Villas
- **Amenities** - Select multiple amenities to filter by
- **Advanced Combo** - Combine multiple filters for precise results

---

### 👮 Admin Moderation System

**Property Review Workflow:**

1. Admin logs in to dashboard
2. Views map with all properties marked
3. Color-coded by status (Yellow=Pending, Green=Active, Red=Rejected)
4. Clicks property to view full details
5. Reviews images and information
6. Approves (activates) or Rejects (with reason)
7. Owner receives automated email notification
8. Property status updates in real-time

**User Management:**

- View all registered users
- Check user activity and property count
- Manage user roles and permissions
- Handle reports and disputes

## 🔄 Real-Time Communication

### Socket.io Architecture

**Connection Flow:**

```
Frontend connects to Socket.io server on app launch
    ↓
User authenticates
    ↓
User joins inquiry-specific rooms (inquiry_123, inquiry_456, etc.)
    ↓
Messages sent to room broadcast to all participants
    ↓
Typing events shared in real-time
    ↓
Disconnection handled gracefully with automatic reconnection
```

**Supported Events:**

- `join` - Join an inquiry chat room
- `message` - Send a message
- `typing` - Broadcast typing status
- `disconnect` - Handle user disconnect
- `reconnect` - Handle reconnection attempts

**Example Message Flow:**

```json
{
  "inquiryId": 123,
  "userId": 45,
  "userName": "John Buyer",
  "message": "Is this property still available?",
  "timestamp": "2024-05-07T10:30:00Z",
  "sender_type": "buyer"
}
```

---

## 📋 Common Workflows

### Workflow 1: New Buyer Registration & Property Search

1. **Registration**
   - Open website, click "Register"
   - Fill form: name, email, password, phone
   - Receive OTP on email
   - Verify OTP
   - Account created successfully

2. **Browse Properties**
   - Go to Properties page
   - Apply filters (location, price, amenities)
   - Click property to see details
   - View images and location on map

3. **Saved for Later**
   - Click heart icon to add to favorites
   - Access saved properties anytime from Favorites page

4. **Express Interest**
   - Click "Send Inquiry" on property
   - Owner receives notification
   - Owner responds through chat
   - Arrange property viewing via messages

---

### Workflow 2: Property Owner Listing & Management

1. **Setup Account**
   - Register as property owner
   - Complete profile information
   - Set up profile picture

2. **List Property**
   - Navigate to "Add Property"
   - Fill property details form
   - Upload multiple property images
   - Select amenities from list
   - Submit for approval

3. **Wait for Approval**
   - Admin reviews property (usually within 24 hours)
   - Property transitions to "Active" if approved
   - Owner receives approval notification

4. **Manage Inquiries**
   - View all buyer inquiries in dashboard
   - Chat with interested buyers
   - Answer questions about property
   - Share additional information/schedule viewings

5. **Update Listing**
   - Modify property details anytime
   - Update price if needed
   - Mark as sold when transaction complete

---

### Workflow 3: Admin Property Approval

1. **Login to Dashboard**
   - Admin enters credentials
   - Dashboard loads with pending properties

2. **Review Pending Properties**
   - Map shows all pending listings
   - Click property to expand details
   - Review:
     - Property information accuracy
     - Image quality
     - Amenities validity
     - Owner verification

3. **Make Decision**
   - Click "Approve" to activate listing
   - OR click "Reject" to send back to owner with feedback
   - Add comments if rejecting

4. **Notifications Sent**
   - Owner receives email notification
   - Property status updates in system
   - Active properties appear in buyer searches

---

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use**

```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Database Connection Error**

- Verify MySQL is running: `mysqld --version`
- Check credentials in .env file
- Ensure database `real_estate` exists
- Run: `mysql -u root -p real_estate < database/schema2.sql`

**Email Not Sending**

- Verify EMAIL_SERVICE and EMAIL_USER in .env
- If using Gmail, create App Password (not regular password)
- Check firewall isn't blocking SMTP port (587)
- Verify Nodemailer configuration

**Socket.io Connection Issues**

- Ensure CORS origins are correct in .env
- Check that frontend URL matches CORS_ORIGINS
- Verify socket connection URL in frontend .env

---

### Frontend Issues

**Blank Page or White Screen**

- Check browser console for errors (F12)
- Clear cache and reload (Ctrl+Shift+R)
- Verify Vite dev server is running
- Check that backend API URL is correct in .env

**API Calls Failing**

- Ensure backend server is running (`npm run dev`)
- Check VITE_API_URL in frontend .env matches backend URL
- Verify JWT token is being sent in requests
- Check browser Network tab for request details

**Real-time Messages Not Appearing**

- Verify Socket.io connection is established
- Check browser console for WebSocket errors
- Ensure backend Socket.io server is running
- Verify VITE_SOCKET_URL points to correct backend

**Images Not Loading**

- Check image file paths in database
- Verify backend uploads folder has images
- Ensure UPLOAD_DIR path is correct
- Check file permissions on uploads folder

**TypeScript Errors**

```bash
# Rebuild TypeScript
cd frontend
npx tsc --noEmit

# Check for type issues
npm run lint
```

---

### Database Issues

**Schema Import Fails**

```bash
# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE real_estate;"

# Import schema
mysql -u root -p real_estate < database/schema2.sql
```

**Foreign Key Constraint Error**

- Ensure related records exist before insert
- Check foreign key relationships in schema
- Verify ON DELETE CASCADE settings if needed

**Performance Issues**

- Check if indexes are created: `SHOW INDEX FROM properties;`
- Monitor slow queries: `SET GLOBAL slow_query_log = 'ON';`
- Consider adding indexes on frequently filtered columns

---

### Common Error Messages

| Error                       | Cause                               | Solution                       |
| --------------------------- | ----------------------------------- | ------------------------------ |
| `ECONNREFUSED`              | Backend not running                 | Start backend: `npm run dev`   |
| `Invalid JWT`               | Token expired or invalid            | User needs to login again      |
| `CORS Error`                | Frontend URL not in allowed origins | Update CORS_ORIGINS in .env    |
| `Multer Error`              | File too large                      | Increase MAX_FILE_SIZE in .env |
| `Email Send Failed`         | Email service config wrong          | Verify Nodemailer settings     |
| `Socket connection timeout` | Socket.io server unreachable        | Check socket URL and firewall  |

---

## 🚀 Performance Optimization Tips

1. **Frontend**
   - Use React DevTools Profiler to identify slow components
   - Implement code splitting with React.lazy()
   - Optimize images before upload
   - Enable HTTP caching headers

2. **Backend**
   - Add database indexes on frequently queried columns
   - Implement pagination for large result sets
   - Use connection pooling with MySQL2
   - Monitor and optimize slow queries

3. **Database**
   - Regular backups scheduled
   - Periodic OPTIMIZE TABLE for maintenance
   - Monitor table sizes and growth
   - Archive old data if needed

---

## 🏗 Project Architecture

### Frontend Architecture

- **Component-based**: Reusable UI components using React and Radix UI
- **State Management**: React Query for server state, Context API for client state
- **Styling**: Tailwind CSS with custom Shadcn/ui components
- **Real-time**: Socket.io for instant messaging and notifications
- **Routing**: React Router for client-side navigation
- **Type Safety**: Full TypeScript implementation

### Backend Architecture

- **MVC Pattern**: Models, Controllers, Routes separation
- **Middleware**: Authentication, file upload, error handling
- **Socket.io Integration**: Real-time messaging with room-based communication
- **Database**: Normalized MySQL schema with proper relationships
- **Security**: JWT authentication, password hashing, input validation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards

- Use TypeScript for type safety
- Follow consistent naming conventions
- Write meaningful commit messages
- Test your changes before submitting PR

### Code Style

- Use ES6+ features
- Follow functional programming patterns
- Maintain consistent indentation (2 spaces)
- Use meaningful variable names
- Add comments for complex logic

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support & Contact

For questions or support, please open an issue on the GitHub repository or contact the development team.

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from Radix UI and Shadcn/ui
- Icons from Lucide React
- Maps integration with React Leaflet
- Real-time communication powered by Socket.io

---

**Happy coding! 🚀**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
