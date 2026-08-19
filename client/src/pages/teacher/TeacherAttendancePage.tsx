import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

import api from '../../services/api';

type AttendanceStatus =
    | 'present'
    | 'absent'
    | 'late'
    | 'excused';

interface SubjectOption {
    subject_id: number;
    subject_name: string;
    subject_code: string;

    class_id: number;
    class_name: string;

    semester?: number;
    academic_year: string;
}

interface Student {
    id: number;
    student_code: string;
    first_name: string;
    last_name: string;
    class_id: number;
}

interface AttendanceRecord {
    id: number;
    student_id: number;
    subject_id: number;

    attendance_date: string;
    status: AttendanceStatus;

    first_name: string;
    last_name: string;
    student_code?: string;

    subject_name: string;
    subject_code?: string;
}

function TeacherAttendancePage() {
    const [subjects, setSubjects] =
        useState<SubjectOption[]>([]);

    const [selectedSubject, setSelectedSubject] =
        useState('');

    const [students, setStudents] =
        useState<Student[]>([]);

    const [statuses, setStatuses] =
        useState<
            Record<number, AttendanceStatus>
        >({});

    const [attendanceDate, setAttendanceDate] =
        useState(
            new Date()
                .toISOString()
                .split('T')[0]
        );

    const [records, setRecords] =
        useState<AttendanceRecord[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    const loadRecords = async () => {
        const response =
            await api.get('/attendance');

        setRecords(response.data);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [
                    subjectResponse,
                    attendanceResponse
                ] = await Promise.all([
                    api.get(
                        '/attendance/teacher/subjects'
                    ),
                    api.get('/attendance')
                ]);

                setSubjects(
                    subjectResponse.data
                );

                setRecords(
                    attendanceResponse.data
                );

            } catch (error) {
                console.error(error);

                setError(
                    'Could not load attendance data.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleSubjectChange = async (
        subjectId: string
    ) => {
        setSelectedSubject(subjectId);

        setStudents([]);
        setStatuses({});

        setError('');
        setSuccess('');

        if (!subjectId) {
            return;
        }

        try {
            const response =
                await api.get(
                    `/attendance/teacher/subjects/${subjectId}/students`
                );

            setStudents(response.data);

            const defaultStatuses:
                Record<
                    number,
                    AttendanceStatus
                > = {};

            response.data.forEach(
                (student: Student) => {
                    defaultStatuses[
                        student.id
                    ] = 'present';
                }
            );

            setStatuses(defaultStatuses);

        } catch (error) {
            console.error(error);

            setError(
                'Could not load students.'
            );
        }
    };

    const handleStatusChange = (
        studentId: number,
        status: AttendanceStatus
    ) => {
        setStatuses((current) => ({
            ...current,
            [studentId]: status
        }));
    };

    const handleSaveAttendance =
        async () => {
            setError('');
            setSuccess('');

            if (!selectedSubject) {
                setError(
                    'Please select a subject.'
                );
                return;
            }

            if (students.length === 0) {
                setError(
                    'No students available for this class.'
                );
                return;
            }

            setSaving(true);

            try {
                await Promise.all(
                    students.map(
                        (student) =>
                            api.post(
                                '/attendance',
                                {
                                    studentId:
                                        student.id,

                                    subjectId:
                                        Number(
                                            selectedSubject
                                        ),

                                    status:
                                        statuses[
                                            student.id
                                        ],

                                    attendanceDate
                                }
                            )
                    )
                );

                setSuccess(
                    'Attendance saved successfully.'
                );

                await loadRecords();

            } catch (error) {
                console.error(error);

                if (
                    axios.isAxiosError(error)
                ) {
                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        'Could not save attendance.'
                    );
                } else {
                    setError(
                        'Could not save attendance.'
                    );
                }
            } finally {
                setSaving(false);
            }
        };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Attendance
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
                    Attendance
                </h1>

                <p className="text-gray-500 mt-1">
                    Mark and view student attendance.
                </p>
            </div>

            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    Mark Attendance
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-1 font-medium">
                            Subject / Class
                        </label>

                        <select
                            value={
                                selectedSubject
                            }
                            onChange={(event) =>
                                handleSubjectChange(
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
                                            subject.subject_id
                                        }
                                        value={
                                            subject.subject_id
                                        }
                                    >
                                        {
                                            subject.subject_code
                                        }
                                        {' - '}
                                        {
                                            subject.subject_name
                                        }
                                        {' | '}
                                        {
                                            subject.class_name
                                        }

                                        {subject.semester
                                            ? ` Semester ${subject.semester}`
                                            : ''}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Date
                        </label>

                        <input
                            type="date"
                            value={
                                attendanceDate
                            }
                            onChange={(event) =>
                                setAttendanceDate(
                                    event.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>
                </div>

                {selectedSubject &&
                    students.length === 0 && (
                        <p className="text-gray-500">
                            No students found for this class.
                        </p>
                    )}

                {students.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left p-3">
                                        Student Code
                                    </th>

                                    <th className="text-left p-3">
                                        Student
                                    </th>

                                    <th className="text-left p-3">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.map(
                                    (student) => (
                                        <tr
                                            key={
                                                student.id
                                            }
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
                                                <select
                                                    value={
                                                        statuses[
                                                            student
                                                                .id
                                                        ] ||
                                                        'present'
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleStatusChange(
                                                            student.id,
                                                            event
                                                                .target
                                                                .value as AttendanceStatus
                                                        )
                                                    }
                                                    className="border p-2 rounded"
                                                >
                                                    <option value="present">
                                                        Present
                                                    </option>

                                                    <option value="absent">
                                                        Absent
                                                    </option>

                                                    <option value="late">
                                                        Late
                                                    </option>

                                                    <option value="excused">
                                                        Excused
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>

                        <button
                            type="button"
                            onClick={
                                handleSaveAttendance
                            }
                            disabled={saving}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded"
                        >
                            {saving
                                ? 'Saving...'
                                : 'Save Attendance'}
                        </button>
                    </div>
                )}

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

            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Attendance Records
                </h2>

                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">
                                    Student
                                </th>

                                <th className="text-left p-3">
                                    Subject
                                </th>

                                <th className="text-left p-3">
                                    Date
                                </th>

                                <th className="text-left p-3">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-4 text-center text-gray-500"
                                    >
                                        No attendance records available.
                                    </td>
                                </tr>
                            ) : (
                                records.map(
                                    (record) => (
                                        <tr
                                            key={
                                                record.id
                                            }
                                            className="border-t"
                                        >
                                            <td className="p-3">
                                                {
                                                    record.first_name
                                                }{' '}
                                                {
                                                    record.last_name
                                                }
                                            </td>

                                            <td className="p-3">
                                                {
                                                    record.subject_name
                                                }
                                            </td>

                                            <td className="p-3">
                                                {new Date(
                                                    record.attendance_date
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="p-3 capitalize">
                                                {
                                                    record.status
                                                }
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TeacherAttendancePage;