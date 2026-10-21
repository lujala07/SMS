import type { ReactNode } from 'react';

export default function PageHeader({ title, description, action }: { title: ReactNode; description?: ReactNode; action?: ReactNode }) {
    return <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0"><h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>{description && <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>}</div>
        {action && <div className="shrink-0 [&>button]:m-0 [&>button]:min-h-10 [&>button]:rounded-lg [&>button]:text-sm [&>button]:font-medium">{action}</div>}
    </div>;
}
