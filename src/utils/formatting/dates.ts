// Function to format date to a string "Month day, year" format
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale = "en-US"
): string {
  if (!date) return "";
  return date.toLocaleDateString(locale, options);
}
