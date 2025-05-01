/**
 * Formats a Date object into a YYYY-MM-DD string using UTC values (This is because the NASA API uses UTC to determine the date of the photo)
 * @param date - The Date object to format
 * @returns The formatted date string.
 */
export const formatUTCDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  // Months are 0-indexed in JavaScript, add 1 for correct month number
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
