import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

// Import routes (to be implemented)
// import categoryRoutes from './routes/categoryRoutes.js';
// import featuredItemRoutes from './routes/featuredItemRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000", // React dev
  "http://localhost:5173", // Vite dev
  "https://share-sphere-2-0.vercel.app", // deployed frontend
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler
app.use(errorHandler);

export default app;
