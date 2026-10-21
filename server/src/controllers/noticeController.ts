import {
    Request,
    Response
} from 'express';

import {
    getAllNotices,
    getTeacherRelevantNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    getNoticesByAudience,
    reviewNotice
} from '../services/noticeService.js';

export const moderateNotice = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status, revision } = req.body ?? {};
    if (!Number.isInteger(id) || id <= 0 || id > 2147483647 || !['approved', 'rejected'].includes(status) || !Number.isSafeInteger(revision) || revision <= 0) {
        return res.status(400).json({ message: 'Invalid approval request' });
    }
    try {
        const notice = await reviewNotice(id, req.user!.userId, status, revision);
        if (!notice) return res.status(409).json({ message: 'This notice has changed or was already reviewed. Refresh and try again.' });
        return res.json({ message: status === 'approved' ? 'Notice approved.' : 'Notice rejected.', notice });
    } catch {
        return res.status(500).json({ message: 'Could not review notice. Please try again.' });
    }
};

export const getNotices = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            req.user?.role === 'teacher' &&
            req.user.userId
        ) {
            const notices =
                await getTeacherRelevantNotices(
                    req.user.userId
                );

            return res.status(200).json(
                notices
            );
        }

        const notices = req.user?.role === 'admin'
            ? await getAllNotices()
            : await getNoticesByAudience('students');

        return res.status(200).json(
            notices
        );

    } catch (error) {
        console.error(
            'GET NOTICES ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch notices'
        });
    }
};

export const addNotice = async (
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
            title,
            content,
            audience
        } = req.body ?? {};

        if (
            typeof title !== 'string' || !title.trim() || title.trim().length > 255 ||
            typeof content !== 'string' || !content.trim() ||
            !audience
        ) {
            return res.status(400).json({
                message:
                    'Title, content and audience are required'
            });
        }

        const validAudiences = [
            'all',
            'teachers',
            'students'
        ];

        if (
            !validAudiences.includes(
                audience
            )
        ) {
            return res.status(400).json({
                message:
                    'Invalid notice audience'
            });
        }

        if (
            req.user.role === 'teacher' &&
            audience === 'teachers'
        ) {
            return res.status(400).json({
                message:
                    'Teachers can post notices for students or everyone'
            });
        }

        const notice =
            await createNotice(
                req.user.userId,
                title.trim(),
                content.trim(),
                audience
            );

        return res.status(201).json({
            message:
                notice.status === 'pending' ? 'Notice submitted for approval' : 'Notice created successfully',
            notice
        });

    } catch (error) {
        console.error(
            'CREATE NOTICE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to create notice'
        });
    }
};

export const editNotice = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            !req.user?.userId ||
            !req.user.role
        ) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const id =
            Number(req.params.id);

        const {
            title,
            content,
            audience
        } = req.body ?? {};

        if (
            !Number.isInteger(id) || id <= 0 || id > 2147483647 ||
            typeof title !== 'string' || !title.trim() || title.trim().length > 255 ||
            typeof content !== 'string' || !content.trim() ||
            !audience
        ) {
            return res.status(400).json({
                message:
                    'Title, content and audience are required'
            });
        }

        const validAudiences = [
            'all',
            'teachers',
            'students'
        ];

        if (
            !validAudiences.includes(
                audience
            )
        ) {
            return res.status(400).json({
                message:
                    'Invalid notice audience'
            });
        }

        if (
            req.user.role === 'teacher' &&
            audience === 'teachers'
        ) {
            return res.status(400).json({
                message:
                    'Teachers can post notices for students or everyone'
            });
        }

        const notice =
            await updateNotice(
                id,
                req.user.userId,
                req.user.role,
                title.trim(),
                content.trim(),
                audience
            );

        if (!notice) {
            return res.status(404).json({
                message:
                    'Notice not found or you cannot edit it'
            });
        }

        return res.status(200).json({
            message:
                notice.status === 'pending' ? 'Notice submitted for approval' : 'Notice updated successfully',
            notice
        });

    } catch (error) {
        console.error(
            'UPDATE NOTICE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to update notice'
        });
    }
};

export const removeNotice = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            !req.user?.userId ||
            !req.user.role
        ) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const id =
            Number(req.params.id);

        const notice =
            await deleteNotice(
                id,
                req.user.userId,
                req.user.role
            );

        if (!notice) {
            return res.status(404).json({
                message:
                    'Notice not found or you cannot delete it'
            });
        }

        return res.status(200).json({
            message:
                'Notice deleted successfully'
        });

    } catch (error) {
        console.error(
            'DELETE NOTICE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to delete notice'
        });
    }
};

export const getAudienceNotices = async (
    req: Request,
    res: Response
) => {
    try {
        const audience =
            String(
                req.params.audience
            );

        const allowedAudience = req.user?.role === 'teacher' ? 'teachers' : 'students';
        if (!['all', 'teachers', 'students'].includes(audience) || (req.user?.role !== 'admin' && audience !== 'all' && audience !== allowedAudience)) {
            return res.status(403).json({ message: 'You cannot view these notices' });
        }

        const notices =
            await getNoticesByAudience(
                audience
            );

        return res.status(200).json(
            notices
        );

    } catch (error) {
        console.error(
            'GET AUDIENCE NOTICES ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch notices'
        });
    }
};
