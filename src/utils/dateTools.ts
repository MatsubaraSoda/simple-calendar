/**
 * @param year - Year (e.g., 2026).
 * @param month - Month (1 = January, 12 = December).
 * @returns The weekday index as returned by `Date#getDay()` (0 = Sunday, 1 = Monday, …, 6 = Saturday).
 */
export function weekdayOfFirstDay(year: number, month: number): number {
    return new Date(year, month - 1, 1).getDay();
}

/**
 * @param year - Year (e.g., 2026). 
 * @param month - Month (1 = January, 12 = December).
 * @returns The total number of days in the given month (28, 29, 30, or 31).
 */
export function daysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}

/**
 * @returns An object containing the current `year`, `month` (1-based, 1-12), and `day`.
 */
export function getCalendarToday(): {
    year: number;
    month: number;
    day: number
} {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
    };
}