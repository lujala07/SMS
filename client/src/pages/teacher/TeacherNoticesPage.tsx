import StatusBadge from '../../components/StatusBadge';
import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
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
    const [formOpen, setFormOpen] = useState(false);
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
        setFormOpen(false);
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
        if (saving) return;

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
        setFormOpen(true);
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

                <div className="bg-white rounded shadow p-6"><LoadingState /></div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title={<>
                    Notices
                </>} description={<>
                    Submit notices for approval and view announcements.
                </>} action={<button type="button" onClick={() => { clearForm(); setError(''); setSuccess(''); setFormOpen(true); }} className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Create Notice
                </button>} />

            {!formOpen && error && <Alert tone="error">{error}</Alert>}
            {!formOpen && success && <Alert tone="success">{success}</Alert>}

            {formOpen && <EditModal open={formOpen} title={editingId !== null ? 'Edit notice' : 'Create notice'} busy={saving} onClose={handleCancelEdit}>
                <div className="bg-white rounded shadow p-6 mb-6">
                    <div className="modal-legacy-heading flex justify-between items-center mb-4">
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
                            <label htmlFor="teachernoticespage-field-0" className="block font-medium mb-1">
                                Title
                            </label>

                            <input id="teachernoticespage-field-0"
                                type="text"
                                aria-label="Title"
                                maxLength={255}
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
                            <label htmlFor="teachernoticespage-field-1" className="block font-medium mb-1">
                                Audience
                            </label>

                            <select id="teachernoticespage-field-1"
                                aria-label="Audience"
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
                            <label htmlFor="teachernoticespage-field-2" className="block font-medium mb-1">
                                Content
                            </label>

                            <textarea id="teachernoticespage-field-2"
                                aria-label="Content"
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

                        <div className="flex justify-end gap-3">
                            <button type="button" disabled={saving} onClick={handleCancelEdit} className="rounded border px-4 py-2">
                                Cancel
                            </button>
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
                        </div>
                    </form>

                    {error && (
                        <Alert tone="error">{error}</Alert>
                    )}

                    {success && (
                        <Alert tone="success">{success}</Alert>
                    )}
                </div>
            </EditModal>}

            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Notices
                </h2>

                {notices.length ===
                0 ? (
                    <div className="bg-white rounded shadow p-6 text-gray-500"><EmptyState title="No notices available." description="Use the button above to add the first record." /></div>
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
                                        <p className="mt-2 text-sm text-gray-600"><StatusBadge status={notice.status === 'pending' ? 'Pending approval' : notice.status === 'rejected' ? 'Rejected' : 'Published'} /></p>
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
