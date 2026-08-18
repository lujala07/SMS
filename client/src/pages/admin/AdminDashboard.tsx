import { useEffect, useState } from 'react';
import api from '../../services/api';

interface DashboardData {
    students: number;
    teachers: number;
    departments: number;
    classes: number;
    subjects: number;
    assignments: number;
}

interface Notice {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

function AdminDashboard() {
    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    const [notices, setNotices] =
        useState<Notice[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [
                    dashboardResponse,
                    noticesResponse
                ] = await Promise.all([
                    api.get('/reports/dashboard'),
                    api.get('/notices')
                ]);

                setDashboard(
                    dashboardResponse.data
                );

                setNotices(
                    noticesResponse.data.slice(0, 3)
                );
            } catch {
                setError(
                    'Could not load dashboard data.'
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
                    Admin Dashboard
                </h1>

                <div className="bg-white p-4 rounded shadow">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                Admin Dashboard
            </h1>

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Students
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {dashboard?.students ?? 0}
                    </h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Teachers
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {dashboard?.teachers ?? 0}
                    </h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Subjects
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {dashboard?.subjects ?? 0}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Departments
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {dashboard?.departments ?? 0}
                    </h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Classes
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {dashboard?.classes ?? 0}
                    </h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Assignments
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {dashboard?.assignments ?? 0}
                    </h2>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow mt-6">
                <h2 className="text-lg font-semibold mb-4">
                    Recent Notices
                </h2>

                {notices.length === 0 ? (
                    <p className="text-gray-500">
                        No notices available.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {notices.map((notice) => (
                            <div
                                key={notice.id}
                                className="border-b pb-3 last:border-b-0"
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;