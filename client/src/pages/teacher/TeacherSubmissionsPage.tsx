import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

import {
    ArrowLeft,
    FileText
} from 'lucide-react';

import api from '../../services/api';

interface Assignment {
    id: number;
    title: string;
    subject_id: number;
    subject_name: string;
    subject_code: string;
    class_name: string;
    semester?: number;
    due_date: string;
    total_marks: number;
}

interface StudentSubmission {
    student_id: number;
    student_code: string;
    first_name: string;
    last_name: string;

    assignment_id: number;
    assignment_title: string;
    total_marks: number;

    submission_id: number | null;
    submission_text?: string | null;
    file_url?: string | null;
    submitted_at?: string | null;

    marks_obtained?: number | null;
    feedback?: string | null;
    status?: string | null;
}

function TeacherSubmissionsPage() {
    const [
        assignments,
        setAssignments
    ] = useState<Assignment[]>([]);

    const [
        selectedAssignment,
        setSelectedAssignment
    ] = useState('');

    const [
        students,
        setStudents
    ] = useState<StudentSubmission[]>([]);

    const [
        selectedStudent,
        setSelectedStudent
    ] = useState<StudentSubmission | null>(
        null
    );

    const [
        marks,
        setMarks
    ] = useState('');

    const [
        feedback,
        setFeedback
    ] = useState('');

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        loadingStudents,
        setLoadingStudents
    ] = useState(false);

    const [
        reviewing,
        setReviewing
    ] = useState(false);

    const [
        error,
        setError
    ] = useState('');

    const [
        success,
        setSuccess
    ] = useState('');

    useEffect(() => {
        const loadAssignments =
            async () => {
                try {
                    const response =
                        await api.get(
                            '/submissions/teacher/assignments'
                        );

                    setAssignments(
                        response.data
                    );

                } catch (error) {
                    console.error(
                        error
                    );

                    setError(
                        'Could not load assignments.'
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            };

        loadAssignments();
    }, []);

    const loadStudents =
        async (
            assignmentId: string
        ) => {
            if (!assignmentId) {
                setStudents([]);
                return;
            }

            setLoadingStudents(
                true
            );

            setError('');
            setSuccess('');

            try {
                const response =
                    await api.get(
                        `/submissions/teacher/assignments/${assignmentId}/students`
                    );

                setStudents(
                    response.data
                );

                if (
                    selectedStudent
                ) {
                    const updatedStudent =
                        response.data.find(
                            (
                                student:
                                    StudentSubmission
                            ) =>
                                student.student_id ===
                                selectedStudent.student_id
                        );

                    if (
                        updatedStudent
                    ) {
                        setSelectedStudent(
                            updatedStudent
                        );

                        setMarks(
                            updatedStudent.marks_obtained !==
                                null &&
                            updatedStudent.marks_obtained !==
                                undefined
                                ? String(
                                      updatedStudent.marks_obtained
                                  )
                                : ''
                        );

                        setFeedback(
                            updatedStudent.feedback ||
                                ''
                        );
                    }
                }

            } catch (error) {
                console.error(
                    error
                );

                if (
                    axios.isAxiosError(
                        error
                    )
                ) {
                    setError(
                        error.response
                            ?.data
                            ?.message ||
                            'Could not load students.'
                    );
                } else {
                    setError(
                        'Could not load students.'
                    );
                }

            } finally {
                setLoadingStudents(
                    false
                );
            }
        };

    const handleAssignmentChange =
        async (
            value: string
        ) => {
            setSelectedAssignment(
                value
            );

            setSelectedStudent(
                null
            );

            setMarks('');
            setFeedback('');

            await loadStudents(
                value
            );
        };

    const openSubmission = (
        student: StudentSubmission
    ) => {
        if (
            !student.submission_id
        ) {
            return;
        }

        setSelectedStudent(
            student
        );

        setMarks(
            student.marks_obtained !==
                null &&
            student.marks_obtained !==
                undefined
                ? String(
                      student.marks_obtained
                  )
                : ''
        );

        setFeedback(
            student.feedback ||
                ''
        );

        setError('');
        setSuccess('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const closeSubmission =
        () => {
            setSelectedStudent(
                null
            );

            setMarks('');
            setFeedback('');

            setError('');
            setSuccess('');
        };

    const handleMarksChange = (
        value: string
    ) => {
        if (
            value === '' ||
            /^\d*\.?\d*$/.test(
                value
            )
        ) {
            setMarks(
                value
            );
        }
    };

    const handleReview =
        async () => {
            if (
                !selectedStudent
                    ?.submission_id
            ) {
                return;
            }

            setError('');
            setSuccess('');

            if (
                marks === ''
            ) {
                setError(
                    'Please enter marks.'
                );

                return;
            }

            const numberValue =
                Number(
                    marks
                );

            if (
                Number.isNaN(
                    numberValue
                ) ||
                numberValue < 0
            ) {
                setError(
                    'Please enter valid marks.'
                );

                return;
            }

            if (
                numberValue >
                Number(
                    selectedStudent.total_marks
                )
            ) {
                setError(
                    `Marks cannot be greater than ${selectedStudent.total_marks}.`
                );

                return;
            }

            setReviewing(
                true
            );

            try {
                await api.put(
                    `/submissions/${selectedStudent.submission_id}/review`,
                    {
                        marksObtained:
                            numberValue,

                        feedback:
                            feedback.trim()
                    }
                );

                setSuccess(
                    'Submission reviewed successfully.'
                );

                await loadStudents(
                    selectedAssignment
                );

            } catch (error) {
                console.error(
                    error
                );

                if (
                    axios.isAxiosError(
                        error
                    )
                ) {
                    setError(
                        error.response
                            ?.data
                            ?.message ||
                            'Could not review submission.'
                    );
                } else {
                    setError(
                        'Could not review submission.'
                    );
                }

            } finally {
                setReviewing(
                    false
                );
            }
        };

    const getStatus = (
        student: StudentSubmission
    ) => {
        if (
            !student.submission_id
        ) {
            return 'Not Submitted';
        }

        if (
            student.status ===
            'reviewed'
        ) {
            return 'Reviewed';
        }

        if (
            student.status ===
            'late'
        ) {
            return 'Late';
        }

        return 'Submitted';
    };

    const getStatusClass = (
        student: StudentSubmission
    ) => {
        const status =
            getStatus(
                student
            );

        if (
            status ===
            'Reviewed'
        ) {
            return 'text-green-600';
        }

        if (
            status ===
            'Submitted'
        ) {
            return 'text-blue-600';
        }

        if (
            status ===
            'Late'
        ) {
            return 'text-orange-600';
        }

        return 'text-gray-500';
    };

    const getFileUrl = (
        fileUrl: string
    ) => {
        if (
            fileUrl.startsWith(
                'http://'
            ) ||
            fileUrl.startsWith(
                'https://'
            )
        ) {
            return fileUrl;
        }

        return `http://localhost:5000${fileUrl}`;
    };

    const currentAssignment =
        assignments.find(
            (assignment) =>
                String(
                    assignment.id
                ) ===
                selectedAssignment
        );

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Submissions
                </h1>

                <div className="bg-white p-4 rounded shadow">
                    Loading...
                </div>
            </div>
        );
    }

    if (
        selectedStudent
    ) {
        return (
            <div>
                <button
                    type="button"
                    onClick={
                        closeSubmission
                    }
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-5"
                >
                    <ArrowLeft
                        size={
                            18
                        }
                    />

                    Back to Submissions
                </button>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Review Submission
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Review the student's work and provide marks and feedback.
                    </p>
                </div>

                <div className="bg-white rounded shadow p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 pb-6 border-b">
                        <div>
                            <h2 className="text-xl font-semibold">
                                {
                                    selectedStudent.assignment_title
                                }
                            </h2>

                            {currentAssignment && (
                                <p className="text-gray-500 mt-1">
                                    {
                                        currentAssignment.subject_code
                                    }
                                    {' - '}
                                    {
                                        currentAssignment.subject_name
                                    }
                                </p>
                            )}
                        </div>

                        <span
                            className={`font-medium ${getStatusClass(
                                selectedStudent
                            )}`}
                        >
                            {getStatus(
                                selectedStudent
                            )}
                        </span>
                    </div>

                    <div className="py-6 border-b">
                        <h3 className="font-semibold mb-4">
                            Student Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Student
                                </p>

                                <p className="font-medium mt-1">
                                    {
                                        selectedStudent.first_name
                                    }{' '}
                                    {
                                        selectedStudent.last_name
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Student Code
                                </p>

                                <p className="font-medium mt-1">
                                    {
                                        selectedStudent.student_code
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Submitted At
                                </p>

                                <p className="font-medium mt-1">
                                    {selectedStudent.submitted_at
                                        ? new Date(
                                              selectedStudent.submitted_at
                                          ).toLocaleString()
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="py-6 border-b">
                        <h3 className="font-semibold mb-4">
                            Student Submission
                        </h3>

                        {selectedStudent.file_url ? (
                            <a
                                href={getFileUrl(
                                    selectedStudent.file_url
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 border rounded px-4 py-3 hover:bg-gray-50"
                            >
                                <FileText
                                    size={
                                        22
                                    }
                                    className="text-gray-600"
                                />

                                <span className="text-blue-600 font-medium">
                                    View Submitted PDF
                                </span>
                            </a>
                        ) : (
                            <p className="text-gray-500">
                                No PDF was submitted.
                            </p>
                        )}

                        {selectedStudent.submission_text && (
                            <div className="mt-5">
                                <p className="font-medium mb-2">
                                    Student Message
                                </p>

                                <div className="bg-gray-50 border rounded p-4 whitespace-pre-wrap">
                                    {
                                        selectedStudent.submission_text
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6">
                        <h3 className="font-semibold mb-4">
                            Review
                        </h3>

                        <div className="max-w-sm mb-5">
                            <label className="block font-medium mb-2">
                                Marks
                            </label>

                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={
                                        marks
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        handleMarksChange(
                                            event.target.value
                                        )
                                    }
                                    className="border rounded p-2 w-28"
                                    placeholder="0"
                                />

                                <span className="text-gray-500">
                                    /{' '}
                                    {
                                        selectedStudent.total_marks
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block font-medium mb-2">
                                Feedback
                            </label>

                            <textarea
                                rows={
                                    5
                                }
                                value={
                                    feedback
                                }
                                onChange={(
                                    event
                                ) =>
                                    setFeedback(
                                        event.target.value
                                    )
                                }
                                placeholder="Write feedback for the student..."
                                className="w-full border rounded p-3"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 mb-4">
                                {
                                    error
                                }
                            </p>
                        )}

                        {success && (
                            <p className="text-green-600 mb-4">
                                {
                                    success
                                }
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={
                                handleReview
                            }
                            disabled={
                                reviewing
                            }
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded"
                        >
                            {reviewing
                                ? 'Saving...'
                                : selectedStudent.status ===
                                    'reviewed'
                                  ? 'Update Review'
                                  : 'Save Review'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Submissions
                </h1>

                <p className="text-gray-500 mt-1">
                    View and review student assignment submissions.
                </p>
            </div>

            <div className="bg-white p-6 rounded shadow mb-6">
                <label className="block font-medium mb-2">
                    Assignment
                </label>

                <select
                    value={
                        selectedAssignment
                    }
                    onChange={(
                        event
                    ) =>
                        handleAssignmentChange(
                            event.target.value
                        )
                    }
                    className="w-full border p-2 rounded"
                >
                    <option value="">
                        Select Assignment
                    </option>

                    {assignments.map(
                        (
                            assignment
                        ) => (
                            <option
                                key={
                                    assignment.id
                                }
                                value={
                                    assignment.id
                                }
                            >
                                {
                                    assignment.subject_code
                                }
                                {' - '}
                                {
                                    assignment.title
                                }
                                {' | '}
                                {
                                    assignment.class_name
                                }

                                {assignment.semester
                                    ? ` Semester ${assignment.semester}`
                                    : ''}
                            </option>
                        )
                    )}
                </select>
            </div>

            {error && (
                <p className="text-red-500 mb-4">
                    {
                        error
                    }
                </p>
            )}

            {!selectedAssignment ? (
                <div className="bg-white p-6 rounded shadow text-gray-500">
                    Select an assignment to view students.
                </div>
            ) : loadingStudents ? (
                <div className="bg-white p-6 rounded shadow">
                    Loading students...
                </div>
            ) : students.length ===
              0 ? (
                <div className="bg-white p-6 rounded shadow text-gray-500">
                    No students found in this class.
                </div>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">
                                    Student
                                </th>

                                <th className="text-left p-4">
                                    Code
                                </th>

                                <th className="text-left p-4">
                                    Status
                                </th>

                                <th className="text-left p-4">
                                    Submitted At
                                </th>

                                <th className="text-left p-4">
                                    Marks
                                </th>

                                <th className="text-left p-4">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map(
                                (
                                    student
                                ) => (
                                    <tr
                                        key={
                                            student.student_id
                                        }
                                        className="border-t"
                                    >
                                        <td className="p-4 font-medium">
                                            {
                                                student.first_name
                                            }{' '}
                                            {
                                                student.last_name
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                student.student_code
                                            }
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={
                                                    getStatusClass(
                                                        student
                                                    )
                                                }
                                            >
                                                {
                                                    getStatus(
                                                        student
                                                    )
                                                }
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            {student.submitted_at
                                                ? new Date(
                                                      student.submitted_at
                                                  ).toLocaleString()
                                                : '-'}
                                        </td>

                                        <td className="p-4">
                                            {student.marks_obtained !==
                                                null &&
                                            student.marks_obtained !==
                                                undefined
                                                ? `${student.marks_obtained} / ${student.total_marks}`
                                                : '-'}
                                        </td>

                                        <td className="p-4">
                                            {student.submission_id ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openSubmission(
                                                            student
                                                        )
                                                    }
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {student.status ===
                                                    'reviewed'
                                                        ? 'View Review'
                                                        : 'View Submission'}
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TeacherSubmissionsPage;