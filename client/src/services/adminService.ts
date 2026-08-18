import api from './api';

export const createAdmin = async (
    email: string,
    password: string
) => {
    const response = await api.post(
        '/admins',
        {
            email,
            password
        }
    );

    return response.data;
};