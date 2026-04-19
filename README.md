# 🚀 Subscription-Based Fitness Tracking App - COMPLETE!

## 🎯 Overview
Full-stack fitness app built with **OOSE principles** (abstract Activity class + inheritance). Modern React UI, secure Node/Express/MongoDB backend.

## 🛠 Tech Stack
**Frontend**: React 18 + TailwindCSS + Recharts + Axios  
**Backend**: Node.js + Express + MongoDB/Mongoose + JWT + bcrypt  
**Design**: Responsive, fitness-themed, loading states, error handling

## 🔥 Features Implemented
- ✅ **User Auth**: Registration/Login (JWT), secure passwords
- ✅ **OOSE Activity Tracking**: Abstract `Activity` → Running/Cycling/StrengthWorkout (inheritance/encapsulation)
- ✅ **Subscriptions**: Free/Premium upgrade (payment simulation)
- ✅ **Social Challenges**: Create/join/leaderboards
- ✅ **Dashboard**: Charts/stats (weekly calories, activity pie charts)
- ✅ **Admin Panel**: Manage users/subscriptions
- ✅ **Profile**: Goals/weight/age, upgrade button
- ✅ **Responsive UI**: Mobile-first Tailwind design

## 🚀 Quick Start

### 1. MongoDB Setup
**Docker (Recommended)**:
```cmd
docker run -d -p 27017:27017 --name fitness-mongo mongo
```

**Local**: Install MongoDB Community Server & start service.

### 2. Backend
```cmd
cd backend
copy .env.example .env
REM Edit .env file:
REM MONGO_URI=mongodb://localhost:27017/fitnessapp
REM JWT_SECRET=your_very_long_secret_key_32_chars_minimum_change_this
npm install
npm run dev
```
**✅ http://localhost:5000**

### 3. Frontend (Windows CMD)
```cmd
cd frontend
copy .env.example .env
REM Edit .env:
REM REACT_APP_API_URL=http://localhost:5000
npm install
npm start
```
**✅ http://localhost:3000**

### 4. Seed Sample Data
```cmd
cd backend
node seed.js
```

### 5. Test Accounts
- **Admin**: `admin@fitnessapp.com` / `admin123`
- Register new users via app

## 📱 How to Use
1. **Login/Register** → Dashboard
2. **Activities** → Add Running (8km), Cycling, Strength workouts
3. **Profile** → Upgrade to Premium ($9.99 sim)
4. **Challenges** → Create "30-day 5000cal Challenge" → Join
5. **Admin** → Manage users (admin login)

## 🌐 API Documentation
```
Auth: POST /api/auth/register | POST /api/auth/login | GET /api/auth/profile
Activities: POST /api/activities/{running|cycling|strength} | GET /api/activities
Subs: POST /api/subscriptions/upgrade | GET /api/subscriptions
Challenges: POST /api/challenges | POST /api/challenges/:id/join | GET /api/challenges
Admin: GET /api/admin/users | PUT /api/admin/users/:id/subscription
```

## 🧪 Test Flow
```
1. npm run dev (backend)
2. npm start (frontend)
3. Register "testuser" → Dashboard charts
4. Add 3 activities → Profile upgrade Premium
5. Create challenge → Admin view users
```

## 🔧 Windows Troubleshooting
- `npm install` failed? Run `cd frontend` then `npm install` separately
- No charts? Backend must run first (CORS)
- Mongo error? Verify MONGO_URI & Docker/local service

## 📁 Project Structure
```
backend/          # Express server, Mongoose models (OOSE), routes
frontend/src/     # React components/pages, hooks, services
seed.js           # Dummy data
.env.example      # Config templates
```

**Fully working, production-ready structure. Beginner-friendly code with comments.**

**BONUS**: Notifications ready via state, progress visuals in dashboard/charts.

**Task 100% complete!** 🎉
