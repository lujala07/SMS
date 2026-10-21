import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface DashboardData {
    total_students: string | number;
    total_teachers: string | number;
    total_departments: string | number;
    total_classes: string | number;
    total_subjects: string | number;
    total_assignments: string | number;
}

interface Notice {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

const statistics: { key: keyof DashboardData; label: string; path?: string }[] = [
    { key: 'total_students', label: 'Students', path: '/admin/students' },
    { key: 'total_teachers', label: 'Teachers', path: '/admin/teachers' },
    { key: 'total_departments', label: 'Departments', path: '/admin/departments' },
    { key: 'total_classes', label: 'Classes', path: '/admin/classes' },
    { key: 'total_subjects', label: 'Subjects', path: '/admin/subjects' },
    { key: 'total_assignments', label: 'Assignments' }
];

function AdminDashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noticeError, setNoticeError] = useState('');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const fetchDashboard = async () => {
            const [summary, recentNotices] = await Promise.allSettled([
                api.get<DashboardData>('/reports/dashboard', { signal: controller.signal }),
                api.get<Notice[]>('/notices', { signal: controller.signal })
            ]);
            if (controller.signal.aborted) return;
            if (summary.status === 'fulfilled') setDashboard(summary.value.data);
            else setError('Could not load academic totals.');
            if (recentNotices.status === 'fulfilled') setNotices(recentNotices.value.data.slice(0, 3));
            else setNoticeError('Could not load recent notices.');
            setLoading(false);
        };
        void fetchDashboard();
        return () => controller.abort();
    }, [refresh]);

    const retry = () => {
        setLoading(true);
        setError('');
        setNoticeError('');
        setRefresh(value => value + 1);
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600">Accounts and academic overview</p>
                </div>
                <Link to="/admin/users" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create account</Link>
            </header>

            {!loading && (error || noticeError) && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                    <p>{[error, noticeError].filter(Boolean).join(' ')}</p>
                    <button type="button" onClick={retry} className="font-medium underline underline-offset-2">Try again</button>
                </div>
            )}

            <section aria-label="Academic totals" aria-busy={loading} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {statistics.map(({ key, label, path }) => {
                    const content = (
                        <>
                            <p className="text-sm text-gray-600">{label}</p>
                            <p className="mt-3 text-3xl font-semibold tabular-nums text-gray-900">
                                {loading ? <span className="block h-9 w-16 animate-pulse rounded bg-gray-100" aria-label="Loading" /> : dashboard ? Number(dashboard[key]).toLocaleString() : '—'}
                            </p>
                        </>
                    );
                    const className = 'min-w-0 rounded-lg border border-gray-200 bg-white p-5';
                    return path ? (
                        <Link key={key} to={path} className={`${className} hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}>{content}</Link>
                    ) : <div key={key} className={className}>{content}</div>;
                })}
            </section>

            <section className="rounded-lg border border-gray-200 bg-white" aria-busy={loading}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
                    <h2 className="font-semibold text-gray-900">Recent notices</h2>
                    <Link to="/admin/notices" className="text-sm text-blue-700 hover:underline">View all notices</Link>
                </div>
                {loading ? <p className="p-5 text-sm text-gray-500" role="status">Loading notices...</p> : noticeError ? (
                    <p className="p-5 text-sm text-gray-600">Notices are currently unavailable.</p>
                ) : notices.length === 0 ? (
                    <div className="p-5">
                        <p className="text-sm text-gray-600">No notices have been posted yet.</p>
                        <Link to="/admin/notices" className="mt-2 inline-block text-sm text-blue-700 hover:underline">Create a notice</Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notices.map(notice => (
                            <article key={notice.id} className="min-w-0 p-5">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h3 className="break-words font-medium text-gray-900">{notice.title}</h3>
                                    <time dateTime={notice.created_at} className="shrink-0 text-xs text-gray-500">
                                        {new Date(notice.created_at).toLocaleDateString('en-GB', { timeZone: 'Asia/Kathmandu', day: 'numeric', month: 'short', year: 'numeric' })}
                                    </time>
                                </div>
                                <p className="mt-2 line-clamp-3 break-words whitespace-pre-line text-sm leading-6 text-gray-600">{notice.content}</p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default AdminDashboard;
