import api from './api';

export interface Student {
    id: number;
    student_code: string;
    first_name: string;
    last_name: string;
    email: string;
    class_name?: string;
    class_id: number;
    phone_number?: string;
    address?: string;
    gender?: string;
}

export interface CreateStudentData {
    email: string;
    password: string;
    classId: number;
    studentCode: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    gender?: string;
}

export interface UpdateStudentData {
    classId: number;
    studentCode: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    gender?: string;
}

export const getStudents = async () => {
    const response = await api.get('/students');
    return response.data;
};

export const createStudent = async (
    data: CreateStudentData
) => {
    const response = await api.post('/students', data);
    return response.data;
};

export const deleteStudent = async (
    id: number
) => {
    const response = await api.delete(
        `/students/${id}`
    );

    return response.data;
};

export const updateStudent = async (
    id: number,
    data: UpdateStudentData
) => {
    const response = await api.put(
        `/students/${id}`,
        data
    );

    return response.data;
};
