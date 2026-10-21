import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';
import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';
import EditModal from '../../components/EditModal';
import { confirmDelete } from '../../components/confirmDelete';

import api from '../../services/api';

interface Notice {
    id: number;
    author_id: number;

    title: string;
    content: string;

    audience:
        | 'all'
        | 'teachers'
        | 'students';

    created_at: string;

    author_email?: string;
    author_role?: string;

    is_own?: boolean;
    status: 'pending' | 'approved' | 'rejected';
}

function TeacherNoticesPage() {
    const [
        notices,
        setNotices
    ] = useState<Notice[]>([]);

    const [
        title,
        setTitle
    ] = useState('');

    const [
        content,
        setContent
    ] = useState('');

    const [
        audience,
        setAudience
    ] = useState<
        'all' | 'students'
    >('students');

    const [
        editingId,
        setEditingId
    ] = useState<number | null>(
        null
    );

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        saving,
        setSaving
    ] = useState(false);

    const [
        error,
        setError
    ] = useState('');

    const [
        success,
        setSuccess
    ] = useState('');

    const loadNotices = async () => {
        const response =
            await api.get('/notices');

        setNotices(
            response.data
        );
    };

    const noticesPagination = usePagination(notices);

    useEffect(() => {
        const loadData =
            async () => {
                try {
                    await loadNotices();

                } catch (error) {
                    console.error(
                        error
                    );

                    setError(
                        'Could not load notices.'
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            };

        loadData();
    }, []);

    const clearForm = () => {
        setTitle('');
        setContent('');
        setAudience(
            'students'
        );
        setEditingId(
            null
        );
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (
            !title.trim() ||
            !content.trim()
        ) {
            setError(
                'Title and content are required.'
            );

            return;
        }

        setSaving(true);

        try {
            const data = {
                title:
                    title.trim(),

                content:
                    content.trim(),

                audience
            };

            if (
                editingId !== null
            ) {
                await api.put(
                    `/notices/${editingId}`,
                    data
                );

                setSuccess(
                    'Changes submitted for approval.'
                );

            } else {
                await api.post(
                    '/notices',
                    data
                );

                setSuccess(
                    'Notice submitted for approval.'
                );
            }

            clearForm();

            await loadNotices();

        } catch (error) {
            console.error(
                error
            );

            if (
                axios.isAxiosError(
                    error
                )
            ) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                        'Could not save notice.'
                );
            } else {
                setError(
                    'Could not save notice.'
                );
            }

        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (
        notice: Notice
    ) => {
        setEditingId(
            notice.id
        );

        setTitle(
            notice.title
        );

        setContent(
            notice.content
        );

        if (
            notice.audience ===
            'all'
        ) {
            setAudience('all');
        } else {
            setAudience(
                'students'
            );
        }

        setError('');
        setSuccess('');

    };

    const handleCancelEdit =
        () => {
            if (saving) return;
            clearForm();
            setError('');
            setSuccess('');
        };

    const handleDelete = async (
        id: number
    ) => {
        const confirmed =
            await confirmDelete(
                'Delete this notice?'
            );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await api.delete(
                `/notices/${id}`
            );

            if (
                editingId === id
            ) {
                clearForm();
            }

            setSuccess(
                'Notice deleted successfully.'
            );

            await loadNotices();

        } catch (error) {
            console.error(
                error
            );

            if (
                axios.isAxiosError(
                    error
                )
            ) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                        'Could not delete notice.'
                );
            } else {
                setError(
                    'Could not delete notice.'
                );
            }
        }
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Notices
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
                    Notices
                </h1>

                <p className="text-gray-500 mt-1">
                    Submit notices for approval and view announcements.
                </p>
            </div>

            <EditModal open={Boolean(editingId)} title="Edit notice" busy={saving} onClose={handleCancelEdit}>
                <div className="bg-white rounded shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            {editingId
                                ? 'Edit Notice'
                                : 'Submit Notice'}
                        </h2>

                        {editingId && (
                            <button
                                type="button"
                                onClick={
                                    handleCancelEdit
                                }
                                className="text-gray-600 hover:underline"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form noValidate
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-4"
                    >
                        <div>
                            <label className="block font-medium mb-1">
                                Title
                            </label>

                            <input
                                type="text"
                                value={
                                    title
                                }
                                onChange={(
                                    event
                                ) =>
                                    setTitle(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Notice title"
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Audience
                            </label>

                            <select
                                value={
                                    audience
                                }
                                onChange={(
                                    event
                                ) =>
                                    setAudience(
                                        event
                                            .target
                                            .value as
                                            | 'all'
                                            | 'students'
                                    )
                                }
                                className="w-full border rounded p-2"
                            >
                                <option value="students">
                                    Students
                                </option>

                                <option value="all">
                                    Everyone
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Content
                            </label>

                            <textarea
                                value={
                                    content
                                }
                                onChange={(
                                    event
                                ) =>
                                    setContent(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                rows={5}
                                placeholder="Write the notice..."
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={
                                saving
                            }
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded"
                        >
                            {saving
                                ? 'Saving...'
                                : editingId
                                  ? 'Update Notice'
                                  : 'Submit for approval'}
                        </button>
                    </form>

                    {error && (
                        <p className="text-red-500 mt-4">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-green-600 mt-4">
                            {success}
                        </p>
                    )}
                </div>
            </EditModal>

            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Notices
                </h2>

                {notices.length ===
                0 ? (
                    <div className="bg-white rounded shadow p-6 text-gray-500">
                        No notices available.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {noticesPagination.items.map(
                            (
                                notice
                            ) => (
                                <div
                                    key={
                                        notice.id
                                    }
                                    className="bg-white rounded shadow p-5"
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {
                                                    notice.title
                                                }
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Audience:{' '}
                                                <span className="capitalize">
                                                    {
                                                        notice.audience
                                                    }
                                                </span>
                                            </p>
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                notice.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <p className="mt-4 whitespace-pre-wrap">
                                        {
                                            notice.content
                                        }
                                    </p>

                                    <p className="text-sm text-gray-500 mt-4">
                                        Posted by:{' '}
                                        {
                                            notice.author_email
                                        }
                                    </p>

                                    {notice.is_own && (
                                        <p className="mt-2 text-sm text-gray-600">{notice.status === 'pending' ? <span style={{ color: '#92400e', fontWeight: 500 }}>Pending approval</span> : notice.status === 'rejected' ? 'Rejected' : 'Published'}</p>
                                    )}

                                    {notice.is_own && (
                                        <div className="flex gap-4 mt-4 border-t pt-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
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
                                                        notice.id
                                                    )
                                                }
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            <Pagination {...noticesPagination} label="Notices" />
        </div>
    );
}

export default TeacherNoticesPage;
