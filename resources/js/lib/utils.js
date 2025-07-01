import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param {...any} inputs - Class names to combine
 * @returns {string} Combined and optimized class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a human-readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - The format string (default: 'en-US' format)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'en-US') => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  return d.toLocaleDateString(format, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'KES')
 * @param {string} locale - The locale (default: 'en-KE')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'KES', locale = 'en-KE') => {
  if (amount === null || amount === undefined) return 'N/A';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get initials from a full name
 * @param {string} name - The full name
 * @returns {string} The initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} ellipsis - The ellipsis string (default: '...')
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50, ellipsis = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + ellipsis;
};

/**
 * Generate a unique ID
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} A unique ID string
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} The debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format a phone number to a consistent format
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Check if the number starts with a country code
  if (cleaned.length > 9) {
    // If it's a Kenyan number without country code, add +254
    if (cleaned.startsWith('0')) {
      return `+254${cleaned.substring(1)}`;
    }
    // If it's a Kenyan number with 254, add +
    if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    }
    // If it's already in international format
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
  }
  
  // Default: assume it's a local number and add +254
  return `+254${cleaned}`;
};

/**
 * Check if a string is a valid email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Get the status variant for a status string
 * @param {string} status - The status string
 * @returns {Object} An object with variant and icon
 */
export const getStatusVariant = (status) => {
  const statusMap = {
    active: { variant: 'success', icon: 'check-circle' },
    inactive: { variant: 'destructive', icon: 'x-circle' },
    pending: { variant: 'warning', icon: 'clock' },
    paid: { variant: 'success', icon: 'check-circle' },
    unpaid: { variant: 'destructive', icon: 'alert-circle' },
    overdue: { variant: 'destructive', icon: 'alert-triangle' },
    draft: { variant: 'outline', icon: 'file-text' },
    sent: { variant: 'info', icon: 'send' },
    completed: { variant: 'success', icon: 'check-circle' },
    failed: { variant: 'destructive', icon: 'x-circle' },
    default: { variant: 'outline', icon: 'help-circle' },
  };
  
  return statusMap[status?.toLowerCase()] || statusMap.default;
};

/**
 * Convert a string to title case
 * @param {string} str - The string to convert
 * @returns {string} The title-cased string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export default {
  cn,
  formatDate,
  formatCurrency,
  getInitials,
  truncateText,
  generateId,
  debounce,
  formatPhoneNumber,
  isValidEmail,
  getStatusVariant,
  toTitleCase,
};
