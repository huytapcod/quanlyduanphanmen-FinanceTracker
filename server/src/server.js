// Import các thư viện cần thiết
import express from "express";      // framework backend để tạo API
import cors from "cors";            // middleware xử lý Cross-Origin Resource Sharing (cho phép FE gọi API)
import morgan from "morgan";        // middleware log request ra console (hữu ích khi debug)
import dotenv from "dotenv";        // dùng để load biến môi trường từ file .env
import mongoose from "mongoose";    // ODM để kết nối và làm việc với MongoDB
import transactionRoutes from "./routes/transaction.routes.js";


// Load file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL })); // Chỉ cho phép frontend ở CLIENT_URL gọi API
app.use(express.json());                           // Cho phép parse JSON trong request body
app.use(morgan("dev"));                            // In log HTTP request ra console

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err.message));

// Định nghĩa routes
app.get("/api/health", (_req, res) => {
  // endpoint đơn giản để check server đang sống (health check)
  res.json({ ok: true });
});

app.use("/api/transactions", transactionRoutes); // nhóm API liên quan đến "transactions"

// Khởi động server
app.listen(process.env.PORT, () => {
  console.log(`🚀 API is running on port ${process.env.PORT}`);
});
