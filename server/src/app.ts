import express from "express";
import authRoutes from "./routes/authRoutes.js"; 
import testRoutes from './routes/testRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherSubjectRoutes from './routes/teacherSubjectRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/departments', departmentRoutes);
app.use('/classes', classRoutes);
app.use('/subjects', subjectRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/teacher-subjects', teacherSubjectRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/submissions', submissionRoutes);
app.use('/notices', noticeRoutes);
app.use('/reports', reportRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Academic Management System API is running",
  });
});

export default app;   