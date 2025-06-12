
# 🏢 Meeting Room Reservation System

A backend REST API for managing and reserving meeting rooms, built using **Node.js**, **Express**, **MySQL**, and **Sequelize ORM** — with support for **Google OAuth 2.0** authentication.

---

## 🚀 Features

- User registration and login with email/password
- **Google OAuth 2.0 login**
- JWT-based authentication & secure cookie storage
- Role-based access control:
  - **Admin**: manage rooms and view all reservations
  - **User**: manage own bookings only
- CRUD operations:
  - Meeting Rooms
  - Reservations
- Middleware for protected routes
- Input validation and centralized error handling

---

## 🧰 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT, Google OAuth 2.0, bcrypt
- **Environment Management:** dotenv
- **Auth Integration:** Passport.js (GoogleStrategy)

---

🔐 Authentication
🔑 Email/Password Auth
POST /api/auth/register – Register new user

POST /api/auth/login – Log in with credentials

On success, a JWT is returned and stored in an HTTP-only cookie.

🌐 Google OAuth 2.0
GET /api/v1/auth/google – Redirect to Google login

GET /api/v1/auth/callback – Handle callback

On success, a JWT is issued and stored securely.

📌 Main API Endpoints
🏠 Rooms (Admin only)
GET /api/rooms – View all meeting rooms

POST /api/rooms – Create a new room

PUT /api/rooms/:id – Update room info

DELETE /api/rooms/:id – Delete a room

📅 Reservations
GET /api/reservations – View user's reservations (admin sees all)

POST /api/reservations – Book a new reservation

DELETE /api/reservations/:id – Cancel reservation

👤 Author
Abd-echafi
🎓 3rd-year Computer Engineering Student
💻 Node.js Backend Developer
🔗 GitHub: https://github.com/Abd-echafi
