BEGIN;

CREATE OR REPLACE FUNCTION next_student_code() RETURNS TEXT
LANGUAGE SQL VOLATILE AS $$
    SELECT 'STU' || LPAD(code, GREATEST(3, LENGTH(code)), '0')
    FROM (SELECT nextval('student_code_seq')::TEXT AS code) generated;
$$;

ALTER TABLE students ALTER COLUMN student_code SET DEFAULT next_student_code();

COMMIT;
