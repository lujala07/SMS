import {
    Request,
    Response
} from 'express';

import {
    getAllTeacherSubjects,
    assignTeacherToSubject,
    removeTeacherSubject
} from '../services/teacherSubjectService.js';

export const getTeacherSubjects = async (
    _req: Request,
    res: Response
) => {
    try {
        const assignments =
            await getAllTeacherSubjects();

        return res.status(200).json(
            assignments
        );

    } catch (error) {
        console.error(
            'GET TEACHER SUBJECTS ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch teacher-subject assignments'
        });
    }
};

export const addTeacherSubject = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            teacherId,
            subjectId
        } = req.body;

        if (
            !teacherId ||
            !subjectId
        ) {
            return res.status(400).json({
                message:
                    'Teacher and subject are required'
            });
        }

        const assignment =
            await assignTeacherToSubject(
                Number(teacherId),
                Number(subjectId)
            );

        return res.status(201).json({
            message:
                'Teacher assigned successfully',
            assignment
        });

    } catch (error: any) {
        console.error(
            'ASSIGN TEACHER SUBJECT ERROR:',
            error
        );

        if (error.code === '23505') {
            return res.status(400).json({
                message:
                    'This teacher is already assigned to this subject'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message:
                    'Teacher or subject does not exist'
            });
        }

        return res.status(500).json({
            message:
                error.message ||
                'Failed to assign teacher to subject'
        });
    }
};

export const removeTeacherSubjectAssignment =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            const id =
                Number(req.params.id);

            if (!id) {
                return res.status(400).json({
                    message:
                        'Valid assignment ID is required'
                });
            }

            const assignment =
                await removeTeacherSubject(id);

            if (!assignment) {
                return res.status(404).json({
                    message:
                        'Assignment not found'
                });
            }

            return res.status(200).json({
                message:
                    'Teacher removed from subject successfully'
            });

        } catch (error) {
            console.error(
                'REMOVE TEACHER SUBJECT ERROR:',
                error
            );

            return res.status(500).json({
                message:
                    'Failed to remove teacher-subject assignment'
            });
        }
    };