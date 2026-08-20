import {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

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
        marks,
        setMarks
    ] = useState<
        Record<number, string>
    >({});

    const [
        feedback,
        setFeedback
    ] = useState<
        Record<number, string>
    >({});

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        loadingStudents,
        setLoadingStudents
    ] = useState(false);

    const [
        reviewingId,
        setReviewingId
    ] = useState<number | null>(
        null
    );

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
                    setLoading(false);
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

            setLoadingStudents(true);
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

                const marksData:
                    Record<
                        number,
                        string
                    > = {};

                const feedbackData:
                    Record<
                        number,
                        string
                    > = {};

                response.data.forEach(
                    (
                        student:
                            StudentSubmission
                    ) => {
                        if (
                            student.submission_id
                        ) {
                            marksData[
                                student.submission_id
                            ] =
                                student.marks_obtained !==
                                    null &&
                                student.marks_obtained !==
                                    undefined
                                    ? String(
                                          student.marks_obtained
                                      )
                                    : '';

                            feedbackData[
                                student.submission_id
                            ] =
                                student.feedback ||
                                '';
                        }
                    }
                );

                setMarks(marksData);

                setFeedback(
                    feedbackData
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

            await loadStudents(
                value
            );
        };

    const handleMarksChange = (
        submissionId: number,
        value: string
    ) => {
        if (
            value === '' ||
            /^\d*\.?\d*$/.test(
                value
            )
        ) {
            setMarks(
                (current) => ({
                    ...current,
                    [submissionId]:
                        value
                })
            );
        }
    };

    const handleReview =
        async (
            student:
                StudentSubmission
        ) => {
            if (
                !student.submission_id
            ) {
                return;
            }

            setError('');
            setSuccess('');

            const value =
                marks[
                    student.submission_id
                ];

            if (
                value === undefined ||
                value === ''
            ) {
                setError(
                    'Please enter marks.'
                );
                return;
            }

            const numberValue =
                Number(value);

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
                    student.total_marks
                )
            ) {
                setError(
                    `Marks cannot be greater than ${student.total_marks}.`
                );
                return;
            }

            setReviewingId(
                student.submission_id
            );

            try {
                await api.put(
                    `/submissions/${student.submission_id}/review`,
                    {
                        marksObtained:
                            numberValue,

                        feedback:
                            feedback[
                                student
                                    .submission_id
                            ] || ''
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
                setReviewingId(
                    null
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

        return 'Submitted';
    };

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
                    onChange={(event) =>
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
                        (assignment) => (
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
                    {error}
                </p>
            )}

            {success && (
                <p className="text-green-600 mb-4">
                    {success}
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
            ) : students.length === 0 ? (
                <div className="bg-white p-6 rounded shadow text-gray-500">
                    No students found in this class.
                </div>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">
                                    Student
                                </th>

                                <th className="text-left p-3">
                                    Code
                                </th>

                                <th className="text-left p-3">
                                    Status
                                </th>

                                <th className="text-left p-3">
                                    Submission
                                </th>

                                <th className="text-left p-3">
                                    Marks
                                </th>

                                <th className="text-left p-3">
                                    Feedback
                                </th>

                                <th className="text-left p-3">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map(
                                (student) => (
                                    <tr
                                        key={
                                            student.student_id
                                        }
                                        className="border-t align-top"
                                    >
                                        <td className="p-3 font-medium">
                                            {
                                                student.first_name
                                            }{' '}
                                            {
                                                student.last_name
                                            }
                                        </td>

                                        <td className="p-3">
                                            {
                                                student.student_code
                                            }
                                        </td>

                                        <td className="p-3">
                                            <span
                                                className={
                                                    getStatus(
                                                        student
                                                    ) ===
                                                    'Reviewed'
                                                        ? 'text-green-600'
                                                        : getStatus(
                                                                student
                                                            ) ===
                                                            'Submitted'
                                                          ? 'text-blue-600'
                                                          : 'text-gray-500'
                                                }
                                            >
                                                {
                                                    getStatus(
                                                        student
                                                    )
                                                }
                                            </span>
                                        </td>

                                        <td className="p-3 min-w-48">
                                            {!student.submission_id ? (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            ) : (
                                                <>
                                                    {student.submission_text && (
                                                        <p className="text-sm mb-2">
                                                            {
                                                                student.submission_text
                                                            }
                                                        </p>
                                                    )}

                                                    {student.file_url && (
                                                        <a
                                                            href={
                                                                student.file_url
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            View File
                                                        </a>
                                                    )}

                                                    {student.submitted_at && (
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {new Date(
                                                                student.submitted_at
                                                            ).toLocaleString()}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </td>

                                        <td className="p-3">
                                            {student.submission_id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        inputMode="decimal"
                                                        value={
                                                            marks[
                                                                student
                                                                    .submission_id
                                                            ] ||
                                                            ''
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleMarksChange(
                                                                student.submission_id!,
                                                                event.target.value
                                                            )
                                                        }
                                                        className="border p-2 rounded w-20"
                                                        placeholder="0"
                                                    />

                                                    <span className="text-gray-500">
                                                        /{' '}
                                                        {
                                                            student.total_marks
                                                        }
                                                    </span>
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>

                                        <td className="p-3">
                                            {student.submission_id ? (
                                                <textarea
                                                    value={
                                                        feedback[
                                                            student
                                                                .submission_id
                                                        ] ||
                                                        ''
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setFeedback(
                                                            (
                                                                current
                                                            ) => ({
                                                                ...current,

                                                                [student.submission_id!]:
                                                                    event.target.value
                                                            })
                                                        )
                                                    }
                                                    rows={
                                                        2
                                                    }
                                                    placeholder="Feedback"
                                                    className="border p-2 rounded min-w-48"
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </td>

                                        <td className="p-3">
                                            {student.submission_id ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReview(
                                                            student
                                                        )
                                                    }
                                                    disabled={
                                                        reviewingId ===
                                                        student.submission_id
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded whitespace-nowrap"
                                                >
                                                    {reviewingId ===
                                                    student.submission_id
                                                        ? 'Saving...'
                                                        : student.status ===
                                                            'reviewed'
                                                          ? 'Update'
                                                          : 'Review'}
                                                </button>
                                            ) : (
                                                '-'
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