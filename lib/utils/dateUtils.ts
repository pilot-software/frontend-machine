/**
 * Safe date parsing utilities to prevent RangeError: Invalid time value
 */

export function safeParseDate(dateInput: string | Date | null | undefined): Date | null {
    if (!dateInput) return null;

    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return null;
        return date;
    } catch {
        return null;
    }
}

export function safeDateToString(dateInput: string | Date | null | undefined, fallback = 'Not available'): string {
    const date = safeParseDate(dateInput);
    return date ? date.toISOString().split('T')[0] : fallback;
}

export function safeDateToLocalString(dateInput: string | Date | null | undefined, fallback = 'Not available'): string {
    const date = safeParseDate(dateInput);
    return date ? date.toLocaleDateString() : fallback;
}

export function calculateAge(birthDate: string | Date | null | undefined): number {
    const date = safeParseDate(birthDate);
    if (!date) return 0;

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        return age - 1;
    }

    return age;
}
