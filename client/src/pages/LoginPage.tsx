import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            const result = await loginUser(
                email,
                password
            );

            localStorage.setItem(
                'token',
                result.token
            );

            localStorage.setItem(
                'user',
                JSON.stringify(result.user)
            );

            const role = result.user.role;

            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'teacher') {
                navigate('/teacher');
            } else if (role === 'student') {
                navigate('/student');
            }
        } catch {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-center mb-2">
                    SMS
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Sign in to continue
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="block mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email"
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                className="w-full border p-2 pr-16 rounded"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-3 top-2 text-sm text-gray-500"
                            >
                                {showPassword
                                    ? 'Hide'
                                    : 'Show'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;