import pool from '../config/database.js';

export const getAllDepartments = async () => {
    const result = await pool.query(
        'SELECT * FROM departments ORDER BY id'
    );

    return result.rows;
};

export const createDepartment = async (
    name: string,
    code: string
) => {
    const result = await pool.query(
        `INSERT INTO departments (name, code)
         VALUES ($1, $2)
         RETURNING *`,
        [name, code]
    );

    return result.rows[0];
};

export const updateDepartment = async (
    id: number,
    name: string,
    code: string
) => {
    const result = await pool.query(
        `UPDATE departments
         SET name = $1, code = $2
         WHERE id = $3
         RETURNING *`,
        [name, code, id]
    );

    return result.rows[0];
};

export const deleteDepartment = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM departments
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};