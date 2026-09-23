/**
 * Utility to parse Blob responses containing JSON returned by generated OpenAPI clients.
 * Safely extracts text from the Blob, parses it, and handles empty responses or parse failures.
 *
 * @param body The Blob response body from the HTTP request
 * @param fallback The fallback value to return if parsing fails or body is empty
 */
export async function parseBlobJson<T>(body: Blob | null | undefined, fallback: T): Promise<T> {
  if (!body) return fallback;
  try {
    const text = await body.text();
    return text ? (JSON.parse(text) as T) : fallback;
  } catch (err) {
    console.error('Failed to parse Blob JSON response:', err);
    return fallback;
  }
}
