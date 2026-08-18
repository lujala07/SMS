import { useEffect, useState } from 'react';
import axios from 'axios';

import { createAdmin } from '../../services/adminService';
import { createStudent } from '../../services/studentService';
import { createTeacher } from '../../services/teacherService';

import {
    getDepartments,
    type Department
} from '../../services/departmentService';

import {
    getClasses,
    type ClassItem
} from '../../services/classService';

type Role = 'student' | 'teacher' | 'admin';

interface Props {
    onSuccess?: () => void;
}

function CreateUserForm({ onSuccess }: Props) {
    const [role, setRole] =
        useState<Role>('student');

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [firstName, setFirstName] =
        useState('');

    const [lastName, setLastName] =
        useState('');

    const [phoneNumber, setPhoneNumber] =
        useState('');

    const [address, setAddress] =
        useState('');

    const [studentCode, setStudentCode] =
        useState('');

    const [classId, setClassId] =
        useState('');

    const [gender, setGender] =
        useState('');

    const [departmentId, setDepartmentId] =
        useState('');

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [classes, setClasses] =
        useState<ClassItem[]>([]);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [
                    departmentData,
                    classData
                ] = await Promise.all([
                    getDepartments(),
                    getClasses()
                ]);

                setDepartments(departmentData);
                setClasses(classData);
            } catch (error) {
                console.error(
                    'Could not load departments/classes:',
                    error
                );
            }
        };

        loadOptions();
    }, []);

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setAddress('');

        setStudentCode('');
        setClassId('');
        setGender('');

        setDepartmentId('');

        setError('');
        setSuccess('');
    };

    const handleRoleChange = (
        newRole: Role
    ) => {
        clearForm();
        setRole(newRole);
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!email || !password) {
            setError(
                'Email and password are required.'
            );
            return;
        }

        if (
            role !== 'admin' &&
            (!firstName || !lastName)
        ) {
            setError(
                'First name and last name are required.'
            );
            return;
        }

        if (
            role === 'student' &&
            (!studentCode || !classId)
        ) {
            setError(
                'Student code and class are required.'
            );
            return;
        }

        setLoading(true);

        try {
            if (role === 'admin') {
                await createAdmin(
                    email,
                    password
                );
            }

            if (role === 'teacher') {
                await createTeacher({
                    email,
                    password,
                    firstName,
                    lastName,

                    departmentId:
                        departmentId
                            ? Number(departmentId)
                            : undefined,

                    phoneNumber,
                    address
                });
            }

            if (role === 'student') {
                await createStudent({
                    email,
                    password,
                    firstName,
                    lastName,
                    studentCode,
                    classId: Number(classId),
                    phoneNumber,
                    address,
                    gender
                });
            }

            setSuccess(
                `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully.`
            );

            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setAddress('');
            setStudentCode('');
            setClassId('');
            setGender('');
            setDepartmentId('');

            onSuccess?.();

        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    'Could not create user.'
                );
            } else {
                setError(
                    'Could not create user.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-5">
                Add User
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">
                        Role
                    </label>

                    <select
                        value={role}
                        onChange={(event) =>
                            handleRoleChange(
                                event.target.value as Role
                            )
                        }
                        className="w-full border p-2 rounded"
                    >
                        <option value="student">
                            Student
                        </option>

                        <option value="teacher">
                            Teacher
                        </option>

                        <option value="admin">
                            Admin
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Enter email"
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter password"
                        className="w-full border p-2 rounded"
                    />
                </div>

                {role !== 'admin' && (
                    <>
                        <div>
                            <label className="block mb-1 font-medium">
                                First Name
                            </label>

                            <input
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(
                                        event.target.value
                                    )
                                }
                                placeholder="First name"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Last Name
                            </label>

                            <input
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(
                                        event.target.value
                                    )
                                }
                                placeholder="Last name"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(event) =>
                                    setPhoneNumber(
                                        event.target.value
                                    )
                                }
                                placeholder="Phone number"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Address
                            </label>

                            <input
                                type="text"
                                value={address}
                                onChange={(event) =>
                                    setAddress(
                                        event.target.value
                                    )
                                }
                                placeholder="Address"
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </>
                )}

                {role === 'teacher' && (
                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">
                            Department
                        </label>

                        <select
                            value={departmentId}
                            onChange={(event) =>
                                setDepartmentId(
                                    event.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        >
                            <option value="">
                                Select Department
                            </option>

                            {departments.map(
                                (department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.code}
                                        {' - '}
                                        {department.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}

                {role === 'student' && (
                    <>
                        <div>
                            <label className="block mb-1 font-medium">
                                Student Code
                            </label>

                            <input
                                type="text"
                                value={studentCode}
                                onChange={(event) =>
                                    setStudentCode(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. STU001"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Class
                            </label>

                            <select
                                value={classId}
                                onChange={(event) =>
                                    setClassId(
                                        event.target.value
                                    )
                                }
                                className="w-full border p-2 rounded"
                            >
                                <option value="">
                                    Select Class
                                </option>

                                {classes.map(
                                    (classItem) => (
                                        <option
                                            key={classItem.id}
                                            value={classItem.id}
                                        >
                                            {classItem.name}
                                            {classItem.semester
                                                ? ` - Semester ${classItem.semester}`
                                                : ''}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Gender
                            </label>

                            <select
                                value={gender}
                                onChange={(event) =>
                                    setGender(
                                        event.target.value
                                    )
                                }
                                className="w-full border p-2 rounded"
                            >
                                <option value="">
                                    Select Gender
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>
                    </>
                )}

                {error && (
                    <p className="text-red-500 text-sm md:col-span-2">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-green-600 text-sm md:col-span-2">
                        {success}
                    </p>
                )}

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded"
                    >
                        {loading
                            ? 'Creating...'
                            : 'Create User'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateUserForm;