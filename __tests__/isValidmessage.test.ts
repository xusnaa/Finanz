import { isValidMessages } from '@/lib/validateTest';

describe('isValidMessages', () => {
  it('returns true for valid messages', () => {
    const input = [
      { role: 'user', content: 'What’s my balance?' },
      { role: 'assistant', content: 'Your balance is $1000' },
    ];
    expect(isValidMessages(input)).toBe(true);
  });

  it('rejects if not an array', () => {
    expect(isValidMessages('invalid' as any)).toBe(false);
  });

  it('rejects unknown roles', () => {
    const input = [{ role: 'hacker', content: 'boom' }];
    expect(isValidMessages(input as any)).toBe(false);
  });

  it('rejects overly long messages', () => {
    const input = [
      {
        role: 'user',
        content: 'a'.repeat(600),
      },
    ];
    expect(isValidMessages(input)).toBe(false);
  });

  it('rejects when exceeding max message count', () => {
    const input = Array(20).fill({ role: 'user', content: 'hi' });
    expect(isValidMessages(input)).toBe(false);
  });
});
