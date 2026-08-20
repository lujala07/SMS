import { Request, Response } from 'express';

import {
    getAllAttendance,
    getTeacherAttendance,
    getTeacherSubjects,
    getStudentsForTeacherSubject,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudent,
    getMyAttendanceSummary,
    isStudentOwner
} from '../services/attendanceService.js';

const validStatuses = [
    'present',
    'absent',
    'late'
];

export const getAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            req.user?.role === 'teacher' &&
            req.user.userId
        ) {
            const attendance =
                await getTeacherAttendance(
                    req.user.userId
                );

            return res.status(200).json(attendance);
        }

        const attendance =
            await getAllAttendance();

        return res.status(200).json(attendance);

    } catch (error) {
        console.error(
            'GET ATTENDANCE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch attendance'
        });
    }
};

export const getMyTeacherSubjects = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const subjects =
            await getTeacherSubjects(
                req.user.userId
            );

        return res.status(200).json(subjects);

    } catch (error) {
        console.error(
            'GET TEACHER SUBJECTS ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch teacher subjects'
        });
    }
};

export const getSubjectStudents = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const subjectId =
            Number(req.params.subjectId);

        if (!subjectId) {
            return res.status(400).json({
                message:
                    'Valid subject is required'
            });
        }

        const students =
            await getStudentsForTeacherSubject(
                req.user.userId,
                subjectId
            );

        return res.status(200).json(students);

    } catch (error) {
        console.error(
            'GET SUBJECT STUDENTS ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch students'
        });
    }
};

export const addAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const {
            studentId,
            subjectId,
            status,
            attendanceDate
        } = req.body;

        if (
            !studentId ||
            !subjectId ||
            !status
        ) {
            return res.status(400).json({
                message:
                    'Student, subject and status are required'
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message:
                    'Invalid attendance status'
            });
        }

        const attendance =
            await createAttendance(
                req.user.userId,
                Number(studentId),
                Number(subjectId),
                status,
                attendanceDate
            );

        return res.status(201).json(
            attendance
        );

    } catch (error: any) {
        console.error(
            'MARK ATTENDANCE ERROR:',
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                'Failed to mark attendance'
        });
    }
};

export const editAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const id =
            Number(req.params.id);

        const { status } = req.body;

        if (
            !status ||
            !validStatuses.includes(status)
        ) {
            return res.status(400).json({
                message:
                    'Valid attendance status is required'
            });
        }

        const attendance =
            await updateAttendance(
                req.user.userId,
                id,
                status
            );

        if (!attendance) {
            return res.status(404).json({
                message:
                    'Attendance record not found'
            });
        }

        return res.status(200).json(
            attendance
        );

    } catch (error) {
        console.error(
            'UPDATE ATTENDANCE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to update attendance'
        });
    }
};

export const removeAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const id =
            Number(req.params.id);

        const attendance =
            await deleteAttendance(
                req.user.userId,
                id
            );

        if (!attendance) {
            return res.status(404).json({
                message:
                    'Attendance record not found'
            });
        }

        return res.status(200).json({
            message:
                'Attendance deleted successfully'
        });

    } catch (error) {
        console.error(
            'DELETE ATTENDANCE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to delete attendance'
        });
    }
};

export const getStudentAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const studentId =
            Number(req.params.studentId);

        if (!studentId) {
            return res.status(400).json({
                message:
                    'Valid student is required'
            });
        }

        if (
            req.user?.role === 'student' &&
            req.user.userId
        ) {
            const ownsStudent =
                await isStudentOwner(
                    req.user.userId,
                    studentId
                );

            if (!ownsStudent) {
                return res.status(403).json({
                    message:
                        'Access denied'
                });
            }
        }

        const attendance =
            await getAttendanceByStudent(
                studentId
            );

        return res.status(200).json(
            attendance
        );

    } catch (error) {
        console.error(
            'GET STUDENT ATTENDANCE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch student attendance'
        });
    }
};

export const getMyAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const attendance =
            await getMyAttendanceSummary(
                req.user.userId
            );

        return res.status(200).json(
            attendance
        );

    } catch (error: any) {
        console.error(
            'GET MY ATTENDANCE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                'Failed to fetch attendance'
        });
    }
};
