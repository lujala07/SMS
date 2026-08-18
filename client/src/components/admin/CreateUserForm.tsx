import { useState } from 'react';

import { createAdmin } from '../../services/adminService';
import { createStudent } from '../../services/studentService';
import { createTeacher } from '../../services/teacherService';

type Role = 'student' | 'teacher' | 'admin';

interface Props {
    onSuccess?: () => void;
}

function CreateUserForm({ onSuccess }: Props) {
    const [role, setRole] = useState<Role>('student');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [studentCode, setStudentCode] = useState('');
    const [classId, setClassId] = useState('');
    const [gender, setGender] = useState('');

    const [departmentId, setDepartmentId] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setStudentCode('');
        setClassId('');
        setGender('');
        setDepartmentId('');
        setPhoneNumber('');
        setAddress('');
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

        try {
            if (role === 'admin') {
                await createAdmin(
                    email,
                    password
                );
            }

            if (role === 'student') {
                if (!studentCode || !classId) {
                    setError(
                        'Student code and class are required.'
                    );
                    return;
                }

                await createStudent({
                    email,
                    password,
                    studentCode,
                    firstName,
                    lastName,
                    classId: Number(classId),
                    phoneNumber,
                    address,
                    gender
                });
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

            setSuccess(
                'User created successfully.'
            );

            resetForm();

            if (onSuccess) {
                onSuccess();
            }
        } catch {
            setError(
                'Could not create user.'
            );
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
                            setRole(
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
                            setEmail(
                                event.target.value
                            )
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Enter email"
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
                            setPassword(
                                event.target.value
                            )
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Enter password"
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
                                className="w-full border p-2 rounded"
                                placeholder="First name"
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
                                className="w-full border p-2 rounded"
                                placeholder="Last name"
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
                                className="w-full border p-2 rounded"
                                placeholder="Phone number"
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
                                className="w-full border p-2 rounded"
                                placeholder="Address"
                            />
                        </div>
                    </>
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
                                className="w-full border p-2 rounded"
                                placeholder="Student code"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Class ID
                            </label>

                            <input
                                type="number"
                                value={classId}
                                onChange={(event) =>
                                    setClassId(
                                        event.target.value
                                    )
                                }
                                className="w-full border p-2 rounded"
                                placeholder="Class ID"
                            />
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

                {role === 'teacher' && (
                    <div>
                        <label className="block mb-1 font-medium">
                            Department ID
                        </label>

                        <input
                            type="number"
                            value={departmentId}
                            onChange={(event) =>
                                setDepartmentId(
                                    event.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                            placeholder="Department ID"
                        />
                    </div>
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateUserForm;