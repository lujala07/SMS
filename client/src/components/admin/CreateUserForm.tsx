import { useEffect, useState } from 'react';
import axios from 'axios';
import { mobileError, normalizeNepalMobile } from '../../utils/phone';

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

const requiredMark = (
    <span className="text-red-600 ml-1">
        *
    </span>
);

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

        const trimmedEmail =
            email.trim();
        const trimmedFirstName =
            firstName.trim();
        const trimmedLastName =
            lastName.trim();
        const trimmedPhoneNumber =
            phoneNumber.trim();
        const trimmedAddress =
            address.trim();
        if (
            !trimmedEmail ||
            (role === 'admin' && !password.trim())
        ) {
            setError(
                role === 'admin' ? 'Email and password are required.' : 'Email is required.'
            );
            return;
        }

        if (
            role !== 'admin' &&
            (!trimmedFirstName ||
                !trimmedLastName)
        ) {
            setError(
                'First name and last name are required.'
            );
            return;
        }

        if (
            role === 'teacher' &&
            (!trimmedPhoneNumber ||
                !trimmedAddress ||
                !departmentId)
        ) {
            setError(
                'Phone number, address and department are required for teachers.'
            );
            return;
        }

        if (
            role === 'student' &&
            (!classId ||
                !trimmedPhoneNumber ||
                !trimmedAddress ||
                !gender)
        ) {
            setError(
                'Class, phone number, address and gender are required for students.'
            );
            return;
        }

        const mobile = normalizeNepalMobile(phoneNumber);
        if (role !== 'admin' && !mobile) {
            setError(mobileError);
            return;
        }

        setLoading(true);

        try {
            if (role === 'admin') {
                await createAdmin(
                    trimmedEmail,
                    password
                );
            }

            if (role === 'teacher') {
                await createTeacher({
                    email: trimmedEmail,
                    firstName:
                        trimmedFirstName,
                    lastName:
                        trimmedLastName,

                    departmentId:
                        departmentId
                            ? Number(departmentId)
                            : undefined,

                    phoneNumber:
                        mobile!,
                    address:
                        trimmedAddress
                });
            }

            if (role === 'student') {
                await createStudent({
                    email: trimmedEmail,
                    firstName:
                        trimmedFirstName,
                    lastName:
                        trimmedLastName,
                    classId: Number(classId),
                    phoneNumber:
                        mobile!,
                    address:
                        trimmedAddress,
                    gender
                });
            }

            setSuccess(
                role === 'admin' ? 'Admin created successfully.' : `${role.charAt(0).toUpperCase() + role.slice(1)} created. An invitation email has been sent so they can set their password.`
            );

            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setAddress('');
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

            <form noValidate
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div>
                    <label className="block mb-1 font-medium">
                        Role
                        {requiredMark}
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
                        {requiredMark}
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

                {role === 'admin' && <div>
                    <label className="block mb-1 font-medium">
                        Password
                        {requiredMark}
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
                </div>}

                {role !== 'admin' && (
                    <>
                        <div>
                            <label className="block mb-1 font-medium">
                                First Name
                                {requiredMark}
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
                                {requiredMark}
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
                                {requiredMark}
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
                                {requiredMark}
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
                            {requiredMark}
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
                                Class
                                {requiredMark}
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
                                {requiredMark}
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

                <div className="md:col-span-2 flex justify-end">
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
