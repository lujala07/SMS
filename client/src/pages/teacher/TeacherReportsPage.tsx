import {
    useEffect,
    useState
} from 'react';

import api from '../../services/api';

interface AttendanceSummary {
    status: string;
    total: string | number;
}

interface AssignmentSummary {
    id: number;

    title: string;

    subject_name: string;
    subject_code?: string;

    total_marks: number;
    due_date: string;

    total_submissions:
        string | number;

    reviewed_submissions:
        string | number;
}

function TeacherReportsPage() {
    const [
        attendance,
        setAttendance
    ] = useState<
        AttendanceSummary[]
    >([]);

    const [
        assignments,
        setAssignments
    ] = useState<
        AssignmentSummary[]
    >([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState('');

    useEffect(() => {
        const loadReports =
            async () => {
                try {
                    const [
                        attendanceResponse,
                        assignmentResponse
                    ] = await Promise.all([
                        api.get(
                            '/reports/attendance'
                        ),

                        api.get(
                            '/reports/assignments'
                        )
                    ]);

                    setAttendance(
                        attendanceResponse.data
                    );

                    setAssignments(
                        assignmentResponse.data
                    );

                } catch (error) {
                    console.error(
                        error
                    );

                    setError(
                        'Could not load reports.'
                    );

                } finally {
                    setLoading(false);
                }
            };

        loadReports();
    }, []);

    const getAttendanceTotal = (
        status: string
    ) => {
        const item =
            attendance.find(
                (record) =>
                    record.status ===
                    status
            );

        return item
            ? Number(item.total)
            : 0;
    };

    const present =
        getAttendanceTotal(
            'present'
        );

    const absent =
        getAttendanceTotal(
            'absent'
        );

    const late =
        getAttendanceTotal(
            'late'
        );

    const excused =
        getAttendanceTotal(
            'excused'
        );

    const totalAttendance =
        present +
        absent +
        late +
        excused;

    const totalAssignments =
        assignments.length;

    const totalSubmissions =
        assignments.reduce(
            (
                total,
                assignment
            ) =>
                total +
                Number(
                    assignment.total_submissions
                ),
            0
        );

    const reviewedSubmissions =
        assignments.reduce(
            (
                total,
                assignment
            ) =>
                total +
                Number(
                    assignment.reviewed_submissions
                ),
            0
        );

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Reports
                </h1>

                <div className="bg-white rounded shadow p-6">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Reports
                </h1>

                <p className="text-gray-500 mt-1">
                    View attendance and assignment summaries.
                </p>
            </div>

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Attendance Records
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {totalAttendance}
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Assignments
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {totalAssignments}
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Submissions
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {totalSubmissions}
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Reviewed
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {reviewedSubmissions}
                    </p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    Attendance Summary
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded shadow p-5">
                        <p className="text-gray-500 text-sm">
                            Present
                        </p>

                        <p className="text-xl font-semibold mt-2">
                            {present}
                        </p>
                    </div>

                    <div className="bg-white rounded shadow p-5">
                        <p className="text-gray-500 text-sm">
                            Absent
                        </p>

                        <p className="text-xl font-semibold mt-2">
                            {absent}
                        </p>
                    </div>

                    <div className="bg-white rounded shadow p-5">
                        <p className="text-gray-500 text-sm">
                            Late
                        </p>

                        <p className="text-xl font-semibold mt-2">
                            {late}
                        </p>
                    </div>

                    <div className="bg-white rounded shadow p-5">
                        <p className="text-gray-500 text-sm">
                            Excused
                        </p>

                        <p className="text-xl font-semibold mt-2">
                            {excused}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Assignment Summary
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
                                    Submissions
                                </th>

                                <th className="text-left p-3">
                                    Reviewed
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {assignments.length ===
                            0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            5
                                        }
                                        className="p-4 text-center text-gray-500"
                                    >
                                        No assignment reports available.
                                    </td>
                                </tr>
                            ) : (
                                assignments.map(
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

                                                {assignment.subject_code &&
                                                    ' - '}

                                                {
                                                    assignment.subject_name
                                                }
                                            </td>

                                            <td className="p-3">
                                                {new Date(
                                                    assignment.due_date
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="p-3">
                                                {
                                                    assignment.total_submissions
                                                }
                                            </td>

                                            <td className="p-3">
                                                {
                                                    assignment.reviewed_submissions
                                                }
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TeacherReportsPage;