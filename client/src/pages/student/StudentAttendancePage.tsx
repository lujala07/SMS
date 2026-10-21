import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import TableToolbar from '../../components/TableToolbar';
import SortableHeader from '../../components/SortableHeader';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';
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

    const subjectSummaryPagination = usePagination(data?.summary.subjects ?? [], undefined, [
        { label: 'Subject', value: item => `${item.subject_code ?? ''} ${item.subject_name ?? ''}` },
        { label: 'Present', value: 'present', numeric: true },
        { label: 'Absent', value: 'absent', numeric: true },
        { label: 'Late', value: 'late', numeric: true },
        { label: 'Attendance', value: 'percentage', numeric: true }
    ]);
    const attendanceHistoryPagination = usePagination(data?.records ?? [], undefined, [
        { label: 'Date', value: 'attendance_date' },
        { label: 'Subject', value: item => `${item.subject_code ?? ''} ${item.subject_name ?? ''}` },
        { label: 'Status', value: 'status' }
    ]);

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

                <div className="bg-white rounded shadow p-6"><LoadingState /></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div>
                <PageHeader title="Attendance" />
                <Alert tone="error">{error || 'Could not load attendance.'}</Alert>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title={<>
                    Attendance
                </>} description={<>
                    Your class attendance records by subject.
                </>} />

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
                <TableToolbar {...subjectSummaryPagination} label="Subject summary" />
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <SortableHeader column={0} {...subjectSummaryPagination} className="text-left p-4">
                                Subject
                            </SortableHeader>
                            <SortableHeader column={1} {...subjectSummaryPagination} className="text-left p-4">
                                Present
                            </SortableHeader>
                            <SortableHeader column={2} {...subjectSummaryPagination} className="text-left p-4">
                                Absent
                            </SortableHeader>
                            <SortableHeader column={3} {...subjectSummaryPagination} className="text-left p-4">
                                Late
                            </SortableHeader>
                            <SortableHeader column={4} {...subjectSummaryPagination} className="text-left p-4">
                                Attendance
                            </SortableHeader>
                        </tr>
                    </thead>

                    <tbody>
                        {subjectSummaryPagination.items.map(
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
                <Pagination {...subjectSummaryPagination} label="Subject summary" />
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <TableToolbar {...attendanceHistoryPagination} label="Attendance history" />
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <SortableHeader column={0} {...attendanceHistoryPagination} className="text-left p-4">
                                Date
                            </SortableHeader>
                            <SortableHeader column={1} {...attendanceHistoryPagination} className="text-left p-4">
                                Subject
                            </SortableHeader>
                            <SortableHeader column={2} {...attendanceHistoryPagination} className="text-left p-4">
                                Status
                            </SortableHeader>
                        </tr>
                    </thead>

                    <tbody>
                        {data.records.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-4 text-center text-gray-500"
                                ><EmptyState title="No attendance records available." description="Records will appear here when they are available." /></td>
                            </tr>
                        ) : (
                            attendanceHistoryPagination.items.map((record) => (
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
                                    <td className="p-4 capitalize"><StatusBadge status={record.status} /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination {...attendanceHistoryPagination} label="Attendance history" />
            </div>
        </div>
    );
}

export default StudentAttendancePage;
