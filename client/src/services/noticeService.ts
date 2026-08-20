import api from './api';

export interface Notice {
    id: number;
    title: string;
    content: string;
    audience: string;
    created_at: string;
    author_email?: string;
}

export interface NoticeData {
    title: string;
    content: string;
    audience: string;
}

export const getNotices = async () => {
    const response = await api.get('/notices');
    return response.data;
};

export const createNotice = async (
    data: NoticeData
) => {
    const response = await api.post(
        '/notices',
        data
    );

    return response.data;
};

export const updateNotice = async (
    id: number,
    data: NoticeData
) => {
    const response = await api.put(
        `/notices/${id}`,
        data
    );

    return response.data;
};

export const deleteNotice = async (
    id: number
) => {
    const response = await api.delete(
        `/notices/${id}`
    );

    return response.data;
};
