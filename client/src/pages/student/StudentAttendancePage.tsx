import {
    useEffect,
    useState
} from 'react';

import api from '../../services/api';

interface AttendanceRecord {
    id: number;
    attendance_date: string;
    status: string;
    subject_name: string;
    subject_code: string;
}

interface SubjectSummary {
    subject_id: number;
    subject_name: string;
    subject_code: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
}

interface AttendanceResponse {
    records: AttendanceRecord[];
    summary: {
        total: number;
        present: number;
        absent: number;
        late: number;
        percentage: number;
        subjects: SubjectSummary[];
    };
}

function StudentAttendancePage() {
    const [data, setData] =
        useState<AttendanceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAttendance = async () => {
            try {
                const response = await api.get(
                    '/attendance/me'
                );

                setData(response.data);
            } catch (error) {
                console.error(error);
                setError(
                    'Could not load attendance.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadAttendance();
    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Attendance
                </h1>

                <div className="bg-white rounded shadow p-6">
                    Loading...
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Attendance
                </h1>

                <p className="text-red-500">
                    {error || 'Could not load attendance.'}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Attendance
                </h1>

                <p className="text-gray-500 mt-1">
                    Your class attendance records by subject.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Overall
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {data.summary.percentage}%
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Present
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {data.summary.present}
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Absent
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {data.summary.absent}
                    </p>
                </div>

                <div className="bg-white rounded shadow p-5">
                    <p className="text-sm text-gray-500">
                        Late
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {data.summary.late}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto mb-8">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Subject
                            </th>
                            <th className="text-left p-4">
                                Present
                            </th>
                            <th className="text-left p-4">
                                Absent
                            </th>
                            <th className="text-left p-4">
                                Late
                            </th>
                            <th className="text-left p-4">
                                Attendance
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.summary.subjects.map(
                            (subject) => (
                                <tr
                                    key={subject.subject_id}
                                    className="border-t"
                                >
                                    <td className="p-4 font-medium">
                                        {subject.subject_code}
                                        {' - '}
                                        {subject.subject_name}
                                    </td>
                                    <td className="p-4">
                                        {subject.present}
                                    </td>
                                    <td className="p-4">
                                        {subject.absent}
                                    </td>
                                    <td className="p-4">
                                        {subject.late}
                                    </td>
                                    <td className="p-4">
                                        {subject.percentage}%
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Date
                            </th>
                            <th className="text-left p-4">
                                Subject
                            </th>
                            <th className="text-left p-4">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.records.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No attendance records available.
                                </td>
                            </tr>
                        ) : (
                            data.records.map((record) => (
                                <tr
                                    key={record.id}
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {new Date(
                                            record.attendance_date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        {record.subject_code}
                                        {' - '}
                                        {record.subject_name}
                                    </td>
                                    <td className="p-4 capitalize">
                                        {record.status}
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

export default StudentAttendancePage;
