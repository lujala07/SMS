import express from "express";
import authRoutes from "./routes/authRoutes.js"; 
import testRoutes from './routes/testRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/departments', departmentRoutes);
app.use('/classes', classRoutes);
app.use('/subjects', subjectRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Academic Management System API is running",
  });
});

export default app;   