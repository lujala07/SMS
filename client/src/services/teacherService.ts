import api from './api';

export interface Teacher {
    id: number;
    user_id: number;
    department_id?: number;
    first_name: string;
    last_name: string;
    phone_number?: string;
    address?: string;
    department_name?: string;
    email: string;
    is_active: boolean;
}

export interface CreateTeacherData {
    email: string;
    password: string;
    departmentId?: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
}

export const getTeachers = async () => {
    const response = await api.get('/teachers');
    return response.data;
};

export const createTeacher = async (
    data: CreateTeacherData
) => {
    const response = await api.post(
        '/teachers',
        data
    );

    return response.data;
};

export const deleteTeacher = async (
    id: number
) => {
    const response = await api.delete(
        `/teachers/${id}`
    );

    return response.data;
};