import pool from '../config/database.js';

export const getAllClasses = async () => {
    const result = await pool.query(
        `SELECT
            classes.*,
            departments.name AS department_name
         FROM classes
         JOIN departments
            ON classes.department_id = departments.id
         ORDER BY classes.id`
    );

    return result.rows;
};

export const createClass = async (
    departmentId: number,
    name: string,
    semester: number,
    academicYear: string
) => {
    const result = await pool.query(
        `INSERT INTO classes (
            department_id,
            name,
            semester,
            academic_year
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [departmentId, name, semester, academicYear]
    );

    return result.rows[0];
};

export const updateClass = async (
    id: number,
    departmentId: number,
    name: string,
    semester: number,
    academicYear: string
) => {
    const result = await pool.query(
        `UPDATE classes
         SET department_id = $1,
             name = $2,
             semester = $3,
             academic_year = $4
         WHERE id = $5
         RETURNING *`,
        [departmentId, name, semester, academicYear, id]
    );

    return result.rows[0];
};

export const deleteClass = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM classes
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};