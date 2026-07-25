export function validateRequiredFields(body: any, fields: string[]): string | null {
  if (!body) return `Request body is missing`;
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return `Field '${field}' is required`;
    }
  }
  return null;
}
