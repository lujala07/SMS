import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Subject {
    id: number;
    class_id: number;
    name: string;
    code: string;
    class_name?: string;
}

function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await api.get('/subjects');
                setSubjects(response.data);
            } catch {
                setError('Could not load subjects.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Subjects
                </h1>

                <p className="text-gray-500 mt-1">
                    View subjects in the system.
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
                                Code
                            </th>

                            <th className="text-left p-3">
                                Subject
                            </th>

                            <th className="text-left p-3">
                                Class
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
                        ) : subjects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
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

                                    <td className="p-3">
                                        {subject.name}
                                    </td>

                                    <td className="p-3">
                                        {subject.class_name ||
                                            subject.class_id}
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