import { Request, Response } from 'express';

import {
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    getNoticesByAudience
} from '../services/noticeService.js';

export const getNotices = async (
    _req: Request,
    res: Response
) => {
    try {
        const notices = await getAllNotices();

        return res.status(200).json(notices);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch notices'
        });
    }
};

export const addNotice = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            authorId,
            title,
            content,
            audience
        } = req.body;

        if (!authorId || !title || !content || !audience) {
            return res.status(400).json({
                message:
                    'Author, title, content and audience are required'
            });
        }

        const validAudiences = [
            'all',
            'teachers',
            'students'
        ];

        if (!validAudiences.includes(audience)) {
            return res.status(400).json({
                message: 'Invalid notice audience'
            });
        }

        const notice = await createNotice(
            Number(authorId),
            title,
            content,
            audience
        );

        return res.status(201).json(notice);
    } catch {
        return res.status(500).json({
            message: 'Failed to create notice'
        });
    }
};

export const editNotice = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const {
            title,
            content,
            audience
        } = req.body;

        if (!title || !content || !audience) {
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

        if (!validAudiences.includes(audience)) {
            return res.status(400).json({
                message: 'Invalid notice audience'
            });
        }

        const notice = await updateNotice(
            id,
            title,
            content,
            audience
        );

        if (!notice) {
            return res.status(404).json({
                message: 'Notice not found'
            });
        }

        return res.status(200).json(notice);
    } catch {
        return res.status(500).json({
            message: 'Failed to update notice'
        });
    }
};

export const removeNotice = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const notice = await deleteNotice(id);

        if (!notice) {
            return res.status(404).json({
                message: 'Notice not found'
            });
        }

        return res.status(200).json({
            message: 'Notice deleted successfully'
        });
    } catch {
        return res.status(500).json({
            message: 'Failed to delete notice'
        });
    }
};

export const getAudienceNotices = async (
    req: Request,
    res: Response
) => {
    try {
        const audience = String(req.params.audience);

        const notices =
            await getNoticesByAudience(audience);

        return res.status(200).json(notices);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch notices'
        });
    }
};