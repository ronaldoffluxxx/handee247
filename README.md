# Handee 247 - Service Marketplace

![Handee 247](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

**Handee 247** is a modern, production-ready service marketplace application designed for listing, discovering, booking, and negotiating services. Built with Next.js 16, TypeScript, and TailwindCSS, it offers a seamless experience for both service providers and seekers.

---

## ✨ Features

### 🎯 Core Functionality
- **🌟 Onboarding Experience** - 4-screen swipeable onboarding for first-time users
- **🔐 Authentication System** - Email login/signup with password strength indicator
- **👤 User Profiles** - Avatar upload, editable details, service management tabs
- **📋 Service Listings** - Browse, search, filter, create, and view detailed listings
- **🤝 Deal Management** - Complete deal flow with status tracking (Proposed → Accepted → In Progress → Completed)
- **💬 Real-Time Chat** - Text messaging, voice messages, and voice calls
- **📊 User Dashboard** - Active/completed deals overview with statistics
- **🏠 Modern Landing Page** - Professional homepage with clear value proposition

### 🎨 Design & UX
- **Modern Blue Theme** - Clean, professional color palette
- **Mobile-First Responsive** - Optimized for all screen sizes
- **Smooth Animations** - Micro-interactions and transitions
- **Toast Notifications** - User-friendly feedback system
- **Loading States** - Skeleton loaders for better perceived performance
- **Empty States** - Helpful prompts when no data is available

### 🛠️ Technical Features
- **LocalStorage Persistence** - All data stored client-side for demo purposes
- **Type Safety** - Full TypeScript implementation
- **Component Library** - Reusable UI components (Toast, Modal, Avatar, Badge, etc.)
- **Custom Hooks** - `useAuth` for authentication state management
- **Demo Data** - Pre-loaded users and listings for testing

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ronaldoffluxxx/handee247.git
   cd handee247
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### First Time Setup
- On first visit, you'll see the onboarding screens
- Click through or skip to reach the login page
- Use demo credentials or create a new account

---

## 🎮 Demo Credentials

```
Email: sarah@example.com
Password: password123

Email: mike@example.com
Password: password123

Email: alex@example.com
Password: password123

Admin:
Email: admin@handee247.com
Password: admin123
```

---

## 📱 Key Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with features and CTAs |
| `/onboarding` | First-time user onboarding (auto-shown once) |
| `/login` | User login with demo credentials |
| `/signup` | User registration with password strength |
| `/profile` | User profile with service tabs |
| `/browse` | Browse all services with search/filters |
| `/listings/create` | Create new service listing |
| `/listings/[id]` | View listing details |
| `/deals/[id]` | Deal room with chat and status tracking |
| `/dashboard` | User dashboard with active/completed deals |
| `/admin` | Admin panel (not fully implemented) |

---

## 🏗️ Project Structure

```
handee247/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin panel (partial)
│   │   ├── browse/            # Service browsing
│   │   ├── dashboard/         # User dashboard
│   │   ├── deals/             # Deal management
│   │   ├── listings/          # Listing pages
│   │   ├── onboarding/        # Onboarding flow
│   │   ├── profile/           # User profile
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── chat/              # Chat components
│   │   ├── layout/            # Layout components
│   │   ├── listings/          # Listing-specific components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── storage.ts         # LocalStorage utilities
│   │   └── utils.ts           # Helper functions
│   └── styles/
└── public/                    # Static assets
```

---

## 🎨 Tech Stack

- **Framework:** Next.js 16.0.3 (App Router)
- **Language:** TypeScript 5.9.3
- **Styling:** TailwindCSS 4.0
- **Icons:** Lucide React
- **State Management:** React Hooks + LocalStorage
- **UI Components:** Custom component library
- **Fonts:** Inter & Outfit (Google Fonts)

---

## 💾 Data Management

All data is stored in **LocalStorage** for demonstration purposes:

| Key | Purpose |
|-----|---------|
| `handee_user` | Current user session |
| `handee_users` | All registered users |
| `handee_listings` | Service listings |
| `handee_deals` | Deal records |
| `handee_messages` | Chat messages |
| `handee_categories` | Service categories |
| `handee_onboarding_complete` | Onboarding status |
| `handee_favorites` | User favorites |

---

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📸 Screenshots

### Landing Page
Modern hero section with gradient background and clear CTAs

### Onboarding Flow
4-screen swipeable onboarding with progress indicators

### Service Browsing
Grid layout with search, filters, and category selection

### Deal Room
Status tracker, chat interface, and deal actions

### User Dashboard
Active and completed deals with statistics

---

## ✅ Implemented Features

- [x] Onboarding flow (4 screens)
- [x] Authentication (login/signup)
- [x] User profiles with avatar upload
- [x] Service listing creation
- [x] Service browsing with filters
- [x] Deal proposal and booking
- [x] Deal status tracking
- [x] Real-time chat
- [x] Voice messages (simulated)
- [x] Voice calls (simulated)
- [x] User dashboard
- [x] Toast notifications
- [x] Loading states
- [x] Empty states
- [x] Mobile responsive design
- [x] Footer with accreditation

---

## 🚧 Pending Features

- [ ] Admin panel completion
  - [ ] User management
  - [ ] Category CRUD
  - [ ] Listing moderation
  - [ ] Analytics dashboard
- [ ] Dark mode toggle
- [ ] Backend integration (replace LocalStorage)
- [ ] Real-time WebSocket chat
- [ ] Payment integration
- [ ] Email notifications
- [ ] Review/rating system

---

## 🌱 Future Enhancements
- Payment integration and escrow system
- Push notifications
- Real-time backend (WebSockets)
- User verification badges
- Advanced analytics
- Dark mode

---

## 👨‍💻 Author & Accreditation
**Built by FluxxxDev**

---

## 📄 License
This project is licensed for private and commercial use.  
All rights reserved.

---

## 📬 Feedback & Contributions
Contributions, suggestions, and feedback are welcome.

---

## 🙏 Acknowledgments
- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Lucide for the beautiful icons
- Vercel for hosting and deployment platform

---

**Handee 247** - Your 24/7 Service Marketplace 🚀
