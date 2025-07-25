// __tests__/chatbotHandler.test.ts

import handler from '@/pages/api/chat';
import { createMocks } from 'node-mocks-http';

describe('/api/chat', () => {
  it('returns 400 on missing userId', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { messages: [{ role: 'user', content: 'Hello' }] },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain('Missing userId');
  });

  it('returns 405 on GET', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});
