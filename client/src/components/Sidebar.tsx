import { useEffect, useRef, useState } from 'react';

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
    User,
    X
} from 'lucide-react';

function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [isMobile, setIsMobile] = useState(() => !window.matchMedia('(min-width: 768px)').matches);
    const navigate =
        useNavigate();

    const [
        open,
        setOpen
    ] = useState(() => window.matchMedia('(min-width: 768px)').matches);

    const expanded = isMobile || open;
    useEffect(() => {
        const media = window.matchMedia('(min-width: 768px)');
        const update = () => { setIsMobile(!media.matches); onMobileClose(); };
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [onMobileClose]);

    useEffect(() => {
        const element = dialog.current;
        if (!isMobile || !mobileOpen || !element) return;
        const previousFocus = document.activeElement;
        const overflow = document.body.style.overflow;
        element.showModal();
        document.body.style.overflow = 'hidden';
        return () => {
            element.close();
            document.body.style.overflow = overflow;
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        };
    }, [isMobile, mobileOpen]);

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

    const content = (
            <div className="h-full flex flex-col p-4">

                {/* Top */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => isMobile ? onMobileClose() : setOpen(!open)}
                        className="p-2 rounded-md hover:bg-slate-800"
                        title={isMobile ? 'Close navigation' : 'Toggle sidebar'}
                        aria-label={isMobile ? 'Close navigation' : 'Toggle sidebar'}
                        aria-expanded={expanded}
                    >
                        {isMobile ? <X size={22} /> : <Menu
                            size={22}
                        />}
                    </button>

                    {expanded && (
                        <h2 className="text-xl font-bold">
                            SMS
                        </h2>
                    )}
                </div>

                {/* Navigation */}
                <nav aria-label="Main navigation" className="space-y-1 flex-1 overflow-y-auto" onClick={event => {
                    if (isMobile && event.target instanceof Element && event.target.closest('a')) onMobileClose();
                }}>

                    {user.role ===
                        'admin' && (
                        <>
                            <NavLink
                                to="/admin"
                                aria-label="Dashboard"
                                title="Dashboard"
                                end
                                className={
                                    linkStyle
                                }
                            >
                                <LayoutDashboard
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Dashboard
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/users"
                                aria-label="Users"
                                title="Users"
                                className={
                                    linkStyle
                                }
                            >
                                <UserPlus
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Users
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/students"
                                aria-label="Students"
                                title="Students"
                                className={
                                    linkStyle
                                }
                            >
                                <GraduationCap
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Students
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/teachers"
                                aria-label="Teachers"
                                title="Teachers"
                                className={
                                    linkStyle
                                }
                            >
                                <Users
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Teachers
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/departments"
                                aria-label="Departments"
                                title="Departments"
                                className={
                                    linkStyle
                                }
                            >
                                <Building2
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Departments
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/classes"
                                aria-label="Classes"
                                title="Classes"
                                className={
                                    linkStyle
                                }
                            >
                                <School
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Classes
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/subjects"
                                aria-label="Subjects"
                                title="Subjects"
                                className={
                                    linkStyle
                                }
                            >
                                <BookOpen
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Subjects
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/teacher-subjects"
                                aria-label="Teacher subjects"
                                title="Teacher subjects"
                                className={
                                    linkStyle
                                }
                            >
                                <ClipboardList
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Teacher Subjects
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/notices"
                                aria-label="Notices"
                                title="Notices"
                                className={
                                    linkStyle
                                }
                            >
                                <Bell
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Notices
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/admin/reports"
                                aria-label="Reports"
                                title="Reports"
                                className={
                                    linkStyle
                                }
                            >
                                <BarChart3
                                    size={20}
                                />

                                {expanded && (
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
                                aria-label="Dashboard"
                                title="Dashboard"
                                end
                                className={
                                    linkStyle
                                }
                            >
                                <LayoutDashboard
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Dashboard
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/attendance"
                                aria-label="Attendance"
                                title="Attendance"
                                className={
                                    linkStyle
                                }
                            >
                                <ClipboardList
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Attendance
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/assignments"
                                aria-label="Assignments"
                                title="Assignments"
                                className={
                                    linkStyle
                                }
                            >
                                <BookOpen
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Assignments
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/submissions"
                                aria-label="Submissions"
                                title="Submissions"
                                className={
                                    linkStyle
                                }
                            >
                                <FileCheck2
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Submissions
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/notices"
                                aria-label="Notices"
                                title="Notices"
                                className={
                                    linkStyle
                                }
                            >
                                <Bell
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Notices
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/teacher/reports"
                                aria-label="Reports"
                                title="Reports"
                                className={
                                    linkStyle
                                }
                            >
                                <BarChart3
                                    size={20}
                                />

                                {expanded && (
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
                                aria-label="Dashboard"
                                title="Dashboard"
                                end
                                className={
                                    linkStyle
                                }
                            >
                                <LayoutDashboard
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Dashboard
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/student/attendance"
                                aria-label="Attendance"
                                title="Attendance"
                                className={
                                    linkStyle
                                }
                            >
                                <ClipboardList
                                    size={20}
                                />

                                {expanded && (
                                    <span>
                                        Attendance
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/student/assignments"
                                aria-label="Assignments"
                                title="Assignments"
                                className={
                                    linkStyle
                                }
                            >
                                <BookOpen
                                    size={20}
                                />

                                {expanded && (
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

                    {expanded ? (
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
                                !expanded
                                    ? 'justify-center'
                                    : ''
                            }
                        `}
                        title="Logout"
                    >
                        <LogOut
                            size={20}
                        />

                        {expanded && (
                            <span>
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>
    );

    return isMobile ? (
        <dialog ref={dialog} aria-label="Navigation" onCancel={event => { event.preventDefault(); onMobileClose(); }} onClick={event => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right) onMobileClose();
        }} className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-64 max-w-[85vw] border-0 bg-slate-900 p-0 text-white shadow-xl backdrop:bg-slate-950/50">
            {content}
        </dialog>
    ) : (
        <aside className={`sticky top-0 h-screen shrink-0 bg-slate-900 text-white transition-all duration-300 ${open ? 'w-60' : 'w-20'}`}>{content}</aside>
    );
}

export default Sidebar;
