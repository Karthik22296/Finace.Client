/**
 * Formats a file size in bytes to human-readable KB or MB string.
 *
 * @param bytes File size in bytes
 * @returns Formatted string e.g. "250 KB" or "2.4 MB"
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  const sizeInKb = Math.round(bytes / 1024);
  if (sizeInKb > 1024) {
    return `${(sizeInKb / 1024).toFixed(1)} MB`;
  }
  return `${sizeInKb} KB`;
}
