import { Search } from 'lucide-react';

interface TableToolbarProps {
    query: string;
    onQueryChange: (value: string) => void;
    total: number;
    sourceTotal: number;
    label: string;
}

export default function TableToolbar({ query, onQueryChange, total, sourceTotal, label }: TableToolbarProps) {
    return (
        <div className="flex flex-col items-start gap-2 border-b border-gray-200 p-4">
            <label className="relative block w-full min-w-0 sm:max-w-xl">
                <span className="sr-only">Search {label.toLowerCase()}</span>
                <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="search" value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Search..." className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </label>
            <div className="text-sm text-gray-500 empty:hidden" role="status">
                {query.trim() && <span>{total === 0 ? 'No matching records.' : `${total} of ${sourceTotal} records match`}</span>}
            </div>
        </div>
    );
}
