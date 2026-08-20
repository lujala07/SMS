import api from './api';

export interface ClassItem {
    id: number;
    name: string;
    semester?: number;
    academic_year: string;
    department_id: number;
    department_name?: string;
}

export interface ClassData {
    departmentId: number;
    name: string;
    semester?: number;
    academicYear: string;
}

export const getClasses = async () => {
    const response = await api.get('/classes');
    return response.data;
};

export const createClass = async (
    data: ClassData
) => {
    const response = await api.post(
        '/classes',
        data
    );

    return response.data;
};

export const updateClass = async (
    id: number,
    data: ClassData
) => {
    const response = await api.put(
        `/classes/${id}`,
        data
    );

    return response.data;
};

export const deleteClass = async (
    id: number
) => {
    const response = await api.delete(
        `/classes/${id}`
    );

    return response.data;
};
