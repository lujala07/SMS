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
    createDepartment,
    deleteDepartment,
    getDepartments,
    updateDepartment,
    type Department
} from '../../services/departmentService';

const emptyForm = {
    name: '',
    code: ''
};

function DepartmentsPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [departments, setDepartments] =
        useState<Department[]>([]);
    const [form, setForm] =
        useState(emptyForm);
    const [editingDepartment, setEditingDepartment] =
        useState<Department | null>(null);
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState('');
    const [success, setSuccess] =
        useState('');

    const loadDepartments = async () => {
        const data = await getDepartments();
        setDepartments(data);
    };

    const departmentsPagination = usePagination(departments, undefined, [
        { label: 'Code', value: 'code' },
        { label: 'Department', value: 'name' }
    ]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                await loadDepartments();
            } catch {
                setError(
                    'Could not load departments.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
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
        setEditingDepartment(null);
        setError('');
        setSuccess('');
    };

    const startEdit = (
        department: Department
    ) => {
        setFormOpen(true);
        setEditingDepartment(department);
        setForm({
            name: department.name,
            code: department.code
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
            !form.name.trim() ||
            !form.code.trim()
        ) {
            setError(
                'Name and code are required.'
            );
            return;
        }

        setSaving(true);

        try {
            const payload = {
                name: form.name.trim(),
                code: form.code.trim()
            };

            if (editingDepartment) {
                await updateDepartment(
                    editingDepartment.id,
                    payload
                );
                setSuccess(
                    'Department updated successfully.'
                );
            } else {
                await createDepartment(payload);
                setSuccess(
                    'Department created successfully.'
                );
            }

            await loadDepartments();
            setForm(emptyForm);
            setEditingDepartment(null);
            setFormOpen(false);
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not save department.'
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        department: Department
    ) => {
        const confirmed = await confirmDelete(
            `Delete ${department.name}?`
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await deleteDepartment(
                department.id
            );
            await loadDepartments();
            setSuccess(
                'Department deleted successfully.'
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not delete department.'
                )
            );
        }
    };

    return (
        <div>
            <PageHeader title={<>
                    Departments
                </>} description={<>
                    Create and manage academic departments.
                </>} action={<button type="button" onClick={() => { resetForm(); setFormOpen(true); }} className="mb-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create Department</button>} />


            {!formOpen && error && <Alert tone="error">{error}</Alert>}
            {!formOpen && success && <Alert tone="success">{success}</Alert>}

            {formOpen && <EditModal open={formOpen} title={editingDepartment ? 'Edit department' : 'Create department'} busy={saving} onClose={resetForm}>
                <form noValidate
                    onSubmit={handleSubmit}
                    className="bg-white rounded shadow p-5 mb-6"
                >
                    <h2 className="font-semibold mb-4">
                        {editingDepartment
                            ? 'Edit Department'
                            : 'Create Department'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Name"><input
                            value={form.name}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    name: event.target.value
                                })
                            }
                            placeholder="Department name"
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
                                : editingDepartment
                                  ? 'Update Department'
                                  : 'Create Department'}
                        </button>
                    </div>
                </form>
            </EditModal>}

            <div className="bg-white rounded shadow overflow-x-auto">
                <TableToolbar {...departmentsPagination} label="Departments" />
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <SortableHeader column={0} {...departmentsPagination} className="text-left p-3">
                                Code
                            </SortableHeader>
                            <SortableHeader column={1} {...departmentsPagination} className="text-left p-3">
                                Department
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
                                    colSpan={3}
                                    className="p-4 text-center"
                                ><LoadingState /></td>
                            </tr>
                        ) : departments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-4 text-center text-gray-500"
                                ><EmptyState title="No departments available." description="Use the button above to add the first record." /></td>
                            </tr>
                        ) : (
                            departmentsPagination.items.map(
                                (department) => (
                                    <tr
                                        key={department.id}
                                        className="border-t"
                                    >
                                        <td className="p-3">
                                            {department.code}
                                        </td>
                                        <td className="p-3 font-medium">
                                            {department.name}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startEdit(
                                                            department
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
                                                            department
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
                <Pagination {...departmentsPagination} label="Departments" />
            </div>
        </div>
    );
}

export default DepartmentsPage;
