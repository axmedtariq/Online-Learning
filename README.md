# E-LEARN | Professional MERN Stack Learning Management System

![E-LEARN Banner](https://via.placeholder.com/1000x300/6b21a8/ffffff?text=E-LEARN+Fullstack+Platform)

A modern, high-performance E-learning platform built using the **MERN** stack (MongoDB, Express, React, Node.js). The application features a beautiful **Purple & White** UI, secure instructor verification, Stripe payment integration, and real-time course progress tracking.

---

## ✨ Key Features

### 🛡️ Authentication & Authorization
- **Multi-Role System:** Distinct flows for Students, Instructors, and Admin.
- **Admin Verification:** Instructors can only upload content after manual Admin approval.
- **Secure JWT Auth:** Token-based authentication with bcrypt password hashing.
- **Social Login:** Google SSO integration for fast access.
- **Password Recovery:** Secure "Forgot Password" flow using Nodemailer and signed tokens.

### 🎓 Learning Experience
- **Professional Video Player:** Sidebar curriculum navigation with Udemy-style layout.
- **Auto-Next Logic:** Automatically marks lessons as complete and advances to the next video.
- **Progress Tracking:** Persistent progress storage in MongoDB.
- **Course Preview:** Public landing pages for courses with video previews.

### 💳 Payments & Security
- **Stripe Integration:** Secure checkout flow for purchasing courses.
- **Webhooks:** Automated enrollment fulfillment upon successful payment.
- **RBAC:** Strict backend middleware preventing students from accessing instructor tools.

---

## 🚀 Tech Stack

| Frontend | Backend | Database/Tools |
| :--- | :--- | :--- |
| React.js (Hooks & Context) | Node.js | MongoDB (Mongoose) |
| Tailwind CSS | Express.js | Cloudinary (Video/Images) |
| Axios | JWT | Stripe API |
| React Icons | Nodemailer | Stripe CLI |

---

## 📂 Project Structure



```text
elearning-app/
├── client/                # React Frontend
│   ├── src/
│   │   ├── api/          # Axios service functions
│   │   ├── components/   # Reusable UI (Navbar, Footer)
│   │   ├── pages/        # Main Views (Home, Login, Watch)
│   │   └── middleware/   # Frontend Route Protection
└── server/                # Node.js Backend
    ├── controllers/      # Business Logic
    ├── models/           # MongoDB Schemas
    ├── routes/           # API Endpoints
    └── middleware/       # JWT & Role verification
