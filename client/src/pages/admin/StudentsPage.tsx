import { useEffect, useState } from 'react';

import StudentForm from '../admin/StudentForm';

import {
    getStudents,
    deleteStudent,
    type Student
} from '../../services/studentService';

function StudentsPage() {
    const [students, setStudents] =
        useState<Student[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [showForm, setShowForm] =
        useState(false);

    const [error, setError] =
        useState('');

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getStudents();

            setStudents(data);
        } catch {
            setError(
                'Could not load students.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getStudents();

                setStudents(data);
            } catch {
                setError('Could not load students.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (
        id: number
    ) => {
        const confirmed = window.confirm(
            'Delete this student?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteStudent(id);
            loadStudents();
        } catch {
            setError(
                'Could not delete student.'
            );
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Students
                </h1>

                <button
                    onClick={() =>
                        setShowForm(!showForm)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Student
                </button>
            </div>

            {showForm && (
                <StudentForm
                    onSuccess={() => {
                        setShowForm(false);
                        loadStudents();
                    }}
                    onCancel={() =>
                        setShowForm(false)
                    }
                />
            )}

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
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
                            students.map(
                                (student) => (
                                    <tr
                                        key={student.id}
                                        className="border-t"
                                    >
                                        <td className="p-3">
                                            {
                                                student.student_code
                                            }
                                        </td>

                                        <td className="p-3">
                                            {
                                                student.first_name
                                            }{' '}
                                            {
                                                student.last_name
                                            }
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
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        student.id
                                                    )
                                                }
                                                className="text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentsPage;