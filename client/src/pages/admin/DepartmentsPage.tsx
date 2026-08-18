import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Department {
    id: number;
    name: string;
    code: string;
}

function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/departments');
                setDepartments(response.data);
            } catch {
                setError('Could not load departments.');
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Departments
                </h1>

                <p className="text-gray-500 mt-1">
                    View departments in the system.
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
                                Department
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="p-4 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : departments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No departments available.
                                </td>
                            </tr>
                        ) : (
                            departments.map((department) => (
                                <tr
                                    key={department.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {department.code}
                                    </td>

                                    <td className="p-3">
                                        {department.name}
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

export default DepartmentsPage;