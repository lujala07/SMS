import type { ReactNode } from 'react';

export default function FormField({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
    return <label className={`block min-w-0 ${className}`}><span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>{children}</label>;
}
