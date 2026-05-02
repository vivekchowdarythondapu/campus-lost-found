<div align="center">

# 🎓 Smart Campus Lost & Found Portal
### SRM AP University — AI-Powered Item Matching & Recovery System

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**🔗 Live Demo → [campus-lost-found-gamma.vercel.app](https://campus-lost-found-gamma.vercel.app)**

</div>

---

## 📋 Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [AI Matching Algorithm](#ai-matching-algorithm)
- [Deployment](#deployment)
- [Team](#team)

---

## 📖 About the Project

The **Smart Campus Lost & Found Portal** is a full-stack web application built exclusively for **SRM AP University** students. It replaces the traditional paper-based lost and found system with a modern, AI-powered digital platform.

When a student posts a lost item, the system automatically scans all found items and computes **cosine similarity scores** between text descriptions to identify potential matches. Students are instantly notified via **email and in-app notifications**, and can chat in real-time with the finder to arrange item recovery.

> 🔐 Only students with official **@srmap.edu.in** college email addresses can register.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Matching** | Cosine similarity engine auto-matches lost & found items |
| 💬 **Real-time Chat** | Socket.IO powered instant messaging between students |
| 📧 **Email Alerts** | Automatic email notifications via Nodemailer/Gmail |
| 🔔 **In-App Notifications** | Bell icon with unread count and notification dropdown |
| 🔍 **Advanced Search** | Filter by type, category, location, date range |
| 📱 **QR Code** | Auto-generated QR code per item for easy sharing |
| 📲 **WhatsApp Share** | One-click WhatsApp sharing with pre-formatted message |
| 📊 **Analytics Dashboard** | Charts showing monthly activity, categories, locations |
| 🛡️ **Admin Panel** | Manage all items, users, and view analytics |
| 👤 **User Profiles** | Avatar upload, statistics, password management |
| 📱 **PWA** | Install on mobile/desktop like a native app |
| 🌙 **Dark UI** | Beautiful dark theme with glass morphism design |

---

## 🛠️ Tech Stack

### Frontend
React.js 18     - UI Component Library
Vite 8          - Build Tool & Dev Server
Tailwind CSS    - Utility-first Styling
React Router    - Client-side Navigation
Axios           - HTTP Client
Socket.IO       - Real-time Communication
Recharts        - Analytics Charts
Lucide React    - Icon Library
QRCode.react    - QR Code Generation

### Backend
Node.js 22      - JavaScript Runtime
Express.js 5    - Web Framework
MongoDB Atlas   - NoSQL Database
Mongoose 9      - MongoDB ODM
Socket.IO 4     - WebSocket Server
JWT             - Authentication Tokens
bcryptjs        - Password Hashing
Multer          - File Upload
Cloudinary      - Cloud Image Storage
Nodemailer      - Email Service

---

## 📁 Project Structure
campus-lost-found/
├── client/
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   ├── favicon.svg
│   │   └── vercel.json
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── LostItems.jsx
│   │   │   ├── FoundItems.jsx
│   │   │   ├── PostItem.jsx
│   │   │   ├── ItemDetail.jsx
│   │   │   ├── MyItems.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Matches.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── QRModal.jsx
│   │   │   ├── ShareButtons.jsx
│   │   │   └── InstallPWA.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/
├── config/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
│   ├── authController.js
│   ├── itemController.js
│   ├── chatController.js
│   ├── adminController.js
│   └── profileController.js
├── models/
│   ├── User.js
│   ├── Item.js
│   ├── Message.js
│   └── Notification.js
├── routes/
│   ├── authRoutes.js
│   ├── itemRoutes.js
│   ├── chatRoutes.js
│   ├── adminRoutes.js
│   ├── matchRoutes.js
│   ├── notificationRoutes.js
│   ├── analyticsRoutes.js
│   └── profileRoutes.js
├── middleware/
│   └── authMiddleware.js
├── services/
│   ├── matchService.js
│   └── emailService.js
├── socket/
│   └── socketHandler.js
├── index.js
└── package.json

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16 or above
- npm v8 or above
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Gmail account with App Password enabled

### 1. Clone the repository
```bash
git clone https://github.com/vivekchowdarythondapu/campus-lost-found.git
cd campus-lost-found
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env` file (see Environment Variables section)

```bash
npm run dev
```

Server runs on → http://localhost:5000

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

Client runs on → http://localhost:5173

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail@srmap.edu.in
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit your `.env` file to GitHub. It is already in `.gitignore`.

---

## 📡 API Endpoints

### Authentication
POST   /api/auth/register     Register new student
POST   /api/auth/login        Login and get JWT
GET    /api/auth/profile      Get logged in user profile
PUT    /api/auth/profile      Update user profile

### Items
GET    /api/items             Get all items with filters
POST   /api/items             Post new lost or found item
GET    /api/items/:id         Get single item details
DELETE /api/items/:id         Delete item
PUT    /api/items/:id/status  Update item status

### AI Matches
GET    /api/matches/:itemId   Get AI match results for item

### Chat
GET    /api/chat              Get all conversations
GET    /api/chat/:userId      Get messages with specific user
POST   /api/chat              Send new message

### Notifications
GET    /api/notifications            Get all notifications
GET    /api/notifications/unread     Get unread count
PUT    /api/notifications/read-all   Mark all as read
DELETE /api/notifications/:id        Delete notification

### Admin
GET    /api/admin/stats        Dashboard statistics
GET    /api/admin/items        All items
PUT    /api/admin/items/:id    Update item status
GET    /api/admin/users        All users
DELETE /api/admin/users/:id    Delete user
GET    /api/analytics          Analytics chart data

### Profile
GET    /api/profile    Get user profile with stats
PUT    /api/profile    Update profile and avatar

---

## 🤖 AI Matching Algorithm

The portal uses **Cosine Similarity** to match lost and found items:
Tokenize  — Combine title + description + location → lowercase tokens
Vocabulary — Build union vocabulary of both items' words
Vectorize  — Represent each item as word frequency vector
Compute   — Cosine Similarity = (A · B) / (|A| × |B|)
Filter    — Return items with score > 0.2 (20% threshold), top 5

**Category pre-filtering** ensures only items in the same category are compared, improving both speed and accuracy.

---

## 🌐 Deployment

| Component | Platform | URL |
|-----------|---------|-----|
| Frontend | Vercel | [campus-lost-found-gamma.vercel.app](https://campus-lost-found-gamma.vercel.app) |
| Backend | Render | [campus-lost-found-ml6c.onrender.com](https://campus-lost-found-ml6c.onrender.com) |
| Database | MongoDB Atlas | Cloud M0 Free Cluster |
| Images | Cloudinary | Free Plan |
| Email | Gmail SMTP | via Nodemailer |

> ⚠️ **Note:** Backend is on Render free tier. First request after inactivity may take ~50 seconds to wake up.

---

## 👨‍💻 Team

| Name | Roll Number | Branch |
|------|------------|--------|
| Thondapu Vivek Chowdary | AP23110010213 | CSE |
| Waseem Mohammed | AP23110010174 | CSE |
| Vakula Sri | AP23110010239 | CSE |
| Tejesh Kumar | AP23110010274 | CSE |

**Faculty Guide:** Mr. Himanshu Mishra
**Institution:** SRM University AP, Andhra Pradesh

---

## 📄 License

This project is built for academic purposes at SRM AP University.

---

<div align="center">

Made with ❤️ by Team Campus L&F — SRM AP University

⭐ Star this repo if you found it helpful!

</div>
