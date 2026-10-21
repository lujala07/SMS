import type { ReactNode } from 'react';

interface SortableHeaderProps {
    column: number;
    sortColumn: number;
    sortDirection: 'asc' | 'desc';
    onSort: (column: number) => void;
    className?: string;
    children: ReactNode;
}

export default function SortableHeader({ column, sortColumn, sortDirection, onSort, className, children }: SortableHeaderProps) {
    const active = column === sortColumn;
    return (
        <th scope="col" className={className} aria-sort={active ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}>
            <button type="button" className="inline-flex items-center gap-2 rounded text-left hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600" onClick={() => onSort(column)} title={active && sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}>
                {children}
                <span aria-hidden="true" className={active ? 'text-blue-700' : 'text-gray-400'}>{active ? sortDirection === 'asc' ? '↑' : '↓' : '↕'}</span>
            </button>
        </th>
    );
}
