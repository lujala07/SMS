import { useState } from 'react';

export function usePagination<T>(items: readonly T[], resetKey?: unknown) {
    const [state, setState] = useState({ page: 1, pageSize: 10, resetKey });
    const totalPages = Math.max(1, Math.ceil(items.length / state.pageSize));
    const page = state.resetKey !== resetKey ? 1 : Math.min(state.page, totalPages);

    if (state.resetKey !== resetKey || state.page !== page) {
        setState({ ...state, page, resetKey });
    }

    return {
        items: items.slice((page - 1) * state.pageSize, page * state.pageSize),
        page,
        pageSize: state.pageSize,
        total: items.length,
        totalPages,
        onPageChange: (next: number) => setState({ ...state, resetKey, page: Math.max(1, Math.min(next, totalPages)) }),
        onPageSizeChange: (pageSize: number) => setState({ page: 1, pageSize, resetKey })
    };
}
