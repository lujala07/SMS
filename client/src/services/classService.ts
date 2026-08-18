import api from './api';

export interface ClassItem {
    id: number;
    name: string;
    semester?: number;
    academic_year: string;
    department_id: number;
}

export const getClasses = async () => {
    const response = await api.get('/classes');
    return response.data;
};