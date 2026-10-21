import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import FormField from '../../components/FormField';
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

import {
    getClasses,
    type ClassItem
} from '../../services/classService';

import {
    createSubject,
    deleteSubject,
    getSubjects,
    updateSubject,
    type Subject
} from '../../services/subjectService';

const emptyForm = {
    classId: '',
    name: '',
    code: ''
};

function SubjectsPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [subjects, setSubjects] =
        useState<Subject[]>([]);
    const [classes, setClasses] =
        useState<ClassItem[]>([]);
    const [form, setForm] =
        useState(emptyForm);
    const [editingSubject, setEditingSubject] =
        useState<Subject | null>(null);
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState('');
    const [success, setSuccess] =
        useState('');

    const loadData = async () => {
        const [subjectData, classData] =
            await Promise.all([
                getSubjects(),
                getClasses()
            ]);

        setSubjects(subjectData);
        setClasses(classData);
    };

    const subjectsPagination = usePagination(subjects, undefined, [
        { label: 'Code', value: 'code' },
        { label: 'Subject', value: 'name' },
        { label: 'Class', value: 'class_name' }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadData();
            } catch {
                setError(
                    'Could not load subjects.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
        if (saving) return;
        setFormOpen(false);
        setForm(emptyForm);
        setEditingSubject(null);
        setError('');
        setSuccess('');
    };

    const startEdit = (
        subject: Subject
    ) => {
        setFormOpen(true);
        setEditingSubject(subject);
        setForm({
            classId: String(subject.class_id),
            name: subject.name,
            code: subject.code
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();
        if (saving) return;
        setError('');
        setSuccess('');

        if (
            !form.classId ||
            !form.name.trim() ||
            !form.code.trim()
        ) {
            setError(
                'Class, subject name and code are required.'
            );
            return;
        }

        setSaving(true);

        try {
            const payload = {
                classId: Number(form.classId),
                name: form.name.trim(),
                code: form.code.trim()
            };

            if (editingSubject) {
                await updateSubject(
                    editingSubject.id,
                    payload
                );
                setSuccess(
                    'Subject updated successfully.'
                );
            } else {
                await createSubject(payload);
                setSuccess(
                    'Subject created successfully.'
                );
            }

            await loadData();
            setForm(emptyForm);
            setEditingSubject(null);
            setFormOpen(false);
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not save subject.'
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        subject: Subject
    ) => {
        const confirmed = await confirmDelete(
            `Delete ${subject.name}?`
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await deleteSubject(subject.id);
            await loadData();
            setSuccess(
                'Subject deleted successfully.'
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not delete subject.'
                )
            );
        }
    };

    return (
        <div>
            <PageHeader title={<>
                    Subjects
                </>} description={<>
                    Create and manage subjects.
                </>} action={<button type="button" onClick={() => { resetForm(); setFormOpen(true); }} className="mb-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create Subject</button>} />


            {!formOpen && error && <Alert tone="error">{error}</Alert>}
            {!formOpen && success && <Alert tone="success">{success}</Alert>}

            {formOpen && <EditModal open={formOpen} title={editingSubject ? 'Edit subject' : 'Create subject'} busy={saving} onClose={resetForm}>
                <form noValidate
                    onSubmit={handleSubmit}
                    className="bg-white rounded shadow p-5 mb-6"
                >
                    <h2 className="font-semibold mb-4">
                        {editingSubject
                            ? 'Edit Subject'
                            : 'Create Subject'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Class"><select
                            value={form.classId}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    classId:
                                        event.target.value
                                })
                            }
                            className="border rounded p-2"
                        >
                            <option value="">
                                Select Class
                            </option>
                            {classes.map((classItem) => (
                                <option
                                    key={classItem.id}
                                    value={classItem.id}
                                >
                                    {classItem.name}
                                    {classItem.semester
                                        ? ` - Semester ${classItem.semester}`
                                        : ''}
                                </option>
                            ))}
                        </select></FormField>

                        <FormField label="Name"><input
                            value={form.name}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    name: event.target.value
                                })
                            }
                            placeholder="Subject name"
                            className="border rounded p-2"
                        /></FormField>

                        <FormField label="Code"><input
                            value={form.code}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    code: event.target.value
                                })
                            }
                            placeholder="Code"
                            className="border rounded p-2"
                        /></FormField>
                    </div>

                    {error && (
                        <Alert tone="error">{error}</Alert>
                    )}

                    {success && (
                        <Alert tone="success">{success}</Alert>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded"
                        >
                            {saving
                                ? 'Saving...'
                                : editingSubject
                                  ? 'Update Subject'
                                  : 'Create Subject'}
                        </button>
                    </div>
                </form>
            </EditModal>}

            <div className="bg-white rounded shadow overflow-x-auto">
                <TableToolbar {...subjectsPagination} label="Subjects" />
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <SortableHeader column={0} {...subjectsPagination} className="text-left p-3">
                                Code
                            </SortableHeader>
                            <SortableHeader column={1} {...subjectsPagination} className="text-left p-3">
                                Subject
                            </SortableHeader>
                            <SortableHeader column={2} {...subjectsPagination} className="text-left p-3">
                                Class
                            </SortableHeader>
                            <th className="text-left p-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4 text-center"
                                ><LoadingState /></td>
                            </tr>
                        ) : subjects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4 text-center text-gray-500"
                                ><EmptyState title="No subjects available." description="Use the button above to add the first record." /></td>
                            </tr>
                        ) : (
                            subjectsPagination.items.map((subject) => (
                                <tr
                                    key={subject.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {subject.code}
                                    </td>
                                    <td className="p-3 font-medium">
                                        {subject.name}
                                    </td>
                                    <td className="p-3">
                                        {subject.class_name ||
                                            subject.class_id}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startEdit(
                                                        subject
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
                                                        subject
                                                    )
                                                }
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination {...subjectsPagination} label="Subjects" />
            </div>
        </div>
    );
}

export default SubjectsPage;
