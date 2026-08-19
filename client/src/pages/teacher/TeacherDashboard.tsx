import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Assignment {
    id: number;
    title: string;
    due_date: string;
    subject_name?: string;
}

interface Notice {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

function TeacherDashboard() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [
                    assignmentResponse,
                    noticeResponse
                ] = await Promise.all([
                    api.get('/assignments'),
                    api.get('/notices')
                ]);

                setAssignments(
                    assignmentResponse.data.slice(0, 5)
                );

                setNotices(
                    noticeResponse.data.slice(0, 3)
                );
            } catch {
                setError(
                    'Could not load teacher dashboard.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Teacher Dashboard
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
                    Teacher Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    View assignments, notices and teaching activities.
                </p>
            </div>

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded shadow">
                    <p className="text-gray-500">
                        Assignments
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {assignments.length}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <p className="text-gray-500">
                        Recent Notices
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {notices.length}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <p className="text-gray-500">
                        Attendance
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                        Manage from Attendance page
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Assignments
                    </h2>

                    {assignments.length === 0 ? (
                        <p className="text-gray-500">
                            No assignments available.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {assignments.map(
                                (assignment) => (
                                    <div
                                        key={assignment.id}
                                        className="border-b pb-3"
                                    >
                                        <p className="font-medium">
                                            {assignment.title}
                                        </p>

                                        {assignment.subject_name && (
                                            <p className="text-sm text-gray-500">
                                                {
                                                    assignment.subject_name
                                                }
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400 mt-1">
                                            Due:{' '}
                                            {new Date(
                                                assignment.due_date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Notices
                    </h2>

                    {notices.length === 0 ? (
                        <p className="text-gray-500">
                            No notices available.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {notices.map(
                                (notice) => (
                                    <div
                                        key={notice.id}
                                        className="border-b pb-3"
                                    >
                                        <p className="font-medium">
                                            {notice.title}
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            {notice.content}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(
                                                notice.created_at
                                            ).toLocaleDateString()}
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

export default TeacherDashboard;