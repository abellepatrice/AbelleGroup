# AbelleGroup Loan App

AbelleGroup is a loan management system with:

- **Backend**: Node.js + Express (loan APIs, authentication, database integration)  
- **Frontend**: React Native (mobile dashboard for users & admins)  

---

## Features

- User signup & login with JWT authentication  
- Loan applications (individual & group)  
- Admin dashboard to approve/reject/manage loans  
- User profile management (update info, view loan history)  
- Secure storage with encrypted preferences (mobile side)  
- Payments & repayment tracking  

---

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (via Mongoose)  
- **Frontend**: React Native, Expo  
- **Auth**: JWT (JSON Web Tokens)  
- **Storage**: EncryptedSharedPreferences (Android)  

---

## Project Structure

AbelleGroup/
├── backend/ # Node.js + Express server

│ ├── models/ # Mongoose models (User, Loan, etc.)

│ ├── routes/ # API endpoints

│ ├── controllers/ # Business logic

│ └── index.js # App entry point

├── frontend/ # React Native mobile dashboard

│ ├── src/screens/ # Dashboard, Signup, Loan Application, etc.

│ ├── src/components/

│ └── App.js

└── README.md



---

## Installation & Setup

### 1. Clone repo

git clone https://github.com/abellepatrice/AbelleGroup.git

cd AbelleGroup

2. Backend setup

cd backend

npm install

cp .env.example .env   # configure DB_URL, JWT_SECRET, PORT

npm run dev            # or npm start

3. Frontend setup
cd frontend

npm install

npm start

# Run on device or emulator:

npx react-native run-android
npx react-native run-ios


Environment Variables

Backend .env file:

PORT=5000

DB_URL=mongodb://localhost:27017/AbelleGroup

JWT_SECRET=your_secret_key


Frontend .env file (if using react-native-dotenv):

API_BASE_URL=http://10.0.2.2:5000/api

Contributing

Fork & clone repo

Create a new branch feature/your-feature

Commit & push your changes

Submit a Pull Request

Author

👤 Patrice Oyende (abellepatrice)

GitHub: @abellepatrice

Email: abellepatrice@gmail.com


