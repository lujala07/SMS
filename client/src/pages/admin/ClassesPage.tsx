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
    createClass,
    deleteClass,
    getClasses,
    updateClass,
    type ClassItem
} from '../../services/classService';

import {
    getDepartments,
    type Department
} from '../../services/departmentService';

const emptyForm = {
    departmentId: '',
    name: '',
    semester: '',
    academicYear: ''
};

function ClassesPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [classes, setClasses] =
        useState<ClassItem[]>([]);
    const [departments, setDepartments] =
        useState<Department[]>([]);
    const [form, setForm] =
        useState(emptyForm);
    const [editingClass, setEditingClass] =
        useState<ClassItem | null>(null);
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState('');
    const [success, setSuccess] =
        useState('');

    const loadData = async () => {
        const [classData, departmentData] =
            await Promise.all([
                getClasses(),
                getDepartments()
            ]);

        setClasses(classData);
        setDepartments(departmentData);
    };

    const classesPagination = usePagination(classes, undefined, [
        { label: 'Class', value: 'name' },
        { label: 'Department', value: 'department_name' },
        { label: 'Semester', value: 'semester', numeric: true },
        { label: 'Academic year', value: 'academic_year' }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadData();
            } catch {
                setError(
                    'Could not load classes.'
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
        setEditingClass(null);
        setError('');
        setSuccess('');
    };

    const startEdit = (
        classItem: ClassItem
    ) => {
        setFormOpen(true);
        setEditingClass(classItem);
        setForm({
            departmentId: String(
                classItem.department_id
            ),
            name: classItem.name,
            semester: classItem.semester
                ? String(classItem.semester)
                : '',
            academicYear:
                classItem.academic_year
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
            !form.departmentId ||
            !form.name.trim() ||
            !form.academicYear.trim()
        ) {
            setError(
                'Department, class name and academic year are required.'
            );
            return;
        }

        setSaving(true);

        try {
            const payload = {
                departmentId: Number(
                    form.departmentId
                ),
                name: form.name.trim(),
                semester: form.semester
                    ? Number(form.semester)
                    : undefined,
                academicYear:
                    form.academicYear.trim()
            };

            if (editingClass) {
                await updateClass(
                    editingClass.id,
                    payload
                );
                setSuccess(
                    'Class updated successfully.'
                );
            } else {
                await createClass(payload);
                setSuccess(
                    'Class created successfully.'
                );
            }

            await loadData();
            setForm(emptyForm);
            setEditingClass(null);
            setFormOpen(false);
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not save class.'
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        classItem: ClassItem
    ) => {
        const confirmed = await confirmDelete(
            `Delete ${classItem.name}?`
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await deleteClass(classItem.id);
            await loadData();
            setSuccess(
                'Class deleted successfully.'
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not delete class.'
                )
            );
        }
    };

    return (
        <div>
            <PageHeader title={<>
                    Classes
                </>} description={<>
                    Create and manage class records.
                </>} action={<button type="button" onClick={() => { resetForm(); setFormOpen(true); }} className="mb-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create Class</button>} />


            {!formOpen && error && <Alert tone="error">{error}</Alert>}
            {!formOpen && success && <Alert tone="success">{success}</Alert>}

            {formOpen && <EditModal open={formOpen} title={editingClass ? 'Edit class' : 'Create class'} busy={saving} onClose={resetForm}>
                <form noValidate
                    onSubmit={handleSubmit}
                    className="bg-white rounded shadow p-5 mb-6"
                >
                    <h2 className="font-semibold mb-4">
                        {editingClass
                            ? 'Edit Class'
                            : 'Create Class'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField label="Department"><select
                            value={form.departmentId}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    departmentId:
                                        event.target.value
                                })
                            }
                            className="border rounded p-2"
                        >
                            <option value="">
                                Select Department
                            </option>
                            {departments.map(
                                (department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.code} - {department.name}
                                    </option>
                                )
                            )}
                        </select></FormField>

                        <FormField label="Name"><input
                            value={form.name}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    name: event.target.value
                                })
                            }
                            placeholder="Class name"
                            className="border rounded p-2"
                        /></FormField>

                        <FormField label="Semester"><input
                            type="text"
                            inputMode="numeric"
                            value={form.semester}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    semester:
                                        event.target.value.replace(
                                            /\D/g,
                                            ''
                                        )
                                })
                            }
                            placeholder="Semester"
                            className="border rounded p-2"
                        /></FormField>

                        <FormField label="Academic year"><input
                            value={form.academicYear}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    academicYear:
                                        event.target.value
                                })
                            }
                            placeholder="Academic year"
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
                                : editingClass
                                  ? 'Update Class'
                                  : 'Create Class'}
                        </button>
                    </div>
                </form>
            </EditModal>}

            <div className="bg-white rounded shadow overflow-x-auto">
                <TableToolbar {...classesPagination} label="Classes" />
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <SortableHeader column={0} {...classesPagination} className="text-left p-3">
                                Class
                            </SortableHeader>
                            <SortableHeader column={1} {...classesPagination} className="text-left p-3">
                                Department
                            </SortableHeader>
                            <SortableHeader column={2} {...classesPagination} className="text-left p-3">
                                Semester
                            </SortableHeader>
                            <SortableHeader column={3} {...classesPagination} className="text-left p-3">
                                Academic Year
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
                                    colSpan={5}
                                    className="p-4 text-center"
                                ><LoadingState /></td>
                            </tr>
                        ) : classes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="p-4 text-center text-gray-500"
                                ><EmptyState title="No classes available." description="Use the button above to add the first record." /></td>
                            </tr>
                        ) : (
                            classesPagination.items.map((classItem) => (
                                <tr
                                    key={classItem.id}
                                    className="border-t"
                                >
                                    <td className="p-3 font-medium">
                                        {classItem.name}
                                    </td>
                                    <td className="p-3">
                                        {classItem.department_name ||
                                            '-'}
                                    </td>
                                    <td className="p-3">
                                        {classItem.semester ||
                                            '-'}
                                    </td>
                                    <td className="p-3">
                                        {classItem.academic_year}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startEdit(
                                                        classItem
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
                                                        classItem
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
                <Pagination {...classesPagination} label="Classes" />
            </div>
        </div>
    );
}

export default ClassesPage;
