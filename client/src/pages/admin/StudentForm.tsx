import { useState } from 'react';
import {
    createStudent
} from '../../services/studentService';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
}

function StudentForm({
    onSuccess,
    onCancel
}: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [studentCode, setStudentCode] =
        useState('');
    const [firstName, setFirstName] =
        useState('');
    const [lastName, setLastName] =
        useState('');
    const [classId, setClassId] =
        useState('');
    const [phoneNumber, setPhoneNumber] =
        useState('');
    const [gender, setGender] =
        useState('');

    const [error, setError] = useState('');

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError('');

        if (
            !email ||
            !password ||
            !studentCode ||
            !firstName ||
            !lastName ||
            !classId
        ) {
            setError(
                'Please fill in all required fields.'
            );
            return;
        }

        try {
            await createStudent({
                email,
                password,
                studentCode,
                firstName,
                lastName,
                classId: Number(classId),
                phoneNumber,
                gender
            });

            onSuccess();
        } catch {
            setError(
                'Could not create student.'
            );
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">
                Add Student
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <input
                    type="text"
                    placeholder="Student Code"
                    value={studentCode}
                    onChange={(e) =>
                        setStudentCode(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) =>
                        setFirstName(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) =>
                        setLastName(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="number"
                    placeholder="Class ID"
                    value={classId}
                    onChange={(e) =>
                        setClassId(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) =>
                        setPhoneNumber(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                <select
                    value={gender}
                    onChange={(e) =>
                        setGender(e.target.value)
                    }
                    className="border p-2 rounded"
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

                {error && (
                    <p className="text-red-500 text-sm md:col-span-2">
                        {error}
                    </p>
                )}

                <div className="md:col-span-2 flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save Student
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-200 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default StudentForm;