import { sanitizeInput } from '@/lib/validateTest';

describe('sanitizeInput', () => {
  it('removes HTML tags', () => {
    const input = '<div>Hello</div>';
    expect(sanitizeInput(input)).toBe('Hello');
  });

  it('removes script-like keywords', () => {
    const input = 'window.alert("hack")';
    expect(sanitizeInput(input)).not.toContain('window');
    expect(sanitizeInput(input)).not.toContain('alert');
  });

  it('removes backticks and special characters', () => {
    const input = '`$<>';
    expect(sanitizeInput(input)).toBe('');
  });

  it('trims whitespace and limits length', () => {
    const input = '    Hello World!     ';
    expect(sanitizeInput(input)).toBe('Hello World!');
  });

  it('limits to 500 characters', () => {
    const longInput = 'a'.repeat(600);
    expect(sanitizeInput(longInput).length).toBeLessThanOrEqual(500);
  });
});
