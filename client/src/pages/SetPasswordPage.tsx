import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';

function SetPasswordPage() {
    const [token] = useState(() => window.location.hash.slice(1));
    useEffect(() => {
        window.history.replaceState(null, '', window.location.pathname);
    }, []);
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [complete, setComplete] = useState(false);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (password.trim().length < 8 || new TextEncoder().encode(password).length > 72) {
            setError(password.trim().length < 8 ? 'Password must be at least 8 characters.' : 'Password is too long.');
            return;
        }
        if (password !== confirmation) {
            setError('Passwords do not match.');
            return;
        }
        setSaving(true);
        try {
            await api.post('/auth/set-password', { token, password });
            setPassword('');
            setConfirmation('');
            setComplete(true);
        } catch (error) {
            setError(axios.isAxiosError(error) ? error.response?.data?.message || 'Could not set password. Please try again.' : 'Could not set password. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
                <h1 className="mb-2 text-2xl font-semibold">Set your password</h1>
                {complete ? (
                    <div>
                        <p className="my-4 text-gray-600" role="status">Your password is ready. You can now sign in with your email.</p>
                        <Link className="text-blue-600 underline" to="/">Go to login</Link>
                    </div>
                ) : !/^[a-f0-9]{64}$/.test(token) ? (
                    <p className="mt-4 text-red-600" role="alert">Open the full invitation link from your email. If it has expired, ask your administrator to resend it.</p>
                ) : (
                    <form noValidate onSubmit={submit} className="mt-5 space-y-4">
                        <p className="text-sm text-gray-600">Choose a password with at least 8 characters.</p>
                        <div>
                            <label htmlFor="new-password" className="mb-1 block">Password</label>
                            <input id="new-password" type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} className="w-full rounded border p-2" />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="mb-1 block">Confirm password</label>
                            <input id="confirm-password" type="password" autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} className="w-full rounded border p-2" />
                        </div>
                        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                        <button type="submit" disabled={saving} className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Set password'}</button>
                    </form>
                )}
            </div>
        </main>
    );
}

export default SetPasswordPage;
