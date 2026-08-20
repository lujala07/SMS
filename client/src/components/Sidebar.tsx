import { useState } from 'react';

import {
    NavLink,
    useNavigate
} from 'react-router-dom';

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
    LogOut,
    FileCheck2,
    User
} from 'lucide-react';

function Sidebar() {
    const navigate =
        useNavigate();

    const [
        open,
        setOpen
    ] = useState(true);

    const user = JSON.parse(
        localStorage.getItem(
            'user'
        ) || '{}'
    );

    const logout = () => {
        localStorage.removeItem(
            'token'
        );

        localStorage.removeItem(
            'user'
        );

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

    const getFullName = () => {
        const firstName =
            user.first_name ||
            user.firstName ||
            '';

        const lastName =
            user.last_name ||
            user.lastName ||
            '';

        const fullName =
            `${firstName} ${lastName}`.trim();

        if (fullName) {
            return fullName;
        }

        if (user.name) {
            return user.name;
        }

        if (
            user.role === 'admin'
        ) {
            return 'Administrator';
        }

        if (
            user.role === 'teacher'
        ) {
            return 'Teacher';
        }

        if (
            user.role === 'student'
        ) {
            return 'Student';
        }

        return 'User';
    };

    const fullName =
        getFullName();

    return (
        <aside
            className={`
                h-screen
                sticky
                top-0
                bg-slate-900
                text-white
                transition-all
                duration-300
                shrink-0
                ${open ? 'w-60' : 'w-20'}
            `}
        >
            <div className="h-full flex flex-col p-4">

                {/* Top */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() =>
                            setOpen(
                                !open
                            )
                        }
                        className="p-2 rounded-md hover:bg-slate-800"
                        title="Toggle sidebar"
                    >
                        <Menu
                            size={22}
                        />
                    </button>

                    {open && (
                        <h2 className="text-xl font-bold">
                            SMS
                        </h2>
                    )}
                </div>

                {/* Navigation */}
                <nav className="space-y-1 flex-1 overflow-y-auto">

                    {user.role ===
                        'admin' && (
                        <>
                            <NavLink
                                to="/admin"
                                end
                                className={
                                    linkStyle
                                }
                            >
                                <LayoutDashboard
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Dashboard
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/users"
                                className={
                                    linkStyle
                                }
                            >
                                <UserPlus
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Users
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/students"
                                className={
                                    linkStyle
                                }
                            >
                                <GraduationCap
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Students
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/teachers"
                                className={
                                    linkStyle
                                }
                            >
                                <Users
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Teachers
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/departments"
                                className={
                                    linkStyle
                                }
                            >
                                <Building2
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Departments
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/classes"
                                className={
                                    linkStyle
                                }
                            >
                                <School
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Classes
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/subjects"
                                className={
                                    linkStyle
                                }
                            >
                                <BookOpen
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Subjects
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/teacher-subjects"
                                className={
                                    linkStyle
                                }
                            >
                                <ClipboardList
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Teacher Subjects
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/notices"
                                className={
                                    linkStyle
                                }
                            >
                                <Bell
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Notices
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/reports"
                                className={
                                    linkStyle
                                }
                            >
                                <BarChart3
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Reports
                                    </span>
                                )}
                            </NavLink>
                        </>
                    )}

                    {user.role ===
                        'teacher' && (
                        <>
                            <NavLink
                                to="/teacher"
                                end
                                className={
                                    linkStyle
                                }
                            >
                                <LayoutDashboard
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Dashboard
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/attendance"
                                className={
                                    linkStyle
                                }
                            >
                                <ClipboardList
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Attendance
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/assignments"
                                className={
                                    linkStyle
                                }
                            >
                                <BookOpen
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Assignments
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/submissions"
                                className={
                                    linkStyle
                                }
                            >
                                <FileCheck2
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Submissions
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/notices"
                                className={
                                    linkStyle
                                }
                            >
                                <Bell
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Notices
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/reports"
                                className={
                                    linkStyle
                                }
                            >
                                <BarChart3
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Reports
                                    </span>
                                )}
                            </NavLink>
                        </>
                    )}

                    {user.role ===
                        'student' && (
                        <>
                            <NavLink
                                to="/student"
                                end
                                className={
                                    linkStyle
                                }
                            >
                                <LayoutDashboard
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Dashboard
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/student/attendance"
                                className={
                                    linkStyle
                                }
                            >
                                <ClipboardList
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Attendance
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/student/assignments"
                                className={
                                    linkStyle
                                }
                            >
                                <BookOpen
                                    size={20}
                                />

                                {open && (
                                    <span>
                                        Assignments
                                    </span>
                                )}
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Bottom user section */}
                <div className="mt-auto pt-4 border-t border-slate-700">

                    {open ? (
                        <div className="px-3 mb-3">
                            <div className="flex items-start gap-3">

                                <User
                                    size={20}
                                    className="mt-1 shrink-0 text-slate-300"
                                />

                                <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">
                                        {fullName}
                                    </p>

                                    <p className="text-xs text-slate-400 truncate mt-1">
                                        {user.email ||
                                            'No email'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-3">
                            <User
                                size={20}
                                className="text-slate-300"
                            />
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={
                            logout
                        }
                        className={`
                            flex
                            items-center
                            gap-3
                            w-full
                            px-3
                            py-2
                            rounded-md
                            hover:bg-red-600
                            transition
                            ${
                                !open
                                    ? 'justify-center'
                                    : ''
                            }
                        `}
                        title="Logout"
                    >
                        <LogOut
                            size={20}
                        />

                        {open && (
                            <span>
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;