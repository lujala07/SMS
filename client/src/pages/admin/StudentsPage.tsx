import TableToolbar from '../../components/TableToolbar';
import SortableHeader from '../../components/SortableHeader';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';
import {
    useEffect,
    useRef,
    useState
} from 'react';

import axios from 'axios';
import { mobileError, normalizeNepalMobile } from '../../utils/phone';
import { X } from 'lucide-react';
import './StudentsPage.css';
import { confirmDelete } from '../../components/confirmDelete';

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

const inputClassName = 'student-edit-input';

const emptyForm = {
    classId: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    gender: ''
};

function StudentsPage() {
    const editDialog = useRef<HTMLDialogElement>(null);
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

    const studentsPagination = usePagination(students, undefined, [
        { label: 'Code', value: 'student_code' },
        { label: 'Name', value: item => `${item.first_name} ${item.last_name}` },
        { label: 'Class', value: 'class_name' },
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone_number' }
    ]);

    useEffect(() => {
        if (editingStudent) editDialog.current?.showModal();
        else editDialog.current?.close();
    }, [editingStudent]);

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
        if (saving) return;
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
            firstName: student.first_name,
            lastName: student.last_name,
            phoneNumber:
                student.phone_number || '',
            address: student.address || '',
            gender: student.gender || ''
        });
        setError('');
        setSuccess('');
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
            !form.firstName.trim() ||
            !form.lastName.trim()
        ) {
            setError(
                'Class, first name and last name are required.'
            );
            return;
        }

        const mobile = normalizeNepalMobile(form.phoneNumber);
        if (!mobile) {
            setError(mobileError);
            return;
        }

        setSaving(true);

        try {
            await updateStudent(
                editingStudent.id,
                {
                    classId: Number(form.classId),
                    firstName:
                        form.firstName.trim(),
                    lastName:
                        form.lastName.trim(),
                    phoneNumber:
                        mobile,
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
        const confirmed = await confirmDelete(
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

            <dialog
                ref={editDialog}
                aria-labelledby="edit-student-title"
                onCancel={event => {
                    event.preventDefault();
                    resetForm();
                }}
                onClick={event => {
                    if (event.target !== event.currentTarget) return;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) resetForm();
                }}
                className="student-edit-modal"
            >
                {editingStudent && (
                    <form noValidate onSubmit={handleSubmit} aria-busy={saving} className="student-edit-form">
                        <header className="student-edit-header">
                            <div className="min-w-0">
                                <h2 id="edit-student-title" className="text-xl font-semibold text-gray-900">Edit student</h2>
                                <p className="mt-1 break-all text-sm text-gray-500">{editingStudent.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={resetForm} disabled={saving} aria-label="Close edit student" className="student-edit-close">
                                <X size={20} aria-hidden="true" />
                            </button>
                        </header>

                        <div className="student-edit-body">
                            <p className="student-edit-code">Student code: <span>{editingStudent.student_code}</span></p>
                            <div className="student-edit-fields">
                                <div>
                                    <label htmlFor="student-first-name" className="mb-1.5 block text-sm font-medium text-gray-700">First name</label>
                                    <input autoFocus id="student-first-name" value={form.firstName} onChange={event => setForm({ ...form, firstName: event.target.value })} className={inputClassName} />
                                </div>
                                <div>
                                    <label htmlFor="student-last-name" className="mb-1.5 block text-sm font-medium text-gray-700">Last name</label>
                                    <input id="student-last-name" value={form.lastName} onChange={event => setForm({ ...form, lastName: event.target.value })} className={inputClassName} />
                                </div>
                                <div>
                                    <label htmlFor="student-class" className="mb-1.5 block text-sm font-medium text-gray-700">Class</label>
                                    <select id="student-class" value={form.classId} onChange={event => setForm({ ...form, classId: event.target.value })} className={inputClassName}>
                                        <option value="">Select class</option>
                                        {classes.map(classItem => (
                                            <option key={classItem.id} value={classItem.id}>
                                                {classItem.name}{classItem.semester ? ` - Semester ${classItem.semester}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="student-gender" className="mb-1.5 block text-sm font-medium text-gray-700">Gender</label>
                                    <select id="student-gender" value={form.gender} onChange={event => setForm({ ...form, gender: event.target.value })} className={inputClassName}>
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="student-edit-fullwidth">
                                    <label htmlFor="student-phone" className="mb-1.5 block text-sm font-medium text-gray-700">Phone number</label>
                                    <input id="student-phone" type="tel" value={form.phoneNumber} onChange={event => setForm({ ...form, phoneNumber: event.target.value })} className={inputClassName} />
                                </div>
                                <div className="student-edit-fullwidth">
                                    <label htmlFor="student-address" className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
                                    <input id="student-address" type="text" value={form.address} onChange={event => setForm({ ...form, address: event.target.value })} className={inputClassName} />
                                </div>
                            </div>
                            {error && <p role="alert" className="student-edit-error">{error}</p>}
                        </div>

                        <footer className="student-edit-actions">
                            <button type="button" onClick={resetForm} disabled={saving}>Cancel</button>
                            <button type="submit" disabled={saving} className="student-edit-save">{saving ? 'Saving...' : 'Save changes'}</button>
                        </footer>
                    </form>
                )}
            </dialog>

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
                <TableToolbar {...studentsPagination} label="Students" />
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <SortableHeader column={0} {...studentsPagination} className="text-left p-3">
                                Code
                            </SortableHeader>
                            <SortableHeader column={1} {...studentsPagination} className="text-left p-3">
                                Name
                            </SortableHeader>
                            <SortableHeader column={2} {...studentsPagination} className="text-left p-3">
                                Class
                            </SortableHeader>
                            <SortableHeader column={3} {...studentsPagination} className="text-left p-3">
                                Email
                            </SortableHeader>
                            <SortableHeader column={4} {...studentsPagination} className="text-left p-3">
                                Phone
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
                            studentsPagination.items.map((student) => (
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
                <Pagination {...studentsPagination} label="Students" />
            </div>
        </div>
    );
}

export default StudentsPage;
