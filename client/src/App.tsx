import {
    Routes,
    Route,
    Navigate,
    Outlet
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';

import DashboardLayout from './layouts/DashboardLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserPage from './pages/admin/UserPage';
import StudentsPage from './pages/admin/StudentsPage';
import TeachersPage from './pages/admin/TeachersPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import ClassesPage from './pages/admin/ClassesPage';
import SubjectsPage from './pages/admin/SubjectsPage';
import TeacherSubjectsPage from './pages/admin/TeacherSubjectsPage';
import NoticesPage from './pages/admin/NoticesPage';
import ReportsPage from './pages/admin/ReportsPage';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAttendancePage from './pages/teacher/TeacherAttendancePage';
import TeacherAssignmentsPage from './pages/teacher/TeacherAssignmentsPage';
import TeacherSubmissionsPage from './pages/teacher/TeacherSubmissionsPage';
import TeacherReportsPage from './pages/teacher/TeacherReportsPage';
import TeacherNoticesPage from './pages/teacher/TeacherNoticesPage';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';

const getUserRole = () => {
    try {
        return JSON.parse(
            localStorage.getItem('user') || '{}'
        ).role as string | undefined;
    } catch {
        return undefined;
    }
};

function ProtectedRoute({
    roles
}: {
    roles: string[];
}) {
    const token = localStorage.getItem('token');
    const role = getUserRole();

    if (!token || !role) {
        return <Navigate to="/" replace />;
    }

    if (!roles.includes(role)) {
        if (role === 'admin') {
            return <Navigate to="/admin" replace />;
        }

        if (role === 'teacher') {
            return <Navigate to="/teacher" replace />;
        }

        if (role === 'student') {
            return <Navigate to="/student" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <LoginPage />
                }
            />

            <Route
                element={
                    <DashboardLayout />
                }
            >
                <Route element={<ProtectedRoute roles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserPage />} />
                    <Route path="/admin/students" element={<StudentsPage />} />
                    <Route path="/admin/teachers" element={<TeachersPage />} />
                    <Route path="/admin/departments" element={<DepartmentsPage />} />
                    <Route path="/admin/classes" element={<ClassesPage />} />
                    <Route path="/admin/subjects" element={<SubjectsPage />} />
                    <Route path="/admin/teacher-subjects" element={<TeacherSubjectsPage />} />
                    <Route path="/admin/notices" element={<NoticesPage />} />
                    <Route path="/admin/reports" element={<ReportsPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['teacher']} />}>
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
                    <Route path="/teacher/assignments" element={<TeacherAssignmentsPage />} />
                    <Route path="/teacher/submissions" element={<TeacherSubmissionsPage />} />
                    <Route path="/teacher/notices" element={<TeacherNoticesPage />} />
                    <Route path="/teacher/reports" element={<TeacherReportsPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['student']} />}>
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/attendance" element={<StudentAttendancePage />} />
                    <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default App;
