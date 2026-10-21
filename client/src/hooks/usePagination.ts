import { useState } from 'react';

export interface TableColumn<T> {
    label: string;
    value: keyof T | ((item: T) => unknown);
    numeric?: boolean;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function usePagination<T>(items: readonly T[], resetKey?: unknown, columns: readonly TableColumn<NoInfer<T>>[] = []) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState({ column: -1, direction: 'asc' as 'asc' | 'desc' });
    const [state, setState] = useState({ page: 1, pageSize: 10, resetKey });
    const valueFor = (item: T, column: TableColumn<T>) => typeof column.value === 'function' ? column.value(item) : item[column.value];
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const filtered = terms.length ? items.filter(item => {
        const text = columns.map(column => String(valueFor(item, column) ?? '')).join(' ').toLocaleLowerCase();
        return terms.every(term => text.includes(term));
    }) : items;
    const sorted = [...filtered];
    const selectedColumn = columns[sort.column];
    if (selectedColumn) {
        sorted.sort((a, b) => {
            const left = valueFor(a, selectedColumn);
            const right = valueFor(b, selectedColumn);
            // Keep missing values at the bottom in either direction.
            if (left === null || left === undefined || left === '') return right === null || right === undefined || right === '' ? 0 : 1;
            if (right === null || right === undefined || right === '') return -1;
            const comparison = selectedColumn.numeric
                ? Number(left) - Number(right)
                : collator.compare(String(left), String(right));
            return sort.direction === 'asc' ? comparison : -comparison;
        });
    }
    const totalPages = Math.max(1, Math.ceil(sorted.length / state.pageSize));
    const page = state.resetKey !== resetKey ? 1 : Math.min(state.page, totalPages);

    if (state.resetKey !== resetKey || state.page !== page) {
        setState({ ...state, page, resetKey });
    }

    return {
        items: sorted.slice((page - 1) * state.pageSize, page * state.pageSize),
        query,
        onQueryChange: (next: string) => {
            setQuery(next);
            setState({ ...state, resetKey, page: 1 });
        },
        sortColumn: sort.column,
        sortDirection: sort.direction,
        onSort: (column: number) => {
            setSort({ column, direction: sort.column === column && sort.direction === 'asc' ? 'desc' : 'asc' });
            setState({ ...state, resetKey, page: 1 });
        },
        sourceTotal: items.length,
        page,
        pageSize: state.pageSize,
        total: sorted.length,
        totalPages,
        onPageChange: (next: number) => setState({ ...state, resetKey, page: Math.max(1, Math.min(next, totalPages)) }),
        onPageSizeChange: (pageSize: number) => setState({ page: 1, pageSize, resetKey })
    };
}
