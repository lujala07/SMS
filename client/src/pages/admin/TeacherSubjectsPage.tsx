import { useEffect, useState } from 'react';
import api from '../../services/api';

interface TeacherSubject {
    id: number;
    teacher_id: number;
    subject_id: number;
    teacher_name?: string;
    subject_name?: string;
    subject_code?: string;
}

function TeacherSubjectsPage() {
    const [items, setItems] = useState<TeacherSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeacherSubjects = async () => {
            try {
                const response =
                    await api.get('/teacher-subjects');

                setItems(response.data);
            } catch {
                setError(
                    'Could not load teacher subject assignments.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherSubjects();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Teacher Subjects
                </h1>

                <p className="text-gray-500 mt-1">
                    View teacher and subject assignments.
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
                                Teacher
                            </th>

                            <th className="text-left p-3">
                                Subject
                            </th>

                            <th className="text-left p-3">
                                Subject Code
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-4 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No teacher subject assignments available.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {item.teacher_name ||
                                            item.teacher_id}
                                    </td>

                                    <td className="p-3">
                                        {item.subject_name ||
                                            item.subject_id}
                                    </td>

                                    <td className="p-3">
                                        {item.subject_code || '-'}
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

export default TeacherSubjectsPage;