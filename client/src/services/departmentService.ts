import api from './api';

export interface Department {
    id: number;
    name: string;
    code: string;
}

export const getDepartments = async () => {
    const response = await api.get('/departments');
    return response.data;
};