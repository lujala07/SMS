import {
    Request,
    Response
} from 'express';

import {
    getDashboardSummary,
    getAttendanceSummary,
    getTeacherAttendanceSummary,
    getStudentAttendanceReport,
    getAssignmentSummary,
    getTeacherAssignmentSummary
} from '../services/reportService.js';

export const dashboardSummary = async (
    _req: Request,
    res: Response
) => {
    try {
        const report =
            await getDashboardSummary();

        return res.status(200).json(
            report
        );

    } catch (error) {
        console.error(
            'DASHBOARD REPORT ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to generate dashboard report'
        });
    }
};

export const attendanceSummary = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            req.user?.role === 'teacher' &&
            req.user.userId
        ) {
            const report =
                await getTeacherAttendanceSummary(
                    req.user.userId
                );

            return res.status(200).json(
                report
            );
        }

        const report =
            await getAttendanceSummary();

        return res.status(200).json(
            report
        );

    } catch (error) {
        console.error(
            'ATTENDANCE REPORT ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to generate attendance report'
        });
    }
};

export const studentAttendanceReport =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            const studentId =
                Number(
                    req.params.studentId
                );

            if (!studentId) {
                return res.status(400).json({
                    message:
                        'Valid student ID is required'
                });
            }

            const report =
                await getStudentAttendanceReport(
                    studentId
                );

            return res.status(200).json(
                report
            );

        } catch (error) {
            console.error(
                'STUDENT ATTENDANCE REPORT ERROR:',
                error
            );

            return res.status(500).json({
                message:
                    'Failed to generate student attendance report'
            });
        }
    };

export const assignmentSummary = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            req.user?.role === 'teacher' &&
            req.user.userId
        ) {
            const report =
                await getTeacherAssignmentSummary(
                    req.user.userId
                );

            return res.status(200).json(
                report
            );
        }

        const report =
            await getAssignmentSummary();

        return res.status(200).json(
            report
        );

    } catch (error) {
        console.error(
            'ASSIGNMENT REPORT ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to generate assignment report'
        });
    }
};