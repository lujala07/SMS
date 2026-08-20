import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

import {
    deleteTeacher,
    getTeachers,
    updateTeacher,
    type Teacher
} from '../../services/teacherService';

import {
    getDepartments,
    type Department
} from '../../services/departmentService';

const emptyForm = {
    departmentId: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: ''
};

function TeachersPage() {
    const [teachers, setTeachers] =
        useState<Teacher[]>([]);
    const [departments, setDepartments] =
        useState<Department[]>([]);
    const [form, setForm] =
        useState(emptyForm);
    const [editingTeacher, setEditingTeacher] =
        useState<Teacher | null>(null);
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState('');
    const [success, setSuccess] =
        useState('');

    const loadData = async () => {
        const [
            teacherData,
            departmentData
        ] = await Promise.all([
            getTeachers(),
            getDepartments()
        ]);

        setTeachers(teacherData);
        setDepartments(departmentData);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadData();
            } catch {
                setError(
                    'Could not load teachers.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingTeacher(null);
        setError('');
        setSuccess('');
    };

    const startEdit = (
        teacher: Teacher
    ) => {
        setEditingTeacher(teacher);
        setForm({
            departmentId:
                teacher.department_id
                    ? String(teacher.department_id)
                    : '',
            firstName: teacher.first_name,
            lastName: teacher.last_name,
            phoneNumber:
                teacher.phone_number || '',
            address: teacher.address || ''
        });
        setError('');
        setSuccess('');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

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

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (
            !form.firstName.trim() ||
            !form.lastName.trim()
        ) {
            setError(
                'First name and last name are required.'
            );
            return;
        }

        if (!editingTeacher) {
            return;
        }

        setSaving(true);

        try {
            const departmentId =
                form.departmentId
                    ? Number(form.departmentId)
                    : undefined;

            const payload = {
                departmentId,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phoneNumber:
                    form.phoneNumber.trim() ||
                    undefined,
                address:
                    form.address.trim() ||
                    undefined
            };

            await updateTeacher(
                editingTeacher.id,
                payload
            );
            setSuccess(
                'Teacher updated successfully.'
            );

            await loadData();
            setForm(emptyForm);
            setEditingTeacher(null);
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not save teacher.'
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        teacher: Teacher
    ) => {
        const confirmed = window.confirm(
            `Delete ${teacher.first_name} ${teacher.last_name}?`
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await deleteTeacher(teacher.id);
            await loadData();
            setSuccess(
                'Teacher deleted successfully.'
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not delete teacher.'
                )
            );
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Teachers
                </h1>

                <p className="text-gray-500 mt-1">
                    View and update teacher records.
                </p>
            </div>

            {editingTeacher && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded shadow p-5 mb-6"
                >
                    <h2 className="font-semibold mb-4">
                        Edit Teacher
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            value={form.firstName}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    firstName:
                                        event.target.value
                                })
                            }
                            placeholder="First name"
                            className="border rounded p-2"
                        />

                        <input
                            value={form.lastName}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    lastName:
                                        event.target.value
                                })
                            }
                            placeholder="Last name"
                            className="border rounded p-2"
                        />

                        <input
                            value={form.phoneNumber}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    phoneNumber:
                                        event.target.value
                                })
                            }
                            placeholder="Phone number"
                            className="border rounded p-2"
                        />

                        <select
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
                                No department
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
                        </select>
                    </div>

                    <textarea
                        value={form.address}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                address: event.target.value
                            })
                        }
                        placeholder="Address"
                        rows={3}
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

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={resetForm}
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
                                : 'Update Teacher'}
                        </button>
                    </div>
                </form>
            )}

            {!editingTeacher && error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            {!editingTeacher && success && (
                <p className="text-green-600 mb-4">
                    {success}
                </p>
            )}

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3">
                                Teacher
                            </th>
                            <th className="text-left p-3">
                                Email
                            </th>
                            <th className="text-left p-3">
                                Department
                            </th>
                            <th className="text-left p-3">
                                Phone
                            </th>
                            <th className="text-left p-3">
                                Status
                            </th>
                            <th className="text-left p-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-4 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : teachers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No teachers available.
                                </td>
                            </tr>
                        ) : (
                            teachers.map((teacher) => (
                                <tr
                                    key={teacher.id}
                                    className="border-t"
                                >
                                    <td className="p-3 font-medium">
                                        {teacher.first_name}{' '}
                                        {teacher.last_name}
                                    </td>
                                    <td className="p-3">
                                        {teacher.email}
                                    </td>
                                    <td className="p-3">
                                        {teacher.department_name ||
                                            '-'}
                                    </td>
                                    <td className="p-3">
                                        {teacher.phone_number ||
                                            '-'}
                                    </td>
                                    <td className="p-3">
                                        {teacher.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startEdit(
                                                        teacher
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
                                                        teacher
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
            </div>
        </div>
    );
}

export default TeachersPage;
