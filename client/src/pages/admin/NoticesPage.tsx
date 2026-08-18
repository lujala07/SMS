import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Notice {
    id: number;
    title: string;
    content: string;
    audience: string;
    created_at: string;
    author_email?: string;
}

function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await api.get('/notices');
                setNotices(response.data);
            } catch {
                setError('Could not load notices.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Notices
                </h1>

                <p className="text-gray-500 mt-1">
                    View notices posted in the system.
                </p>
            </div>

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            {loading ? (
                <div className="bg-white p-4 rounded shadow">
                    Loading...
                </div>
            ) : notices.length === 0 ? (
                <div className="bg-white p-4 rounded shadow text-gray-500">
                    No notices available.
                </div>
            ) : (
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <div
                            key={notice.id}
                            className="bg-white p-5 rounded shadow"
                        >
                            <div className="flex justify-between gap-4">
                                <h2 className="font-semibold text-lg">
                                    {notice.title}
                                </h2>

                                <span className="text-sm text-gray-500 capitalize">
                                    {notice.audience}
                                </span>
                            </div>

                            <p className="text-gray-700 mt-2">
                                {notice.content}
                            </p>

                            <div className="text-sm text-gray-400 mt-3">
                                {notice.author_email && (
                                    <span>
                                        {notice.author_email} ·{' '}
                                    </span>
                                )}

                                {new Date(
                                    notice.created_at
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NoticesPage;