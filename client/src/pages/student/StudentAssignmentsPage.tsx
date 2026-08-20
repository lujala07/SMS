import {
    useEffect,
    useRef,
    useState
} from 'react';

import axios from 'axios';

import {
    FileText,
    X
} from 'lucide-react';

import api from '../../services/api';

interface Assignment {
    id: number;

    title: string;
    description?: string;

    subject_name: string;
    subject_code: string;

    teacher_id?: number;
    teacher_name?: string;

    due_date: string;
    total_marks: number;

    submission_id?: number | null;
    submission_status?: string | null;

    submission_text?: string | null;
    file_url?: string | null;
    submitted_at?: string | null;

    marks_obtained?: number | null;
    feedback?: string | null;
}

function StudentAssignmentsPage() {
    const [
        assignments,
        setAssignments
    ] = useState<Assignment[]>([]);

    const [
        selectedAssignment,
        setSelectedAssignment
    ] = useState<Assignment | null>(
        null
    );

    const [
        submissionText,
        setSubmissionText
    ] = useState('');

    const [
        selectedFile,
        setSelectedFile
    ] = useState<File | null>(
        null
    );

    const [
        submitting,
        setSubmitting
    ] = useState(false);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState('');

    const [
        success,
        setSuccess
    ] = useState('');

    const fileInputRef =
        useRef<HTMLInputElement | null>(
            null
        );

    const loadAssignments =
        async () => {
            const response =
                await api.get(
                    '/students/me/dashboard'
                );

            const items: Assignment[] =
                response.data.assignments;

            setAssignments(items);

            if (selectedAssignment) {
                const updated =
                    items.find(
                        (item) =>
                            item.id ===
                            selectedAssignment.id
                    );

                if (updated) {
                    setSelectedAssignment(
                        updated
                    );
                }
            }
        };

    useEffect(() => {
        const loadData =
            async () => {
                try {
                    const response =
                        await api.get(
                            '/students/me/dashboard'
                        );

                    setAssignments(
                        response.data.assignments
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

        loadData();
    }, []);

    const openAssignment = (
        assignment: Assignment
    ) => {
        setSelectedAssignment(
            assignment
        );

        setSubmissionText('');
        setSelectedFile(null);

        setError('');
        setSuccess('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const closeAssignment =
        () => {
            setSelectedAssignment(
                null
            );

            setSubmissionText('');
            setSelectedFile(null);

            setError('');
            setSuccess('');

            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value =
                    '';
            }
        };

    const handleFileChange = (
        event:
            React.ChangeEvent<HTMLInputElement>
    ) => {
        setError('');

        const file =
            event.target.files?.[0];

        if (!file) {
            setSelectedFile(
                null
            );

            return;
        }

        if (
            file.type !==
            'application/pdf'
        ) {
            setSelectedFile(
                null
            );

            event.target.value =
                '';

            setError(
                'Only PDF files are allowed.'
            );

            return;
        }

        if (
            file.size >
            10 * 1024 * 1024
        ) {
            setSelectedFile(
                null
            );

            event.target.value =
                '';

            setError(
                'PDF must be 10 MB or smaller.'
            );

            return;
        }

        setSelectedFile(
            file
        );
    };

    const removeSelectedFile =
        () => {
            setSelectedFile(
                null
            );

            setError('');

            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value =
                    '';
            }
        };

    const handleSubmit =
        async () => {
            if (
                !selectedAssignment
            ) {
                return;
            }

            setError('');
            setSuccess('');

            if (
                selectedAssignment
                    .submission_id
            ) {
                setError(
                    'This assignment has already been submitted.'
                );

                return;
            }

            if (
                !submissionText.trim() &&
                !selectedFile
            ) {
                setError(
                    'Write a message or choose a PDF to submit.'
                );

                return;
            }

            setSubmitting(
                true
            );

            try {
                const formData =
                    new FormData();

                formData.append(
                    'assignmentId',
                    String(
                        selectedAssignment.id
                    )
                );

                if (
                    submissionText.trim()
                ) {
                    formData.append(
                        'submissionText',
                        submissionText.trim()
                    );
                }

                if (
                    selectedFile
                ) {
                    formData.append(
                        'file',
                        selectedFile
                    );
                }

                await api.post(
                    '/submissions',
                    formData
                );

                setSuccess(
                    'Assignment submitted successfully.'
                );

                setSubmissionText('');
                setSelectedFile(null);

                if (
                    fileInputRef.current
                ) {
                    fileInputRef.current.value =
                        '';
                }

                await loadAssignments();

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
                            'Could not submit assignment.'
                    );
                } else {
                    setError(
                        'Could not submit assignment.'
                    );
                }

            } finally {
                setSubmitting(
                    false
                );
            }
        };

    const getStatus = (
        assignment: Assignment
    ) => {
        if (
            assignment
                .submission_status ===
            'reviewed'
        ) {
            return 'Reviewed';
        }

        if (
            assignment
                .submission_status ===
            'late'
        ) {
            return 'Late';
        }

        if (
            assignment
                .submission_id
        ) {
            return 'Submitted';
        }

        return 'Not Submitted';
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

    const formatFileSize = (
        size: number
    ) => {
        const sizeInMB =
            size /
            1024 /
            1024;

        return `${sizeInMB.toFixed(2)} MB`;
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">
                    Assignments
                </h1>

                <div className="bg-white rounded shadow p-6">
                    Loading...
                </div>
            </div>
        );
    }

    if (
        selectedAssignment
    ) {
        return (
            <div>
                <button
                    type="button"
                    onClick={
                        closeAssignment
                    }
                    className="text-blue-600 hover:underline mb-5"
                >
                    ← Back to Assignments
                </button>

                <div className="bg-white rounded shadow p-6">
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {
                                    selectedAssignment.title
                                }
                            </h1>

                            <p className="text-gray-500 mt-1">
                                {
                                    selectedAssignment.subject_code
                                }
                                {' - '}
                                {
                                    selectedAssignment.subject_name
                                }
                            </p>

                            <p className="text-sm text-gray-600 mt-2">
                                Posted by:{' '}
                                <span className="font-medium text-gray-800">
                                    {
                                        selectedAssignment.teacher_name ||
                                        'Unknown Teacher'
                                    }
                                </span>
                            </p>
                        </div>

                        <div className="text-sm">
                            <p>
                                Due:{' '}
                                {new Date(
                                    selectedAssignment.due_date
                                ).toLocaleDateString()}
                            </p>

                            <p className="text-gray-500 mt-1">
                                Total Marks:{' '}
                                {
                                    selectedAssignment.total_marks
                                }
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="font-semibold mb-2">
                            Description
                        </h2>

                        <div className="bg-gray-50 border rounded p-4">
                            <p className="whitespace-pre-wrap">
                                {selectedAssignment.description ||
                                    'No description provided.'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-6">
                        <h2 className="font-semibold text-lg mb-4">
                            Submission
                        </h2>

                        {selectedAssignment.submission_id ? (
                            <div className="space-y-4">
                                <p>
                                    Status:{' '}
                                    <span className="font-medium text-blue-600">
                                        {getStatus(
                                            selectedAssignment
                                        )}
                                    </span>
                                </p>

                                {selectedAssignment.submission_text && (
                                    <div>
                                        <p className="font-medium mb-2">
                                            Your Message
                                        </p>

                                        <div className="bg-gray-50 border rounded p-4 whitespace-pre-wrap">
                                            {
                                                selectedAssignment.submission_text
                                            }
                                        </div>
                                    </div>
                                )}

                                {selectedAssignment.file_url && (
                                    <div>
                                        <p className="font-medium mb-2">
                                            Submitted PDF
                                        </p>

                                        <a
                                            href={getFileUrl(
                                                selectedAssignment.file_url
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                                        >
                                            <FileText
                                                size={
                                                    18
                                                }
                                            />

                                            View Submitted PDF
                                        </a>
                                    </div>
                                )}

                                {selectedAssignment.marks_obtained !==
                                    null &&
                                    selectedAssignment.marks_obtained !==
                                        undefined && (
                                        <p>
                                            Marks:{' '}
                                            <strong>
                                                {
                                                    selectedAssignment.marks_obtained
                                                }
                                                /
                                                {
                                                    selectedAssignment.total_marks
                                                }
                                            </strong>
                                        </p>
                                    )}

                                {selectedAssignment.feedback && (
                                    <div>
                                        <p className="font-medium mb-2">
                                            Teacher Feedback
                                        </p>

                                        <div className="bg-gray-50 border rounded p-4 whitespace-pre-wrap">
                                            {
                                                selectedAssignment.feedback
                                            }
                                        </div>
                                    </div>
                                )}

                                {success && (
                                    <p className="text-green-600">
                                        {
                                            success
                                        }
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className="mb-5">
                                    <label className="block font-medium mb-2">
                                        Upload Assignment PDF
                                    </label>

                                    {!selectedFile && (
                                        <>
                                            <input
                                                ref={
                                                    fileInputRef
                                                }
                                                type="file"
                                                accept=".pdf,application/pdf"
                                                onChange={
                                                    handleFileChange
                                                }
                                                className="block w-full max-w-xl border rounded p-2"
                                            />

                                            <p className="text-sm text-gray-500 mt-2">
                                                PDF only. Maximum 10 MB.
                                            </p>
                                        </>
                                    )}

                                    {selectedFile && (
                                        <div className="mt-2 flex items-center justify-between border rounded px-4 py-3 bg-gray-50 max-w-xl">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <FileText
                                                    size={
                                                        24
                                                    }
                                                    className="shrink-0 text-gray-600"
                                                />

                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {
                                                            selectedFile.name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatFileSize(
                                                            selectedFile.size
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    removeSelectedFile
                                                }
                                                className="ml-4 p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded"
                                                title="Remove PDF"
                                            >
                                                <X
                                                    size={
                                                        20
                                                    }
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">
                                        Message
                                    </label>

                                    <textarea
                                        rows={
                                            5
                                        }
                                        value={
                                            submissionText
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSubmissionText(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Optional message..."
                                        className="w-full border rounded p-3"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 mt-3">
                                        {
                                            error
                                        }
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={
                                        handleSubmit
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded"
                                >
                                    {submitting
                                        ? 'Submitting...'
                                        : 'Submit Assignment'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Assignments
                </h1>

                <p className="text-gray-500 mt-1">
                    View assignments for your class.
                </p>
            </div>

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            {assignments.length ===
            0 ? (
                <div className="bg-white rounded shadow p-6 text-gray-500">
                    No assignments available.
                </div>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">
                                    Assignment
                                </th>

                                <th className="text-left p-4">
                                    Subject
                                </th>

                                <th className="text-left p-4">
                                    Teacher
                                </th>

                                <th className="text-left p-4">
                                    Due Date
                                </th>

                                <th className="text-left p-4">
                                    Marks
                                </th>

                                <th className="text-left p-4">
                                    Status
                                </th>

                                <th className="text-left p-4">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {assignments.map(
                                (
                                    assignment
                                ) => (
                                    <tr
                                        key={
                                            assignment.id
                                        }
                                        className="border-t"
                                    >
                                        <td className="p-4 font-medium">
                                            {
                                                assignment.title
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                assignment.subject_code
                                            }
                                            {' - '}
                                            {
                                                assignment.subject_name
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                assignment.teacher_name ||
                                                'Unknown Teacher'
                                            }
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                assignment.due_date
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="p-4">
                                            {
                                                assignment.total_marks
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                getStatus(
                                                    assignment
                                                )
                                            }
                                        </td>

                                        <td className="p-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openAssignment(
                                                        assignment
                                                    )
                                                }
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Assignment
                                            </button>
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

export default StudentAssignmentsPage;