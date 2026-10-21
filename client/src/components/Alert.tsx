import type { ReactNode } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';

export default function Alert({ children, tone = 'error' }: { children: ReactNode; tone?: 'error' | 'success' }) {
    const Icon = tone === 'error' ? CircleAlert : CircleCheck;
    return <div role={tone === 'error' ? 'alert' : 'status'} className={`my-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6 ${tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-green-200 bg-green-50 text-green-800'}`}>
        <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><div className="min-w-0 break-words">{children}</div>
    </div>;
}
