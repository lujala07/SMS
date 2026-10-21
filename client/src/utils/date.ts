export const today = (): string => new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}).format(new Date());
