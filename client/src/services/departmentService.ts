import api from './api';

export interface Department {
    id: number;
    name: string;
    code: string;
}

export interface DepartmentData {
    name: string;
    code: string;
}

export const getDepartments = async () => {
    const response = await api.get('/departments');
    return response.data;
};

export const createDepartment = async (
    data: DepartmentData
) => {
    const response = await api.post(
        '/departments',
        data
    );

    return response.data;
};

export const updateDepartment = async (
    id: number,
    data: DepartmentData
) => {
    const response = await api.put(
        `/departments/${id}`,
        data
    );

    return response.data;
};

export const deleteDepartment = async (
    id: number
) => {
    const response = await api.delete(
        `/departments/${id}`
    );

    return response.data;
};
