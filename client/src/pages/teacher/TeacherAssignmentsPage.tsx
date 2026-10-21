import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import TableToolbar from '../../components/TableToolbar';
import SortableHeader from '../../components/SortableHeader';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';
import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';
import EditModal from '../../components/EditModal';
import { confirmDelete } from '../../components/confirmDelete';
import { today } from '../../utils/date';

import api from '../../services/api';

interface Subject {
    id: number;
    name: string;
    code: string;
    class_name?: string;
    semester?: number;
    academic_year?: string;
}

interface Assignment {
    id: number;
    subject_id: number;
    title: string;
    description?: string;
    due_date: string;
    total_marks: number;
    subject_name?: string;
    subject_code?: string;
}

function TeacherAssignmentsPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [subjects, setSubjects] =
        useState<Subject[]>([]);

    const [assignments, setAssignments] =
        useState<Assignment[]>([]);

    const [subjectId, setSubjectId] =
        useState('');

    const [title, setTitle] =
        useState('');

    const [description, setDescription] =
        useState('');

    const [dueDate, setDueDate] =
        useState('');

    const [totalMarks, setTotalMarks] =
        useState('');

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    const loadAssignments = async () => {
        const response =
            await api.get('/assignments');

        setAssignments(response.data);
    };

    const assignmentsPagination = usePagination(assignments, undefined, [
        { label: 'Title', value: 'title' },
        { label: 'Subject', value: item => `${item.subject_code ?? ''} ${item.subject_name ?? ''}` },
        { label: 'Due date', value: 'due_date' },
        { label: 'Marks', value: 'total_marks', numeric: true }
    ]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    subjectResponse,
                    assignmentResponse
                ] = await Promise.all([
                    api.get(
                        '/assignments/teacher/subjects'
                    ),
                    api.get('/assignments')
                ]);

                setSubjects(
                    subjectResponse.data
                );

                setAssignments(
                    assignmentResponse.data
                );

            } catch (error) {
                console.error(error);

                setError(
                    'Could not load assignments.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const clearForm = () => {
        setFormOpen(false);
        setSubjectId('');
        setTitle('');
        setDescription('');
        setDueDate('');
        setTotalMarks('');
        setEditingId(null);
    };

    const handleMarksChange = (
        value: string
    ) => {
        if (
            value === '' ||
            /^\d*\.?\d*$/.test(value)
        ) {
            setTotalMarks(value);
        }
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();
        if (saving) return;

        setError('');
        setSuccess('');

        if (
            !subjectId ||
            !title.trim() ||
            !dueDate ||
            !totalMarks
        ) {
            setError(
                'Subject, title, due date and total marks are required.'
            );
            return;
        }

        if (
            Number(totalMarks) <= 0 ||
            Number.isNaN(Number(totalMarks))
        ) {
            setError(
                'Total marks must be greater than zero.'
            );
            return;
        }

        if (dueDate < today()) {
            setError('Due date cannot be in the past.');
            return;
        }

        setSaving(true);

        const data = {
            subjectId:
                Number(subjectId),

            title:
                title.trim(),

            description:
                description.trim(),

            dueDate,

            totalMarks:
                Number(totalMarks)
        };

        try {
            if (editingId !== null) {
                await api.put(
                    `/assignments/${editingId}`,
                    data
                );

                setSuccess(
                    'Assignment updated successfully.'
                );
            } else {
                await api.post(
                    '/assignments',
                    data
                );

                setSuccess(
                    'Assignment created successfully.'
                );
            }

            clearForm();

            await loadAssignments();

        } catch (error) {
            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    'Could not save assignment.'
                );
            } else {
                setError(
                    'Could not save assignment.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (
        assignment: Assignment
    ) => {
        setFormOpen(true);
        setEditingId(
            assignment.id
        );

        setSubjectId(
            String(
                assignment.subject_id
            )
        );

        setTitle(
            assignment.title
        );

        setDescription(
            assignment.description || ''
        );

        setDueDate(
            assignment.due_date
                ? assignment.due_date
                      .split('T')[0]
                : ''
        );

        setTotalMarks(
            String(
                assignment.total_marks
            )
        );

        setError('');
        setSuccess('');

    };

    const handleCancelEdit = () => {
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
                'Delete this assignment?'
            );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await api.delete(
                `/assignments/${id}`
            );

            if (editingId === id) {
                clearForm();
            }

            setSuccess(
                'Assignment deleted successfully.'
            );

            await loadAssignments();

        } catch (error) {
            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    'Could not delete assignment.'
                );
            } else {
                setError(
                    'Could not delete assignment.'
                );
            }
        }
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Assignments
                </h1>

                <div className="bg-white p-4 rounded shadow"><LoadingState /></div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title={<>
                    Assignments
                </>} description={<>
                    Create and manage assignments for your subjects.
                </>} action={<button type="button" onClick={() => { clearForm(); setError(''); setSuccess(''); setFormOpen(true); }} className="mb-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create Assignment</button>} />


            {!formOpen && error && <Alert tone="error">{error}</Alert>}
            {!formOpen && success && <Alert tone="success">{success}</Alert>}

            {formOpen && <EditModal open={formOpen} title={editingId !== null ? 'Edit assignment' : 'Create assignment'} busy={saving} onClose={handleCancelEdit}>
                <div className="bg-white p-6 rounded shadow mb-6">
                    <div className="modal-legacy-heading flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {editingId
                                ? 'Edit Assignment'
                                : 'Create Assignment'}
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
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div className="md:col-span-2">
                            <label htmlFor="teacherassignmentspage-field-0" className="block mb-1 font-medium">
                                Subject
                            </label>

                            <select id="teacherassignmentspage-field-0"
                                value={subjectId}
                                onChange={(event) =>
                                    setSubjectId(
                                        event.target.value
                                    )
                                }
                                className="w-full border p-2 rounded"
                            >
                                <option value="">
                                    Select Subject
                                </option>

                                {subjects.map(
                                    (subject) => (
                                        <option
                                            key={
                                                subject.id
                                            }
                                            value={
                                                subject.id
                                            }
                                        >
                                            {
                                                subject.code
                                            }
                                            {' - '}
                                            {
                                                subject.name
                                            }

                                            {subject.class_name
                                                ? ` | ${subject.class_name}`
                                                : ''}

                                            {subject.semester
                                                ? ` Semester ${subject.semester}`
                                                : ''}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="teacherassignmentspage-field-1" className="block mb-1 font-medium">
                                Title
                            </label>

                            <input id="teacherassignmentspage-field-1"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value
                                    )
                                }
                                placeholder="Assignment title"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="teacherassignmentspage-field-2" className="block mb-1 font-medium">
                                Description
                            </label>

                            <textarea id="teacherassignmentspage-field-2"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Assignment description"
                                rows={4}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label htmlFor="teacherassignmentspage-field-3" className="block mb-1 font-medium">
                                Due Date
                            </label>

                            <input id="teacherassignmentspage-field-3"
                                type="date"
                                value={dueDate}
                                onChange={(event) =>
                                    setDueDate(
                                        event.target.value
                                    )
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label htmlFor="teacherassignmentspage-field-4" className="block mb-1 font-medium">
                                Total Marks
                            </label>

                            <input id="teacherassignmentspage-field-4"
                                type="text"
                                inputMode="decimal"
                                value={totalMarks}
                                onChange={(event) =>
                                    handleMarksChange(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. 20"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3">
                            <button type="button" disabled={saving} onClick={handleCancelEdit} className="rounded border px-4 py-2">Cancel</button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded"
                            >
                                {saving
                                    ? editingId
                                        ? 'Updating...'
                                        : 'Creating...'
                                    : editingId
                                      ? 'Update Assignment'
                                      : 'Create Assignment'}
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
                    My Assignments
                </h2>

                <div className="bg-white rounded shadow overflow-x-auto">
                    <TableToolbar {...assignmentsPagination} label="Assignments" />
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <SortableHeader column={0} {...assignmentsPagination} className="text-left p-3">
                                    Title
                                </SortableHeader>

                                <SortableHeader column={1} {...assignmentsPagination} className="text-left p-3">
                                    Subject
                                </SortableHeader>

                                <SortableHeader column={2} {...assignmentsPagination} className="text-left p-3">
                                    Due Date
                                </SortableHeader>

                                <SortableHeader column={3} {...assignmentsPagination} className="text-left p-3">
                                    Marks
                                </SortableHeader>

                                <th className="text-left p-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {assignments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-4 text-center text-gray-500"
                                    ><EmptyState title="No assignments available." description="Use the button above to add the first record." /></td>
                                </tr>
                            ) : (
                                assignmentsPagination.items.map(
                                    (
                                        assignment
                                    ) => (
                                        <tr
                                            key={
                                                assignment.id
                                            }
                                            className="border-t"
                                        >
                                            <td className="p-3">
                                                {
                                                    assignment.title
                                                }

                                                {assignment.description && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {
                                                            assignment.description
                                                        }
                                                    </p>
                                                )}
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
                                                    assignment.total_marks
                                                }
                                            </td>

                                            <td className="p-3">
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                assignment
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
                                                                assignment.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                    <Pagination {...assignmentsPagination} label="Assignments" />
                </div>
            </div>
        </div>
    );
}

export default TeacherAssignmentsPage;
