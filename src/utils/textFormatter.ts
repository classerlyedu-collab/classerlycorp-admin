/**
 * Utility functions for text formatting
 */

/**
 * Converts text to sentence case (first letter capitalized, rest lowercase)
 * @param text - The text to convert
 * @returns The text in sentence case
 */
export const toSentenceCase = (text: string): string => {
    if (!text || typeof text !== 'string') {
        return text;
    }

    // Trim whitespace and convert to lowercase
    const trimmed = text.trim().toLowerCase();

    // If empty after trimming, return as is
    if (!trimmed) {
        return text;
    }

    // Capitalize first letter
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

/**
 * Converts text to title case (first letter of each word capitalized)
 * @param text - The text to convert
 * @returns The text in title case
 */
export const toTitleCase = (text: string): string => {
    if (!text || typeof text !== 'string') {
        return text;
    }

    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Preserves original formatting but ensures proper sentence case
 * @param text - The text to format
 * @returns The text with proper sentence case
 */
export const formatLessonTitle = (text: string): string => {
    if (!text || typeof text !== 'string') {
        return text;
    }

    // If the text is already properly formatted (starts with capital letter), return as is
    if (text.charAt(0) === text.charAt(0).toUpperCase() && text.charAt(0) !== text.charAt(0).toLowerCase()) {
        return text;
    }

    // Otherwise, convert to sentence case
    return toSentenceCase(text);
};
