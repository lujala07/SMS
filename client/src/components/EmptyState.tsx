import { Inbox } from 'lucide-react';

export default function EmptyState({ title, description }: { title: string; description?: string }) {
    return <div className="flex flex-col items-center px-4 py-8 text-center"><div className="mb-3 rounded-full bg-gray-100 p-3 text-gray-400"><Inbox size={24} aria-hidden="true" /></div><p className="text-sm font-medium text-gray-700">{title}</p>{description && <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">{description}</p>}</div>;
}
