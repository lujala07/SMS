import { useEffect, useState } from 'react';
import api from '../../services/api';

interface ClassItem {
    id: number;
    department_id: number;
    name: string;
    semester?: number;
    academic_year: string;
    department_name?: string;
}

function ClassesPage() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await api.get('/classes');
                setClasses(response.data);
            } catch {
                setError('Could not load classes.');
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Classes
                </h1>

                <p className="text-gray-500 mt-1">
                    View classes in the system.
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
                        ) : classes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
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
                                    <td className="p-3">
                                        {classItem.name}
                                    </td>

                                    <td className="p-3">
                                        {classItem.department_name || '-'}
                                    </td>

                                    <td className="p-3">
                                        {classItem.semester || '-'}
                                    </td>

                                    <td className="p-3">
                                        {classItem.academic_year}
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