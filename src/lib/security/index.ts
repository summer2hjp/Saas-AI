export function getCsrfToken(): string {
  // Better Auth handles CSRF via double-submit cookie
  // This is a server-side helper for programmatic checks
  return "";
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function validatePagination(
  page: number,
  limit: number,
): { page: number; limit: number; offset: number } {
  const p = Math.max(1, Math.floor(page));
  const l = Math.min(100, Math.max(1, Math.floor(limit)));
  return { page: p, limit: l, offset: (p - 1) * l };
}