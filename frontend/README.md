🔄 ShareSphere
A neighborhood-first sharing and rental platform. ShareSphere helps users find, lend, or rent items from people around them — making it easier to save money, reduce waste, and build stronger communities.

💡 Why ShareSphere?
Tired of buying something you'll only use once? With ShareSphere, you can borrow it from a neighbor. Have something lying around unused? Rent it out and earn extra income. It's about reducing consumption, increasing accessibility, and connecting people.

🚀 Features
🔐 User Authentication: Secure login and registration using JWT.

🧳 List Items: Users can list items they want to lend or rent with photos, descriptions, and availability.

🔍 Search & Filter: Easily find items nearby based on category, keyword, and location.

📥 Borrow Requests: Users can request to borrow an item; owners can approve or decline.

💬 Messaging (Planned): Real-time chat between item owner and borrower.

📍 Location-Aware: See how far away the item is from your address.

🛠️ Dashboard: Personalized dashboard showing your listed items, requests, and history.

📅 Availability Tracking: Item availability and rental duration management.

🛠️ Tech Stack
Tech Description
Frontend React.js + Vite + Tailwind CSS + TypeScript
Backend Node.js + Express.js
Database MongoDB (Mongoose ODM)
Auth JWT (JSON Web Tokens)
Storage Cloudinary / Local image upload
Deployment Vercel (Frontend) + Render (Backend)

🔐 Authentication
JWT-based login & signup.

Protected routes and user-specific data.

Optional: OAuth or email confirmation in the future.

⚙️ Getting Started (Local Setup)

1. Clone the repo

git clone url 2. Install Backend
cd sharesphere-backend
npm install

# Create .env file

PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret

npm run dev 3. Install Frontend

cd ../sharesphere-frontend
npm install

# Create .env

VITE_API_BASE_URL=http://localhost:5000

npm run dev 4. Visit the App
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api

🔮 Planned Features
💬 Real-time chat using Socket.io

📧 Email Notifications (Nodemailer or Mailgun)

📱 PWA support for mobile responsiveness

📊 Admin Dashboard for managing users/items

🔔 Push Notifications (Firebase)

📈 Activity Analytics (for users)

🤝 Contributing
Want to improve ShareSphere or add a new feature? Fork the repo and send a PR!
For major changes, please open an issue first.
