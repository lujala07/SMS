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

import api from '../../services/api';

interface Teacher {
    id: number;
    first_name: string;
    last_name: string;
    department_name?: string;
}

interface Subject {
    id: number;
    name: string;
    code: string;
    class_name?: string;
}

interface TeacherSubject {
    id: number;

    teacher_id: number;
    subject_id: number;

    teacher_name: string;

    subject_name: string;
    subject_code: string;

    class_name?: string;
    semester?: number;
}

function TeacherSubjectsPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [teachers, setTeachers] =
        useState<Teacher[]>([]);

    const [subjects, setSubjects] =
        useState<Subject[]>([]);

    const [assignments, setAssignments] =
        useState<TeacherSubject[]>([]);

    const [teacherId, setTeacherId] =
        useState('');

    const [subjectId, setSubjectId] =
        useState('');

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
            await api.get(
                '/teacher-subjects'
            );

        setAssignments(response.data);
    };

    const teacherSubjectsPagination = usePagination(assignments, undefined, [
        { label: 'Teacher', value: 'teacher_name' },
        { label: 'Subject', value: 'subject_name' },
        { label: 'Code', value: 'subject_code' },
        { label: 'Class', value: item => `${item.class_name ?? ''} ${item.semester ? `Semester ${item.semester}` : ''}` }
    ]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    teacherResponse,
                    subjectResponse,
                    assignmentResponse
                ] = await Promise.all([
                    api.get('/teachers'),
                    api.get('/subjects'),
                    api.get(
                        '/teacher-subjects'
                    )
                ]);

                setTeachers(
                    teacherResponse.data
                );

                setSubjects(
                    subjectResponse.data
                );

                setAssignments(
                    assignmentResponse.data
                );

            } catch (error) {
                console.error(error);

                setError(
                    'Could not load teacher-subject data.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const closeForm = () => {
        if (saving) return;
        setFormOpen(false);
        setTeacherId('');
        setSubjectId('');
        setError('');
        setSuccess('');
    };

    const handleAssign = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();
        if (saving) return;

        setError('');
        setSuccess('');

        if (
            !teacherId ||
            !subjectId
        ) {
            setError(
                'Please select a teacher and subject.'
            );

            return;
        }

        setSaving(true);

        try {
            await api.post(
                '/teacher-subjects',
                {
                    teacherId:
                        Number(teacherId),

                    subjectId:
                        Number(subjectId)
                }
            );

            setSuccess(
                'Teacher assigned successfully.'
            );

            setTeacherId('');
            setSubjectId('');

            await loadAssignments();
            setFormOpen(false);

        } catch (error) {
            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    'Could not assign teacher.'
                );
            } else {
                setError(
                    'Could not assign teacher.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        id: number
    ) => {
        const confirmed =
            await confirmDelete(
                'Remove this teacher-subject assignment?'
            );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await api.delete(
                `/teacher-subjects/${id}`
            );

            setSuccess(
                'Assignment removed successfully.'
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
                    'Could not remove assignment.'
                );
            } else {
                setError(
                    'Could not remove assignment.'
                );
            }
        }
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Teacher Subjects
                </h1>

                <div className="bg-white p-4 rounded shadow">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Teacher Subjects
                </h1>

                <p className="text-gray-500 mt-1">
                    Assign teachers to subjects.
                </p>
            </div>

            <button type="button" onClick={() => { closeForm(); setFormOpen(true); }} className="mb-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Assign Teacher</button>
            {!formOpen && error && <p role="alert" className="mb-4 text-red-500">{error}</p>}
            {!formOpen && success && <p role="status" className="mb-4 text-green-600">{success}</p>}

            {formOpen && <EditModal open={formOpen} title="Assign teacher" busy={saving} onClose={closeForm}>
            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    Assign Teacher
                </h2>

                <form noValidate
                    onSubmit={handleAssign}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <label className="block mb-1 font-medium">
                            Teacher
                        </label>

                        <select
                            aria-label="Teacher"
                            value={teacherId}
                            onChange={(event) =>
                                setTeacherId(
                                    event.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        >
                            <option value="">
                                Select Teacher
                            </option>

                            {teachers.map(
                                (teacher) => (
                                    <option
                                        key={
                                            teacher.id
                                        }
                                        value={
                                            teacher.id
                                        }
                                    >
                                        {
                                            teacher.first_name
                                        }{' '}
                                        {
                                            teacher.last_name
                                        }

                                        {teacher.department_name
                                            ? ` - ${teacher.department_name}`
                                            : ''}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Subject
                        </label>

                        <select
                            aria-label="Subject"
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
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3">
                        <button type="button" onClick={closeForm} disabled={saving} className="rounded border px-4 py-2">Cancel</button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded"
                        >
                            {saving
                                ? 'Assigning...'
                                : 'Assign Teacher'}
                        </button>
                    </div>
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
            </EditModal>}

            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Current Assignments
                </h2>

                <div className="bg-white rounded shadow overflow-x-auto">
                    <TableToolbar {...teacherSubjectsPagination} label="Teacher subjects" />
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <SortableHeader column={0} {...teacherSubjectsPagination} className="text-left p-3">
                                    Teacher
                                </SortableHeader>

                                <SortableHeader column={1} {...teacherSubjectsPagination} className="text-left p-3">
                                    Subject
                                </SortableHeader>

                                <SortableHeader column={2} {...teacherSubjectsPagination} className="text-left p-3">
                                    Code
                                </SortableHeader>

                                <SortableHeader column={3} {...teacherSubjectsPagination} className="text-left p-3">
                                    Class
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
                                    >
                                        No teacher-subject assignments available.
                                    </td>
                                </tr>
                            ) : (
                                teacherSubjectsPagination.items.map(
                                    (assignment) => (
                                        <tr
                                            key={
                                                assignment.id
                                            }
                                            className="border-t"
                                        >
                                            <td className="p-3">
                                                {
                                                    assignment.teacher_name
                                                }
                                            </td>

                                            <td className="p-3">
                                                {
                                                    assignment.subject_name
                                                }
                                            </td>

                                            <td className="p-3">
                                                {
                                                    assignment.subject_code
                                                }
                                            </td>

                                            <td className="p-3">
                                                {
                                                    assignment.class_name ||
                                                    '-'
                                                }

                                                {assignment.semester
                                                    ? ` - Semester ${assignment.semester}`
                                                    : ''}
                                            </td>

                                            <td className="p-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            assignment.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                    <Pagination {...teacherSubjectsPagination} label="Teacher subjects" />
                </div>
            </div>
        </div>
    );
}

export default TeacherSubjectsPage;
