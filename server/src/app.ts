import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Academic Management System API is running",
  });
});

export default app;