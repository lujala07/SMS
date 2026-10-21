export const today = (): string => new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}).format(new Date());

export const validateDate = (
    value: unknown,
    label: string,
    range: 'past' | 'future' | 'today',
    optional = false
): string | undefined => {
    if (optional && (value === undefined || value === null || value === '')) return;
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) {
        return `${label} must be a valid date in YYYY-MM-DD format`;
    }
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
        return `${label} must be a valid calendar date`;
    }
    const currentDate = today();
    if (range === 'past' && value > currentDate) return `${label} cannot be in the future`;
    if (range === 'future' && value < currentDate) return `${label} cannot be in the past`;
    if (range === 'today' && value !== currentDate) return `${label} must be today`;
};
