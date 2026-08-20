INSERT INTO users (email, password_hash, role)
VALUES
    ('admin@sms.local', '$2b$10$t1ci/bmjbk2tlm9WFEF7cexG.SJlbZytXl5YJNbriaccReK2hsM5y', 'admin'),
    ('teacher@sms.local', '$2b$10$t1ci/bmjbk2tlm9WFEF7cexG.SJlbZytXl5YJNbriaccReK2hsM5y', 'teacher'),
    ('student@sms.local', '$2b$10$t1ci/bmjbk2tlm9WFEF7cexG.SJlbZytXl5YJNbriaccReK2hsM5y', 'student')
ON CONFLICT (email) DO NOTHING;

INSERT INTO departments (name, code)
VALUES ('Computer Application', 'BCA')
ON CONFLICT (code) DO NOTHING;

INSERT INTO classes (department_id, name, semester, academic_year)
SELECT departments.id, 'BCA 4th Semester', 4, '2081/82'
FROM departments
WHERE departments.code = 'BCA'
AND NOT EXISTS (
    SELECT 1
    FROM classes
    WHERE classes.name = 'BCA 4th Semester'
    AND classes.academic_year = '2081/82'
);

INSERT INTO teachers (user_id, department_id, first_name, last_name, phone_number, address)
SELECT users.id, departments.id, 'Demo', 'Teacher', '9800000001', 'Kathmandu'
FROM users
CROSS JOIN departments
WHERE users.email = 'teacher@sms.local'
AND departments.code = 'BCA'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO students (
    user_id,
    class_id,
    student_code,
    first_name,
    last_name,
    date_of_birth,
    phone_number,
    address,
    gender
)
SELECT
    users.id,
    classes.id,
    'BCA-DEMO-001',
    'Demo',
    'Student',
    '2003-01-15',
    '9800000002',
    'Kathmandu',
    'other'
FROM users
CROSS JOIN classes
WHERE users.email = 'student@sms.local'
AND classes.name = 'BCA 4th Semester'
AND classes.academic_year = '2081/82'
ON CONFLICT (student_code) DO NOTHING;

INSERT INTO subjects (class_id, name, code)
SELECT classes.id, 'Database Management System', 'BCA401'
FROM classes
WHERE classes.name = 'BCA 4th Semester'
AND classes.academic_year = '2081/82'
ON CONFLICT (code) DO NOTHING;

INSERT INTO subjects (class_id, name, code)
SELECT classes.id, 'Web Technology', 'BCA402'
FROM classes
WHERE classes.name = 'BCA 4th Semester'
AND classes.academic_year = '2081/82'
ON CONFLICT (code) DO NOTHING;

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT teachers.id, subjects.id
FROM teachers
CROSS JOIN subjects
JOIN users
    ON teachers.user_id = users.id
WHERE users.email = 'teacher@sms.local'
AND subjects.code IN ('BCA401', 'BCA402')
ON CONFLICT (teacher_id, subject_id) DO NOTHING;

INSERT INTO attendance (student_id, subject_id, marked_by, attendance_date, status)
SELECT students.id, subjects.id, teachers.id, DATE '2026-08-17', 'present'
FROM students
CROSS JOIN subjects
CROSS JOIN teachers
JOIN users
    ON teachers.user_id = users.id
WHERE students.student_code = 'BCA-DEMO-001'
AND subjects.code = 'BCA401'
AND users.email = 'teacher@sms.local'
ON CONFLICT (student_id, subject_id, attendance_date)
DO UPDATE SET status = EXCLUDED.status;

INSERT INTO attendance (student_id, subject_id, marked_by, attendance_date, status)
SELECT students.id, subjects.id, teachers.id, DATE '2026-08-18', 'late'
FROM students
CROSS JOIN subjects
CROSS JOIN teachers
JOIN users
    ON teachers.user_id = users.id
WHERE students.student_code = 'BCA-DEMO-001'
AND subjects.code = 'BCA402'
AND users.email = 'teacher@sms.local'
ON CONFLICT (student_id, subject_id, attendance_date)
DO UPDATE SET status = EXCLUDED.status;

INSERT INTO assignments (subject_id, teacher_id, title, description, due_date, total_marks)
SELECT
    subjects.id,
    teachers.id,
    'ER Diagram Practice',
    'Create an ER diagram for a college library system.',
    DATE '2026-08-30',
    20
FROM subjects
CROSS JOIN teachers
JOIN users
    ON teachers.user_id = users.id
WHERE subjects.code = 'BCA401'
AND users.email = 'teacher@sms.local'
AND NOT EXISTS (
    SELECT 1
    FROM assignments
    WHERE assignments.title = 'ER Diagram Practice'
);

INSERT INTO assignments (subject_id, teacher_id, title, description, due_date, total_marks)
SELECT
    subjects.id,
    teachers.id,
    'React Form Exercise',
    'Build a validated student registration form.',
    DATE '2026-09-05',
    25
FROM subjects
CROSS JOIN teachers
JOIN users
    ON teachers.user_id = users.id
WHERE subjects.code = 'BCA402'
AND users.email = 'teacher@sms.local'
AND NOT EXISTS (
    SELECT 1
    FROM assignments
    WHERE assignments.title = 'React Form Exercise'
);

INSERT INTO submissions (
    assignment_id,
    student_id,
    submission_text,
    marks_obtained,
    feedback,
    status
)
SELECT
    assignments.id,
    students.id,
    'Submitted demo answer for review.',
    16,
    'Good structure. Add cardinality labels next time.',
    'reviewed'
FROM assignments
CROSS JOIN students
WHERE assignments.title = 'ER Diagram Practice'
AND students.student_code = 'BCA-DEMO-001'
ON CONFLICT (assignment_id, student_id)
DO UPDATE SET
    submission_text = EXCLUDED.submission_text,
    marks_obtained = EXCLUDED.marks_obtained,
    feedback = EXCLUDED.feedback,
    status = EXCLUDED.status;

INSERT INTO notices (author_id, title, content, audience)
SELECT
    users.id,
    'Welcome to the SMS Demo',
    'This local dataset includes admin, teacher, and student workflows.',
    'all'
FROM users
WHERE users.email = 'admin@sms.local'
AND NOT EXISTS (
    SELECT 1
    FROM notices
    WHERE notices.title = 'Welcome to the SMS Demo'
);
