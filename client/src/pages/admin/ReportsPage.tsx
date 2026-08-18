import { useEffect, useState } from 'react';
import api from '../../services/api';

interface DashboardReport {
    students: number;
    teachers: number;
    departments: number;
    classes: number;
    subjects: number;
    assignments: number;
}

interface AttendanceItem {
    status: string;
    count: string | number;
}

interface AssignmentItem {
    id?: number;
    title?: string;
    subject_name?: string;
    submission_count?: number | string;
    reviewed_count?: number | string;
}

function ReportsPage() {
    const [dashboard, setDashboard] =
        useState<DashboardReport | null>(null);

    const [attendance, setAttendance] =
        useState<AttendanceItem[]>([]);

    const [assignments, setAssignments] =
        useState<AssignmentItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [
                    dashboardResponse,
                    attendanceResponse,
                    assignmentResponse
                ] = await Promise.all([
                    api.get('/reports/dashboard'),
                    api.get('/reports/attendance'),
                    api.get('/reports/assignments')
                ]);

                setDashboard(
                    dashboardResponse.data
                );

                setAttendance(
                    attendanceResponse.data
                );

                setAssignments(
                    assignmentResponse.data
                );
            } catch {
                setError(
                    'Could not load reports.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Reports
                </h1>

                <div className="bg-white p-4 rounded shadow">
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
                    System summary and academic reports.
                </p>
            </div>

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            {dashboard && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <ReportCard
                        label="Students"
                        value={dashboard.students}
                    />

                    <ReportCard
                        label="Teachers"
                        value={dashboard.teachers}
                    />

                    <ReportCard
                        label="Departments"
                        value={dashboard.departments}
                    />

                    <ReportCard
                        label="Classes"
                        value={dashboard.classes}
                    />

                    <ReportCard
                        label="Subjects"
                        value={dashboard.subjects}
                    />

                    <ReportCard
                        label="Assignments"
                        value={dashboard.assignments}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">
                        Attendance Summary
                    </h2>

                    {attendance.length === 0 ? (
                        <p className="text-gray-500">
                            No attendance data available.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {attendance.map((item) => (
                                <div
                                    key={item.status}
                                    className="flex justify-between border-b pb-2"
                                >
                                    <span className="capitalize">
                                        {item.status}
                                    </span>

                                    <span className="font-semibold">
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">
                        Assignment Summary
                    </h2>

                    {assignments.length === 0 ? (
                        <p className="text-gray-500">
                            No assignment data available.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {assignments.map(
                                (assignment, index) => (
                                    <div
                                        key={
                                            assignment.id ??
                                            index
                                        }
                                        className="border-b pb-3"
                                    >
                                        <p className="font-medium">
                                            {assignment.title ||
                                                assignment.subject_name ||
                                                'Assignment'}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Submissions:{' '}
                                            {assignment.submission_count ??
                                                0}
                                            {' · '}
                                            Reviewed:{' '}
                                            {assignment.reviewed_count ??
                                                0}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ReportCardProps {
    label: string;
    value: number;
}

function ReportCard({
    label,
    value
}: ReportCardProps) {
    return (
        <div className="bg-white p-5 rounded shadow">
            <p className="text-gray-500">
                {label}
            </p>

            <p className="text-2xl font-bold mt-2">
                {value}
            </p>
        </div>
    );
}

export default ReportsPage;