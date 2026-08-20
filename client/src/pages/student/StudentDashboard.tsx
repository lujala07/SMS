import {
    useEffect,
    useState
} from 'react';

import api from '../../services/api';

interface Student {
    id: number;
    student_code: string;

    first_name: string;
    last_name: string;

    class_name: string;
    semester?: number;

    academic_year: string;
    department_name: string;

    email: string;
}

interface AttendanceItem {
    status: string;
    total: string | number;
}

interface Assignment {
    id: number;

    title: string;
    description?: string;

    subject_name: string;
    subject_code: string;

    due_date: string;
    total_marks: number;

    submission_id?: number | null;
    submission_status?: string | null;
    marks_obtained?: number | null;
}

interface Notice {
    id: number;

    title: string;
    content: string;

    created_at: string;
    author_email?: string;
}

interface DashboardData {
    student: Student;

    attendance:
        AttendanceItem[];

    assignments:
        Assignment[];

    notices:
        Notice[];
}

function StudentDashboard() {
    const [
        data,
        setData
    ] = useState<
        DashboardData | null
    >(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState('');

    useEffect(() => {
        const loadDashboard =
            async () => {
                try {
                    const response =
                        await api.get(
                            '/students/me/dashboard'
                        );

                    setData(
                        response.data
                    );

                } catch (error) {
                    console.error(
                        error
                    );

                    setError(
                        'Could not load student dashboard.'
                    );

                } finally {
                    setLoading(false);
                }
            };

        loadDashboard();
    }, []);

    const getAttendanceTotal = (
        status: string
    ) => {
        const item =
            data?.attendance.find(
                (record) =>
                    record.status ===
                    status
            );

        return item
            ? Number(item.total)
            : 0;
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Student Dashboard
                </h1>

                <div className="bg-white p-6 rounded shadow">
                    Loading...
                </div>
            </div>
        );
    }

    if (
        error ||
        !data
    ) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Student Dashboard
                </h1>

                <p className="text-red-500">
                    {error ||
                        'Could not load dashboard.'}
                </p>
            </div>
        );
    }

    const present =
        getAttendanceTotal(
            'present'
        );

    const absent =
        getAttendanceTotal(
            'absent'
        );

    const totalAttendance =
        data.attendance.reduce(
            (
                total,
                item
            ) =>
                total +
                Number(
                    item.total
                ),
            0
        );

    const pendingAssignments =
        data.assignments.filter(
            (assignment) =>
                !assignment.submission_id
        ).length;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Student Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Welcome,{' '}
                    {
                        data.student
                            .first_name
                    }.
                </p>
            </div>

            <div className="bg-white rounded shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    My Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">
                            Student
                        </p>

                        <p className="font-medium">
                            {
                                data.student
                                    .first_name
                            }{' '}
                            {
                                data.student
                                    .last_name
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Student Code
                        </p>

                        <p>
                            {
                                data.student
                                    .student_code
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Class
                        </p>

                        <p>
                            {
                                data.student
                                    .class_name
                            }

                            {data.student
                                .semester
                                ? ` - Semester ${data.student.semester}`
                                : ''}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Department
                        </p>

                        <p>
                            {
                                data.student
                                    .department_name
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Academic Year
                        </p>

                        <p>
                            {
                                data.student
                                    .academic_year
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p>
                            {
                                data.student
                                    .email
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Attendance Records
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {
                            totalAttendance
                        }
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Present
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {present}
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Absent
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {absent}
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Pending Assignments
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {
                            pendingAssignments
                        }
                    </p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    Recent Assignments
                </h2>

                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">
                                    Assignment
                                </th>

                                <th className="text-left p-3">
                                    Subject
                                </th>

                                <th className="text-left p-3">
                                    Due Date
                                </th>

                                <th className="text-left p-3">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.assignments.length ===
                            0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            4
                                        }
                                        className="p-4 text-center text-gray-500"
                                    >
                                        No assignments available.
                                    </td>
                                </tr>
                            ) : (
                                data.assignments
                                    .slice(
                                        0,
                                        5
                                    )
                                    .map(
                                        (
                                            assignment
                                        ) => (
                                            <tr
                                                key={
                                                    assignment.id
                                                }
                                                className="border-t"
                                            >
                                                <td className="p-3 font-medium">
                                                    {
                                                        assignment.title
                                                    }
                                                </td>

                                                <td className="p-3">
                                                    {
                                                        assignment.subject_code
                                                    }
                                                    {' - '}
                                                    {
                                                        assignment.subject_name
                                                    }
                                                </td>

                                                <td className="p-3">
                                                    {new Date(
                                                        assignment.due_date
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td className="p-3 capitalize">
                                                    {assignment.submission_status ||
                                                        'Not Submitted'}
                                                </td>
                                            </tr>
                                        )
                                    )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Recent Notices
                </h2>

                {data.notices.length ===
                0 ? (
                    <div className="bg-white rounded shadow p-5 text-gray-500">
                        No notices available.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.notices.map(
                            (
                                notice
                            ) => (
                                <div
                                    key={
                                        notice.id
                                    }
                                    className="bg-white rounded shadow p-5"
                                >
                                    <h3 className="font-semibold">
                                        {
                                            notice.title
                                        }
                                    </h3>

                                    <p className="mt-2">
                                        {
                                            notice.content
                                        }
                                    </p>

                                    <p className="text-sm text-gray-500 mt-3">
                                        {new Date(
                                            notice.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;