import express from "express";
import authRoutes from "./routes/authRoutes.js"; 

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Academic Management System API is running",
  });
});

export default app;   