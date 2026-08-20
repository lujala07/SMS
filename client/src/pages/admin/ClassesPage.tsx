import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

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
        setForm(emptyForm);
        setEditingClass(null);
        setError('');
        setSuccess('');
    };

    const startEdit = (
        classItem: ClassItem
    ) => {
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
        const confirmed = window.confirm(
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Classes
                </h1>

                <p className="text-gray-500 mt-1">
                    Create and manage class records.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow p-5 mb-6"
            >
                <h2 className="font-semibold mb-4">
                    {editingClass
                        ? 'Edit Class'
                        : 'Create Class'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    </select>

                    <input
                        value={form.name}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                name: event.target.value
                            })
                        }
                        placeholder="Class name"
                        className="border rounded p-2"
                    />

                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={form.semester}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                semester:
                                    event.target.value
                            })
                        }
                        placeholder="Semester"
                        className="border rounded p-2"
                    />

                    <input
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
                    />
                </div>

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

                    {editingClass && (
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

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3">
                                Class
                            </th>
                            <th className="text-left p-3">
                                Department
                            </th>
                            <th className="text-left p-3">
                                Semester
                            </th>
                            <th className="text-left p-3">
                                Academic Year
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
                                    colSpan={5}
                                    className="p-4 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : classes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No classes available.
                                </td>
                            </tr>
                        ) : (
                            classes.map((classItem) => (
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
            </div>
        </div>
    );
}

export default ClassesPage;
