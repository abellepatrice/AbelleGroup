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

API Routes (Backend)
Endpoint	Method	Description
/api/auth/register	POST	Create user account
/api/auth/login	POST	Login & get JWT
/api/loans/apply	POST	Apply for a loan
/api/loans	GET	Fetch user loans
/api/admin/loans	GET	Admin: view all loans
/api/admin/loans/:id/approve	PATCH	Approve a loan
/api/admin/loans/:id/reject	PATCH	Reject a loan
/api/users/:id	PUT	Update user profile
Environment Variables

Backend .env file:

PORT=5000
DB_URL=mongodb://localhost:27017/abelle-group
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

## API Documentation

### Authentication

#### Register User
**POST** `/api/auth/register`

**Request Body**
json
{
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "0712345678",
  "dob": "1995-03-10",
  "password": "StrongPass123!"
}
Response

json
Copy code
{
  "message": "User registered successfully",
  "user": {
    "id": "650ff1cda15b5a1234567890",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
Login User
POST /api/auth/login

Request Body

json
Copy code
{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
Response

json
Copy code
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "650ff1cda15b5a1234567890",
    "username": "john_doe",
    "role": "user"
  }
}
Loans
Apply for a Loan
POST /api/loans/apply

Request Body

json
Copy code
{
  "amount": 5000,
  "term": 6,
  "type": "individual",
  "purpose": "Business expansion"
}
Response

json
Copy code
{
  "message": "Loan application submitted",
  "loan": {
    "id": "651001d8e7892c1234567890",
    "user": "650ff1cda15b5a1234567890",
    "amount": 5000,
    "term": 6,
    "status": "pending"
  }
}
Get My Loans
GET /api/loans

Headers

makefile
Copy code
Authorization: Bearer <token>
Response

json
Copy code
[
  {
    "id": "651001d8e7892c1234567890",
    "amount": 5000,
    "status": "pending",
    "createdAt": "2025-09-18T10:00:00Z"
  },
  {
    "id": "651003f5e7892c1234567891",
    "amount": 2000,
    "status": "approved",
    "createdAt": "2025-09-10T15:30:00Z"
  }
]
Admin
Get All Loan Applications
GET /api/admin/loans

Headers

makefile
Copy code
Authorization: Bearer <admin_token>
Response

json
Copy code
[
  {
    "id": "651001d8e7892c1234567890",
    "user": "john_doe",
    "amount": 5000,
    "status": "pending"
  },
  {
    "id": "651003f5e7892c1234567891",
    "user": "mary_smith",
    "amount": 2000,
    "status": "approved"
  }
]
Approve Loan
PATCH /api/admin/loans/:id/approve

Response

json
Copy code
{
  "message": "Loan approved",
  "loan": {
    "id": "651001d8e7892c1234567890",
    "status": "approved"
  }
}
Reject Loan
PATCH /api/admin/loans/:id/reject

Response

json
Copy code
{
  "message": "Loan rejected",
  "loan": {
    "id": "651001d8e7892c1234567890",
    "status": "rejected"
  }
}
Users
Get Profile
GET /api/users/:id

Headers

makefile
Copy code
Authorization: Bearer <token>
Response

json
Copy code
{
  "id": "650ff1cda15b5a1234567890",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "0712345678",
  "dob": "1995-03-10",
  "role": "user",
  "profileImage": "https://example.com/images/john.jpg"
}
Update Profile
PUT /api/users/:id

Request Body

json
Copy code
{
  "username": "john_updated",
  "email": "john.new@example.com",
  "phone": "0723456789"
}
Response

json
Copy code
{
  "message": "Profile updated successfully",
  "user": {
    "id": "650ff1cda15b5a1234567890",
    "username": "john_updated",
    "email": "john.new@example.com"
  }
}

