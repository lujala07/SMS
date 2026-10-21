const styles: Record<string, string> = {
    active: 'bg-green-50 text-green-700 ring-green-600/20', approved: 'bg-green-50 text-green-700 ring-green-600/20', published: 'bg-green-50 text-green-700 ring-green-600/20', reviewed: 'bg-green-50 text-green-700 ring-green-600/20', present: 'bg-green-50 text-green-700 ring-green-600/20',
    pending: 'bg-amber-50 text-amber-800 ring-amber-600/20', 'pending approval': 'bg-amber-50 text-amber-800 ring-amber-600/20', late: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    rejected: 'bg-red-50 text-red-700 ring-red-600/20', absent: 'bg-red-50 text-red-700 ring-red-600/20',
    submitted: 'bg-blue-50 text-blue-700 ring-blue-600/20'
};

export default function StatusBadge({ status }: { status: string }) {
    return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${styles[status.toLowerCase()] ?? 'bg-gray-100 text-gray-600 ring-gray-500/20'}`}>{status}</span>;
}
