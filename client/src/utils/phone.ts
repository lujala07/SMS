export const normalizeNepalMobile = (value: unknown): string | null => {
    if (typeof value !== 'string') return null;
    const match = value.trim().replace(/[\s-]/g, '').match(/^(?:\+977|977)?(9[678][0-9]{8})$/);
    return match?.[1] ?? null;
};

export const mobileError = 'Enter a 10-digit mobile number.';
