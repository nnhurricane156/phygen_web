/**
 * Collection of utility functions used throughout the application
 */

/**
 * Format a date string to a localized date format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Invalid date format:', error);
    return dateString;
  }
};

/**
 * Truncate a string to a specified length with ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Convert a string to title case (capitalize first letter of each word)
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Sleep function for adding delays
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Convert object to URL query parameters
 */
export const objectToQueryParams = (obj: Record<string, string | number | boolean>): string => {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(obj[key]))}`)
    .join('&');
};

/**
 * Debounce function for rate-limiting function calls (e.g., search inputs)
 */
export function debounce<F extends (...args: unknown[]) => unknown>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}
