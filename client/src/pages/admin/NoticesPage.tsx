import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

import {
    createNotice,
    deleteNotice,
    getNotices,
    updateNotice,
    type Notice
} from '../../services/noticeService';

const emptyForm = {
    title: '',
    content: '',
    audience: 'all'
};

function NoticesPage() {
    const [notices, setNotices] =
        useState<Notice[]>([]);
    const [form, setForm] =
        useState(emptyForm);
    const [editingNotice, setEditingNotice] =
        useState<Notice | null>(null);
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState('');
    const [success, setSuccess] =
        useState('');

    const loadNotices = async () => {
        const data = await getNotices();
        setNotices(data);
    };

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                await loadNotices();
            } catch {
                setError(
                    'Could not load notices.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const getErrorMessage = (
        error: unknown,
        fallback: string
    ) => {
        if (axios.isAxiosError(error)) {
            return (
                error.response?.data?.message ||
                fallback
            );
        }

        return fallback;
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingNotice(null);
        setError('');
        setSuccess('');
    };

    const startEdit = (
        notice: Notice
    ) => {
        setEditingNotice(notice);
        setForm({
            title: notice.title,
            content: notice.content,
            audience: notice.audience
        });
        setError('');
        setSuccess('');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (
            !form.title.trim() ||
            !form.content.trim() ||
            !form.audience
        ) {
            setError(
                'Title, content and audience are required.'
            );
            return;
        }

        setSaving(true);

        try {
            const payload = {
                title: form.title.trim(),
                content: form.content.trim(),
                audience: form.audience
            };

            if (editingNotice) {
                await updateNotice(
                    editingNotice.id,
                    payload
                );
                setSuccess(
                    'Notice updated successfully.'
                );
            } else {
                await createNotice(payload);
                setSuccess(
                    'Notice created successfully.'
                );
            }

            await loadNotices();
            setForm(emptyForm);
            setEditingNotice(null);
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not save notice.'
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        notice: Notice
    ) => {
        const confirmed = window.confirm(
            `Delete "${notice.title}"?`
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await deleteNotice(notice.id);
            await loadNotices();
            setSuccess(
                'Notice deleted successfully.'
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not delete notice.'
                )
            );
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Notices
                </h1>

                <p className="text-gray-500 mt-1">
                    Create and manage notices.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow p-5 mb-6"
            >
                <h2 className="font-semibold mb-4">
                    {editingNotice
                        ? 'Edit Notice'
                        : 'Create Notice'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        value={form.title}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                title: event.target.value
                            })
                        }
                        placeholder="Title"
                        className="border rounded p-2 md:col-span-2"
                    />

                    <select
                        value={form.audience}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                audience:
                                    event.target.value
                            })
                        }
                        className="border rounded p-2"
                    >
                        <option value="all">
                            All
                        </option>
                        <option value="teachers">
                            Teachers
                        </option>
                        <option value="students">
                            Students
                        </option>
                    </select>
                </div>

                <textarea
                    value={form.content}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            content: event.target.value
                        })
                    }
                    placeholder="Notice content"
                    rows={4}
                    className="border rounded p-2 w-full mt-4"
                />

                {error && (
                    <p className="text-red-500 mt-3">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-green-600 mt-3">
                        {success}
                    </p>
                )}

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded"
                    >
                        {saving
                            ? 'Saving...'
                            : editingNotice
                              ? 'Update Notice'
                              : 'Create Notice'}
                    </button>

                    {editingNotice && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

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
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {notice.title}
                                    </h2>

                                    <p className="text-sm text-gray-500 capitalize mt-1">
                                        {notice.audience}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            startEdit(
                                                notice
                                            )
                                        }
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                notice
                                            )
                                        }
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                                {notice.content}
                            </p>

                            <div className="text-sm text-gray-400 mt-3">
                                {notice.author_email && (
                                    <span>
                                        {notice.author_email}
                                        {' | '}
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
