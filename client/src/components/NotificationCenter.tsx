import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { io } from 'socket.io-client';
import api, { API_BASE_URL } from '../services/api';

interface Notification {
    id: number;
    title: string;
    message: string;
    link: string;
    read_at: string | null;
    created_at: string;
}

interface NotificationResponse {
    notifications: Notification[];
    unread_count: number;
}

const formatDate = (value: string) => new Date(value).toLocaleString('en-GB', {
    timeZone: 'Asia/Kathmandu', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
});

function NotificationToast({ notification, dismiss, open }: {
    notification: Notification;
    dismiss: (id: number) => void;
    open: (notification: Notification) => void;
}) {
    const [paused, setPaused] = useState(false);
    useEffect(() => {
        if (paused) return;
        const timer = window.setTimeout(() => dismiss(notification.id), 8000);
        return () => window.clearTimeout(timer);
    }, [paused, dismiss, notification.id]);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                <button type="button" onClick={() => dismiss(notification.id)} className="shrink-0 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900" aria-label={`Dismiss ${notification.title}`}><X size={16} aria-hidden="true" /></button>
            </div>
            <button type="button" onClick={() => open(notification)} className="mt-2 w-full text-left text-sm text-gray-600 hover:text-blue-700">
                <span className="line-clamp-3 break-words">{notification.message}</span>
                <span className="mt-2 block text-xs text-blue-700">View notification</span>
            </button>
        </div>
    );
}

function NotificationCenter() {
    const navigate = useNavigate();
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const request = useRef(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toasts, setToasts] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [updating, setUpdating] = useState(false);

    const load = useCallback((before?: number) => {
        const currentRequest = ++request.current;
        return api.get<NotificationResponse>('/notifications', { params: before ? { before } : {} }).then(response => {
            if (currentRequest !== request.current) return;
            setNotifications(previous => before ? [...new Map([...previous, ...response.data.notifications].map(item => [item.id, item])).values()] : response.data.notifications);
            setUnread(response.data.unread_count);
            setHasMore(response.data.notifications.length === 50);
            setError('');
        }).catch(() => {
            if (currentRequest === request.current) setError('Could not load notifications. Please try again.');
        }).finally(() => {
            if (currentRequest === request.current) setLoading(false);
        });
    }, []);

    const invalidateRequests = useCallback(() => { ++request.current; }, []);

    useEffect(() => {
        const socket = io(API_BASE_URL, {
            auth: callback => callback({ token: localStorage.getItem('token') })
        });
        const received = new Set<number>();
        void load();
        socket.on('connect', () => {
            void load();
        });
        socket.on('notification:new', (notification: Notification) => {
            void load();
            if (received.has(notification.id)) return;
            received.add(notification.id);
            if (received.size > 500) received.delete(received.values().next().value!);
            if (document.visibilityState === 'visible') {
                setToasts(previous => [...previous, notification].slice(-3));
            }
        });
        socket.on('notification:read', () => { void load(); });
        const refresh = () => {
            if (document.visibilityState === 'visible') void load();
        };
        document.addEventListener('visibilitychange', refresh);
        return () => {
            invalidateRequests();
            socket.disconnect();
            document.removeEventListener('visibilitychange', refresh);
        };
    }, [load, invalidateRequests]);

    const dismiss = useCallback((id: number) => setToasts(previous => previous.filter(item => item.id !== id)), []);
    const close = () => {
        dialog.current?.close();
        setOpen(false);
        trigger.current?.focus();
    };
    const openNotification = async (notification: Notification) => {
        try {
            if (!notification.read_at) await api.patch('/notifications/read', { id: notification.id });
            dismiss(notification.id);
            close();
            void load();
            navigate(notification.link);
        } catch {
            setError('Could not mark the notification as read. Please try again.');
            dialog.current?.showModal();
            setOpen(true);
        }
    };
    const markAllRead = async () => {
        if (!notifications[0]) return;
        setUpdating(true);
        try {
            await api.patch('/notifications/read', { id: notifications[0].id, all: true });
            await load();
        } catch {
            setError('Could not mark notifications as read. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
            <button ref={trigger} type="button" onClick={() => { dialog.current?.showModal(); setOpen(true); void load(); }} aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} aria-haspopup="dialog" aria-expanded={open} aria-controls="notification-drawer" className="relative rounded p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-600">
                <Bell size={22} aria-hidden="true" />
                {unread > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1 text-center text-xs font-medium leading-5 text-white" aria-hidden="true">{unread > 99 ? '99+' : unread}</span>}
            </button>

            <dialog ref={dialog} id="notification-drawer" aria-labelledby="notification-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget && event.clientX < event.currentTarget.getBoundingClientRect().left) close(); }} className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-sm border-l border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/30">
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-5">
                        <div>
                            <h2 id="notification-title" className="text-lg font-semibold">Notifications</h2>
                        </div>
                        <button type="button" onClick={close} className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">Close</button>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 text-sm">
                        <p className="text-gray-600">{unread} unread</p>
                        <button type="button" onClick={() => void markAllRead()} disabled={!unread || updating || !notifications.length} className="text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline">{updating ? 'Updating...' : 'Mark all as read'}</button>
                    </div>
                    <div className="flex-1 overflow-y-auto" aria-busy={loading}>
                        {error && <div className="m-4 rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{error} <button type="button" onClick={() => void load()} className="underline">Retry</button></div>}
                        {loading && !notifications.length ? <p className="p-5 text-sm text-gray-500" role="status">Loading notifications...</p> : !notifications.length && !error ? <p className="p-5 text-sm text-gray-500">No notifications yet.</p> : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.map(notification => (
                                    <li key={notification.id}>
                                        <button type="button" onClick={() => void openNotification(notification)} className={`w-full p-5 text-left hover:bg-gray-100 ${notification.read_at ? 'bg-white' : 'bg-blue-50'}`}>
                                            <span className="flex items-center justify-between gap-2"><span className="font-medium text-gray-900">{notification.title}</span>{!notification.read_at && <span className="shrink-0 text-xs text-blue-700">Unread</span>}</span>
                                            <span className="mt-1 block break-words text-sm text-gray-600">{notification.message}</span>
                                            <time dateTime={notification.created_at} className="mt-2 block text-xs text-gray-500">{formatDate(notification.created_at)}</time>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {hasMore && <button type="button" disabled={loading} onClick={() => { setLoading(true); void load(notifications.at(-1)?.id); }} className="w-full p-4 text-sm text-blue-700 disabled:opacity-50">{loading ? 'Loading...' : 'Load older notifications'}</button>}
                    </div>
                </div>
            </dialog>

            <div className="fixed bottom-4 right-4 z-40 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3" aria-live="polite" aria-relevant="additions">
                {toasts.map(notification => <NotificationToast key={notification.id} notification={notification} dismiss={dismiss} open={notification => { void openNotification(notification); }} />)}
            </div>
        </>
    );
}

export default NotificationCenter;
