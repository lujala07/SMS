import api from './api';

export interface Subject {
    id: number;
    class_id: number;
    name: string;
    code: string;
    class_name?: string;
}

export interface SubjectData {
    classId: number;
    name: string;
    code: string;
}

export const getSubjects = async () => {
    const response = await api.get('/subjects');
    return response.data;
};

export const createSubject = async (
    data: SubjectData
) => {
    const response = await api.post(
        '/subjects',
        data
    );

    return response.data;
};

export const updateSubject = async (
    id: number,
    data: SubjectData
) => {
    const response = await api.put(
        `/subjects/${id}`,
        data
    );

    return response.data;
};

export const deleteSubject = async (
    id: number
) => {
    const response = await api.delete(
        `/subjects/${id}`
    );

    return response.data;
};
