import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
    Menu,
    LayoutDashboard,
    UserPlus,
    GraduationCap,
    Users,
    Building2,
    School,
    BookOpen,
    ClipboardList,
    Bell,
    BarChart3,
    LogOut
} from 'lucide-react';

function Sidebar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const linkStyle = ({
        isActive
    }: {
        isActive: boolean;
    }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition ${
            isActive
                ? 'bg-slate-700'
                : 'hover:bg-slate-800'
        }`;

    return (
        <aside
            className={`
                min-h-screen
                bg-slate-900
                text-white
                transition-all
                duration-300
                shrink-0
                ${open ? 'w-60' : 'w-20'}
            `}
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-md hover:bg-slate-800"
                        title="Toggle sidebar"
                    >
                        <Menu size={22} />
                    </button>

                    {open && (
                        <h2 className="text-xl font-bold">
                            SMS
                        </h2>
                    )}
                </div>

                <nav className="space-y-1">
                    {user.role === 'admin' && (
                        <>
                            <NavLink
                                to="/admin"
                                end
                                className={linkStyle}
                                title="Dashboard"
                            >
                                <LayoutDashboard size={20} />
                                {open && <span>Dashboard</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/users"
                                className={linkStyle}
                                title="Users"
                            >
                                <UserPlus size={20} />
                                {open && <span>Users</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/students"
                                className={linkStyle}
                                title="Students"
                            >
                                <GraduationCap size={20} />
                                {open && <span>Students</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/teachers"
                                className={linkStyle}
                                title="Teachers"
                            >
                                <Users size={20} />
                                {open && <span>Teachers</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/departments"
                                className={linkStyle}
                                title="Departments"
                            >
                                <Building2 size={20} />
                                {open && <span>Departments</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/classes"
                                className={linkStyle}
                                title="Classes"
                            >
                                <School size={20} />
                                {open && <span>Classes</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/subjects"
                                className={linkStyle}
                                title="Subjects"
                            >
                                <BookOpen size={20} />
                                {open && <span>Subjects</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/teacher-subjects"
                                className={linkStyle}
                                title="Teacher Subjects"
                            >
                                <ClipboardList size={20} />
                                {open && <span>Teacher Subjects</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/notices"
                                className={linkStyle}
                                title="Notices"
                            >
                                <Bell size={20} />
                                {open && <span>Notices</span>}
                            </NavLink>

                            <NavLink
                                to="/admin/reports"
                                className={linkStyle}
                                title="Reports"
                            >
                                <BarChart3 size={20} />
                                {open && <span>Reports</span>}
                            </NavLink>
                        </>
                    )}

                    {user.role === 'teacher' && (
                        <>
                            <NavLink
                                to="/teacher"
                                end
                                className={linkStyle}
                            >
                                <LayoutDashboard size={20} />
                                {open && <span>Dashboard</span>}
                            </NavLink>

                            <NavLink
                                to="/teacher/attendance"
                                className={linkStyle}
                            >
                                <ClipboardList size={20} />
                                {open && <span>Attendance</span>}
                            </NavLink>

                            <NavLink
                                to="/teacher/assignments"
                                className={linkStyle}
                            >
                                <BookOpen size={20} />
                                {open && <span>Assignments</span>}
                            </NavLink>
                        </>
                    )}

                    {user.role === 'student' && (
                        <>
                            <NavLink
                                to="/student"
                                end
                                className={linkStyle}
                            >
                                <LayoutDashboard size={20} />
                                {open && <span>Dashboard</span>}
                            </NavLink>

                            <NavLink
                                to="/student/attendance"
                                className={linkStyle}
                            >
                                <ClipboardList size={20} />
                                {open && <span>Attendance</span>}
                            </NavLink>

                            <NavLink
                                to="/student/assignments"
                                className={linkStyle}
                            >
                                <BookOpen size={20} />
                                {open && <span>Assignments</span>}
                            </NavLink>
                        </>
                    )}
                </nav>

                <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 mt-8 rounded-md hover:bg-red-600 transition"
                    title="Logout"
                >
                    <LogOut size={20} />
                    {open && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;