# 🌿 EcoSwap - Community Plant Swapping Ecosystem

A high-performance, full-stack **Next.js 14** application engineered for the modern green community. EcoSwap offers a comprehensive ecosystem for plant enthusiasts to discover, swap, and manage their collections. The project features a refined **Tactile Minimalism** architecture, utilizing a specialized palette of Forest Green, Terracotta, and Cream, optimized for hardware efficiency and premium user experience.

## 🚀 Live Links

* **Production Application (Vercel):** [https://eco-swap-omega.vercel.app/](https://eco-swap-omega.vercel.app/)
* **GitHub Repository:** [https://github.com/islamrakibul9274/EcoSwap](https://github.com/islamrakibul9274/eco-swap)

---

## ✨ Key Features

### 🌿 Community Member Features
* **Plant Discovery:** Advanced search and real-time filtering by plant type, keyword, and availability.
* **High-Fidelity Profiles:** Detailed plant listings featuring image galleries (via ImgBB), care requirements, and owner info.
* **Swap Lifecycle:** Complete request-to-completion workflow with real-time status updates.
* **Social & Gamification:** Personal wishlist management, XP gain system, and a community leaderboard to reward active swappers.

### 🏡 Gardener Dashboard Features
* **Inventory Management:** Dedicated "My Plants" suite for adding, editing, and archiving personal plant listings.
* **Real-Time Communication:** Instant messaging powered by **Pusher** with live chat, read receipts, and typing indicators.
* **Request Handling:** Optimized interface for managing incoming and outgoing swap requests with optimistic UI updates.
* **Live Notifications:** In-app and email notification system for new requests, accepted swaps, and messages.

### 🛡️ Admin "Command Center"
* **Content Moderation:** Centralized pipeline for reviewing listings, managing reported content, and site-wide moderation.
* **User Management:** Granular control over platform users, including role assignments (User, Moderator, Admin).
* **Analytics Dashboard:** Real-time data visualization for platform growth, user engagement, and swap metrics.
* **Architectural Stability:** Utilizes **Next.js Middleware** for Role-Based Access Control (RBAC) and global Error Boundaries to ensure a crash-free experience.

---

## 💻 Tech Stack

**Frontend & Framework:**
* **Next.js 14 (App Router):** Leveraging Server-Side Rendering (SSR) and Server Components for optimal performance.
* **Tailwind CSS:** Custom design system focusing on "Tactile Minimalism" with precise Forest Green and Terracotta themes.
* **Framer Motion:** High-performance, physics-based micro-interactions, page transitions, and staggered reveals.
* **Lucide React:** Consistent, professional iconography used across all user and admin portals.

**Backend & Database:**
* **MongoDB Atlas:** Global cloud database for scalable user, listing, and swap request data.
* **Mongoose:** Structured ODM for complex schema relationships and validation.
* **Pusher:** Real-time WebSocket layer for instant messaging and notification delivery.
* **Custom JWT Auth:** Secure authentication strategy using `jose` and `bcryptjs` for granular session control.
* **ImgBB API:** Dedicated image hosting for high-resolution plant photography.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas account
* Pusher account

### 2. Clone the Repository
```bash
git clone https://github.com/islamrakibul9274/eco-swap.git
cd eco-swap
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env.local` file in the root directory using the values from `.env.example`:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Real-time Features
PUSHER_APP_ID=your_pusher_id
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster

# Media
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

### 5. Build and Start
```bash
# Optimized for 8GB RAM MacBook Air devices
npm run build
npm start
```

---

## ⚙️ Production Architecture
EcoSwap is optimized for **Vercel** deployment. To ensure 100% build stability, the application uses **Dynamic Server Rendering** for authenticated routes (like `/api/notifications`) and **PWA (Progressive Web App)** capabilities for offline support and mobile installability.

---

## 👤 Author

**Rakibul Islam Rumel**
* **GitHub:** [@islamrakibul9274](https://github.com/islamrakibul9274)
* **Project:** [EcoSwap Production](https://eco-swap-omega.vercel.app/)

---