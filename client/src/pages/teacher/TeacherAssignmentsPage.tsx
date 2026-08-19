import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Assignment {
    id: number;
    title: string;
    description?: string;
    due_date: string;
    total_marks: number;
    subject_name?: string;
}

function TeacherAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await api.get('/assignments');

                setAssignments(response.data);
            } catch {
                setError(
                    'Could not load assignments.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Assignments
                </h1>

                <p className="text-gray-500 mt-1">
                    View and manage assignments.
                </p>
            </div>

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
                                Title
                            </th>

                            <th className="text-left p-3">
                                Subject
                            </th>

                            <th className="text-left p-3">
                                Due Date
                            </th>

                            <th className="text-left p-3">
                                Marks
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
                        ) : assignments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No assignments available.
                                </td>
                            </tr>
                        ) : (
                            assignments.map((assignment) => (
                                <tr
                                    key={assignment.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {assignment.title}
                                    </td>

                                    <td className="p-3">
                                        {assignment.subject_name ||
                                            '-'}
                                    </td>

                                    <td className="p-3">
                                        {new Date(
                                            assignment.due_date
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-3">
                                        {assignment.total_marks}
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

export default TeacherAssignmentsPage;