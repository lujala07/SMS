import { Request, Response } from 'express';

import {
    getAllAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudent
} from '../services/attendanceService.js';

export const getAttendance = async (
    _req: Request,
    res: Response
) => {
    try {
        const attendance = await getAllAttendance();

        return res.status(200).json(attendance);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch attendance'
        });
    }
};

export const addAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            studentId,
            subjectId,
            markedBy,
            status,
            attendanceDate
        } = req.body;

        if (!studentId || !subjectId || !markedBy || !status) {
            return res.status(400).json({
                message:
                    'Student, subject, teacher and status are required'
            });
        }

        const validStatuses = [
            'present',
            'absent',
            'late',
            'excused'
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid attendance status'
            });
        }

        const attendance = await createAttendance(
            Number(studentId),
            Number(subjectId),
            Number(markedBy),
            status,
            attendanceDate
        );

        return res.status(201).json(attendance);
    } catch {
        return res.status(500).json({
            message: 'Failed to mark attendance'
        });
    }
};

export const editAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const validStatuses = [
            'present',
            'absent',
            'late',
            'excused'
        ];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Valid attendance status is required'
            });
        }

        const attendance = await updateAttendance(
            id,
            status
        );

        if (!attendance) {
            return res.status(404).json({
                message: 'Attendance record not found'
            });
        }

        return res.status(200).json(attendance);
    } catch {
        return res.status(500).json({
            message: 'Failed to update attendance'
        });
    }
};

export const removeAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const attendance = await deleteAttendance(id);

        if (!attendance) {
            return res.status(404).json({
                message: 'Attendance record not found'
            });
        }

        return res.status(200).json({
            message: 'Attendance deleted successfully'
        });
    } catch {
        return res.status(500).json({
            message: 'Failed to delete attendance'
        });
    }
};

export const getStudentAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const studentId = Number(req.params.studentId);

        const attendance =
            await getAttendanceByStudent(studentId);

        return res.status(200).json(attendance);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch student attendance'
        });
    }
};