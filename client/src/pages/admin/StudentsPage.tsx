import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

import {
    getClasses,
    type ClassItem
} from '../../services/classService';

import {
    deleteStudent,
    getStudents,
    updateStudent,
    type Student
} from '../../services/studentService';

const emptyForm = {
    classId: '',
    studentCode: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    gender: ''
};

function StudentsPage() {
    const [students, setStudents] =
        useState<Student[]>([]);
    const [classes, setClasses] =
        useState<ClassItem[]>([]);
    const [form, setForm] =
        useState(emptyForm);
    const [editingStudent, setEditingStudent] =
        useState<Student | null>(null);
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState('');
    const [success, setSuccess] =
        useState('');

    const loadData = async () => {
        const [studentData, classData] =
            await Promise.all([
                getStudents(),
                getClasses()
            ]);

        setStudents(studentData);
        setClasses(classData);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadData();
            } catch {
                setError(
                    'Could not load students.'
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
        setEditingStudent(null);
        setError('');
        setSuccess('');
    };

    const startEdit = (
        student: Student
    ) => {
        setEditingStudent(student);
        setForm({
            classId: String(student.class_id),
            studentCode: student.student_code,
            firstName: student.first_name,
            lastName: student.last_name,
            phoneNumber:
                student.phone_number || '',
            address: student.address || '',
            gender: student.gender || ''
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

        if (!editingStudent) {
            return;
        }

        setError('');
        setSuccess('');

        if (
            !form.classId ||
            !form.studentCode.trim() ||
            !form.firstName.trim() ||
            !form.lastName.trim()
        ) {
            setError(
                'Class, student code, first name and last name are required.'
            );
            return;
        }

        setSaving(true);

        try {
            await updateStudent(
                editingStudent.id,
                {
                    classId: Number(form.classId),
                    studentCode:
                        form.studentCode.trim(),
                    firstName:
                        form.firstName.trim(),
                    lastName:
                        form.lastName.trim(),
                    phoneNumber:
                        form.phoneNumber.trim() ||
                        undefined,
                    address:
                        form.address.trim() ||
                        undefined,
                    gender:
                        form.gender || undefined
                }
            );

            await loadData();
            setForm(emptyForm);
            setEditingStudent(null);
            setSuccess(
                'Student updated successfully.'
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not update student.'
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        student: Student
    ) => {
        const confirmed = window.confirm(
            `Delete ${student.first_name} ${student.last_name}?`
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await deleteStudent(student.id);
            await loadData();
            setSuccess(
                'Student deleted successfully.'
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    'Could not delete student.'
                )
            );
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Students
                </h1>

                <p className="text-gray-500 mt-1">
                    View and manage student accounts.
                </p>
            </div>

            {editingStudent && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded shadow p-5 mb-6"
                >
                    <h2 className="font-semibold mb-4">
                        Edit Student
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
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
                        </select>

                        <input
                            value={form.studentCode}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    studentCode:
                                        event.target.value
                                })
                            }
                            placeholder="Student code"
                            className="border rounded p-2"
                        />

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
                            value={form.gender}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    gender:
                                        event.target.value
                                })
                            }
                            className="border rounded p-2"
                        >
                            <option value="">
                                Select Gender
                            </option>
                            <option value="male">
                                Male
                            </option>
                            <option value="female">
                                Female
                            </option>
                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    <textarea
                        value={form.address}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                address:
                                    event.target.value
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
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded"
                        >
                            {saving
                                ? 'Saving...'
                                : 'Update Student'}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {!editingStudent && error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            {!editingStudent && success && (
                <p className="text-green-600 mb-4">
                    {success}
                </p>
            )}

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3">
                                Code
                            </th>
                            <th className="text-left p-3">
                                Name
                            </th>
                            <th className="text-left p-3">
                                Class
                            </th>
                            <th className="text-left p-3">
                                Email
                            </th>
                            <th className="text-left p-3">
                                Phone
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
                        ) : students.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No students available.
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {student.student_code}
                                    </td>
                                    <td className="p-3 font-medium">
                                        {student.first_name}{' '}
                                        {student.last_name}
                                    </td>
                                    <td className="p-3">
                                        {student.class_name ||
                                            student.class_id}
                                    </td>
                                    <td className="p-3">
                                        {student.email}
                                    </td>
                                    <td className="p-3">
                                        {student.phone_number ||
                                            '-'}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startEdit(
                                                        student
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
                                                        student
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

export default StudentsPage;
