import zxcvbn from 'zxcvbn';

export const PASSWORD_MINIMUM_SCORE = 3;
export const VALIDATION_PATTERNS = {
  EMAIL: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
};

export const checkEmail = (email: string): boolean => new RegExp(VALIDATION_PATTERNS.EMAIL).test(email);

export function checkPasswordStrength(password: string): boolean {
  return PASSWORD_MINIMUM_SCORE <= getPasswordStrength(password);
}

export function getPasswordStrength(password: string): number {
  return zxcvbn(password).score;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidDate(d: any): boolean {
  if (Object.prototype.toString.call(d) === '[object Date]') {
    // it is a date
    if (Number.isNaN(d.getTime())) { // d.valueOf() could also work
      return false;
    }
    return true;
  }
  return false;
}
