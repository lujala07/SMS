import api from './api';

export interface CreateTeacherData {
    email: string;
    password: string;
    departmentId?: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
}

export const createTeacher = async (
    data: CreateTeacherData
) => {
    const response = await api.post(
        '/teachers',
        data
    );

    return response.data;
};