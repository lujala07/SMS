import { Request, Response } from 'express';

import {
    getDashboardSummary,
    getAttendanceSummary,
    getStudentAttendanceReport,
    getAssignmentSummary
} from '../services/reportService.js';

export const dashboardSummary = async (
    _req: Request,
    res: Response
) => {
    try {
        const report = await getDashboardSummary();

        return res.status(200).json(report);
    } catch {
        return res.status(500).json({
            message: 'Failed to generate dashboard report'
        });
    }
};

export const attendanceSummary = async (
    _req: Request,
    res: Response
) => {
    try {
        const report = await getAttendanceSummary();

        return res.status(200).json(report);
    } catch {
        return res.status(500).json({
            message: 'Failed to generate attendance report'
        });
    }
};

export const studentAttendanceReport = async (
    req: Request,
    res: Response
) => {
    try {
        const studentId = Number(req.params.studentId);

        const report =
            await getStudentAttendanceReport(studentId);

        return res.status(200).json(report);
    } catch {
        return res.status(500).json({
            message:
                'Failed to generate student attendance report'
        });
    }
};

export const assignmentSummary = async (
    _req: Request,
    res: Response
) => {
    try {
        const report = await getAssignmentSummary();

        return res.status(200).json(report);
    } catch {
        return res.status(500).json({
            message: 'Failed to generate assignment report'
        });
    }
};