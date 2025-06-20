# ShareSphere Backend

A full-stack Express.js + MongoDB backend for the ShareSphere neighborhood sharing platform.

## Features

- **User Authentication**: JWT-based auth with bcrypt password hashing
- **Item Management**: CRUD operations for user items
- **Request System**: Send, approve, reject borrowing requests
- **Category Management**: Browse items by categories
- **RESTful API**: Clean, modular API design

## Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the backend directory with:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sharesphere
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running locally or update `MONGO_URI` to point to your MongoDB instance.

4. **Run the Server**
   ```bash
   node server.js
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Items

- `GET /api/items/mine` - Get user's items (auth required)
- `GET /api/items/featured` - Get featured items
- `POST /api/items` - Add new item (auth required)
- `PUT /api/items/:id` - Update item (auth required, owner only)
- `DELETE /api/items/:id` - Delete item (auth required, owner only)

### Requests

- `POST /api/requests` - Send borrowing request (auth required)
- `GET /api/requests/sent` - Get sent requests (auth required)
- `GET /api/requests/received` - Get received requests (auth required)
- `PATCH /api/requests/:id/approve` - Approve request (auth required, owner only)
- `PATCH /api/requests/:id/reject` - Reject request (auth required, owner only)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Project Structure

```
backend/
├── config/
│   └── db.js          # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── itemController.js
│   ├── requestController.js
│   └── categoryController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Item.js
│   ├── Request.js
│   └── Category.js
├── routes/
│   ├── authRoutes.js
│   ├── itemRoutes.js
│   ├── requestRoutes.js
│   └── categoryRoutes.js
├── app.js             # Express app setup
├── server.js          # Server entry point
└── package.json
```

## Frontend Integration

The frontend is configured to connect to this backend at `http://localhost:5000/api`. Make sure both frontend and backend are running for full functionality.
