export const VISITOR_NAME_MIN_LENGTH = 2;

export function isVisitorNameValid(name: string): boolean {
  return name.trim().length >= VISITOR_NAME_MIN_LENGTH;
}
