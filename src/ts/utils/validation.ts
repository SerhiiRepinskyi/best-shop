export const EMAIL_PATTERN =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export function getTrimmedValue(value: string): string {
  return value.trim();
}

export function isRequired(value: string): boolean {
  return getTrimmedValue(value).length > 0;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(getTrimmedValue(value));
}
