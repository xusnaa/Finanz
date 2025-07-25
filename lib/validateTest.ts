type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const MAX_MESSAGES = 10;
const MAX_LENGTH = 500;

export function sanitizeInput(text: string): string {
  return text
    .trim()
    .replace(/<[^>]*>?/gm, '') // remove HTML tags
    .replace(/(script|function|eval|alert|window|document|on\w+)/gi, '') // block JS keywords
    .replace(/[<>{}`$]/g, '') // strip special characters often used in injection
    .replace(/["']/g, '') // remove quotes
    .slice(0, 500); // limit length to prevent abuse
}

export function isValidMessages(messages: unknown): messages is Message[] {
  if (!Array.isArray(messages)) return false;

  if (messages.length > MAX_MESSAGES) return false;

  return messages.every((msg) => {
    return (
      typeof msg === 'object' &&
      msg !== null &&
      (msg as Message).role &&
      ((msg as Message).role === 'user' || (msg as Message).role === 'assistant') &&
      typeof (msg as Message).content === 'string' &&
      (msg as Message).content.length <= MAX_LENGTH
    );
  });
}
