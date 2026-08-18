import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';

import DashboardLayout from './layouts/DashboardLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsPage from './pages/admin/StudentsPage';
import TeachersPage from './pages/admin/TeachersPage';
import SubjectsPage from './pages/admin/SubjectsPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import ClassesPage from './pages/admin/ClassesPage';
import TeacherSubjectsPage from './pages/admin/TeacherSubjectsPage';
import NoticesPage from './pages/admin/NoticesPage';
import ReportsPage from './pages/admin/ReportsPage';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<LoginPage />}
            />

            <Route element={<DashboardLayout />}>
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/students"
                    element={<StudentsPage />}
                />

                <Route
                    path="/admin/teachers"
                    element={<TeachersPage />}
                />

                <Route
                    path="/admin/departments"
                    element={<DepartmentsPage />}
                />

                <Route
                    path="/admin/classes"
                    element={<ClassesPage />}
                />

                <Route
                    path="/admin/subjects"
                    element={<SubjectsPage />}
                />

                <Route
                    path="/admin/teacher-subjects"
                    element={<TeacherSubjectsPage />}
                />

                <Route
                    path="/admin/notices"
                    element={<NoticesPage />}
                />

                <Route
                    path="/admin/reports"
                    element={<ReportsPage />}
                />

                <Route
                    path="/teacher"
                    element={<TeacherDashboard />}
                />

                <Route
                    path="/student"
                    element={<StudentDashboard />}
                />
            </Route>
        </Routes>
    );
}

export default App;