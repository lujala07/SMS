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
        setForm(emptyForm);
        setEditingSubject(null);
        setError('');
        setSuccess('');
    };

    const startEdit = (
        subject: Subject
    ) => {
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
        const confirmed = window.confirm(
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Subjects
                </h1>

                <p className="text-gray-500 mt-1">
                    Create and manage subjects.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow p-5 mb-6"
            >
                <h2 className="font-semibold mb-4">
                    {editingSubject
                        ? 'Edit Subject'
                        : 'Create Subject'}
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
                        value={form.name}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                name: event.target.value
                            })
                        }
                        placeholder="Subject name"
                        className="border rounded p-2"
                    />

                    <input
                        value={form.code}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                code: event.target.value
                            })
                        }
                        placeholder="Code"
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
                            : editingSubject
                              ? 'Update Subject'
                              : 'Create Subject'}
                    </button>

                    {editingSubject && (
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
                                Code
                            </th>
                            <th className="text-left p-3">
                                Subject
                            </th>
                            <th className="text-left p-3">
                                Class
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
                                    colSpan={4}
                                    className="p-4 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : subjects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No subjects available.
                                </td>
                            </tr>
                        ) : (
                            subjects.map((subject) => (
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
            </div>
        </div>
    );
}

export default SubjectsPage;
