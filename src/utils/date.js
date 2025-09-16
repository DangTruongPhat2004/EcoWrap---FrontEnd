/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale to use for formatting
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = "en-US") => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale);
};

/**
 * Format a date to include time
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale to use for formatting
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date, locale = "en-US") => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString(locale);
};
