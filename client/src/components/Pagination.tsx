interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    label?: string;
}

export default function Pagination({ page, pageSize, total, totalPages, onPageChange, onPageSizeChange, label = 'Records' }: PaginationProps) {
    if (!total) return null;

    const buttonClass = 'rounded border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40';

    return (
        <nav aria-label={`${label} pagination`} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm text-gray-600">
            <p aria-live="polite">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</p>
            <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2">
                    Per page
                    <select className="rounded border border-gray-300 bg-white p-2" value={pageSize} onChange={event => onPageSizeChange(Number(event.target.value))}>
                        {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                </label>
                <button type="button" className={buttonClass} disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button type="button" className={buttonClass} disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
            </div>
        </nav>
    );
}
