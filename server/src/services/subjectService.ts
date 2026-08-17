import pool from '../config/database.js';

export const getAllSubjects = async () => {
    const result = await pool.query(
        `SELECT
            subjects.*,
            classes.name AS class_name
         FROM subjects
         JOIN classes
            ON subjects.class_id = classes.id
         ORDER BY subjects.id`
    );

    return result.rows;
};

export const createSubject = async (
    classId: number,
    name: string,
    code: string
) => {
    const result = await pool.query(
        `INSERT INTO subjects (
            class_id,
            name,
            code
        )
        VALUES ($1, $2, $3)
        RETURNING *`,
        [classId, name, code]
    );

    return result.rows[0];
};

export const updateSubject = async (
    id: number,
    classId: number,
    name: string,
    code: string
) => {
    const result = await pool.query(
        `UPDATE subjects
         SET class_id = $1,
             name = $2,
             code = $3
         WHERE id = $4
         RETURNING *`,
        [classId, name, code, id]
    );

    return result.rows[0];
};

export const deleteSubject = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM subjects
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};