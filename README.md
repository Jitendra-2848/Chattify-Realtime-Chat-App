# Chattify - Real-Time Chat Application

Chattify is a full-featured real-time chat application built from scratch. It allows users to sign up, log in, chat in real-time, and customize their profiles with theme options. The project was designed to learn and implement end-to-end real-time communication using modern web technologies.

> **Note:** The UI design is inspired by [Codesistency](https://www.youtube.com/@Codesistency).

---

## 🌟 Features

- User Authentication: Secure signup and login
- Real-Time Messaging: Instant messages with no page refresh
- Profile Customization: Update display name and profile photo
- Theme Switcher: Multiple UI themes for personal preference
- Clean Homepage: People list + chat section side by side
- Responsive Design: Works seamlessly on desktop and mobile

---

## 🛠 Tech Stack

- **Frontend:** React + TypeScript  
- **Styling:** Tailwind CSS & DaisyUI  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **Real-Time:** Socket.io  

---

## ⚡ Environment Variables

Create a `.env` file in the root folder with the following variables:

```env
port = 3000
Mongodb_URL = YOUR_MONGO_URL
JWT_SECRET = "YOUR_SECRET"
status="production"
Cloudinary_CLOUD_NAME=YOUR_Cloudinary_CLOUD_NAME
Cloudinary_CLOUD_API_KEY=YOUR_Cloudinary_CLOUD_API_KEY
Cloudinary_CLOUD_SECRET_KEY=YOUR_Cloudinary_CLOUD_SECRET_KEY
```
🚀 Setup Instructions
Clone the repository
Copy code
```bash
git clone https://github.com/Jitendra-2848/Chattify-Realtime-Chat-App.git
```
Navigate to backend and frontend folders and install dependencies
Copy code
# Backend
```bash
cd backend
npm install
```
# Frontend
```bash
cd ../frontend
npm install
```
## Start the servers

# Backend
Copy code
```bash
cd backend
npm run server
```
# Frontend
```bash
cd frontend
npm run dev
```
Open your browser and go to http://localhost:5173 (Vite default port)

🔗 License & Credits
License: ISC

UI Inspiration: Codesistency

