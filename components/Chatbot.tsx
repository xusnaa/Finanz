'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/context';
import { starterQuestions } from '@/constants/data';
// 👈 your starter questions

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const sanitizeInput = (text: string): string => {
  const maxLength = 500;

  let sanitized = text.trim();

  if (sanitized.length > maxLength) sanitized = sanitized.slice(0, maxLength);

  sanitized = sanitized
    .replace(/<[^>]*>?/gm, '')
    .replace(/(script|function|eval|alert|window|document)/gi, '')
    .replace(/[`$<>]/g, '');

  return sanitized;
};

const containsAbuse = (text: string): boolean => {
  const bannedWords = ['hack', 'kill', 'hate', 'exploit', 'password'];
  return bannedWords.some((word) => text.toLowerCase().includes(word));
};

const Chatbot = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const hasUserAsked = messages.some((m) => m.role === 'user');

  const handleSend = async () => {
    const cleanInput = sanitizeInput(input);
    if (!cleanInput || loading) return;

    if (containsAbuse(cleanInput)) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: '⚠️ Input not allowed due to content policy.' },
      ]);
      setInput('');
      return;
    }

    const userMessage: Message = { role: 'user', content: cleanInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          messages: [
            ...messages.map((m) => ({
              role: m.role === 'bot' ? 'assistant' : 'user',
              content: m.content,
            })),
            { role: 'user', content: cleanInput },
          ],
        }),
      });

      const data = await response.json();

      const reply = data?.reply?.trim();
      const safeReply = sanitizeInput(reply || '');

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: safeReply || '⚠️ No response received from AI.',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: '⚠️ Network error, please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStarterClick = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 0); // Allow input to update before sending
  };

  return (
    <div className="fixed bottom-10 right-0 z-50">
      {!open ? (
        <Button onClick={() => setOpen(true)} className="text-lg px-4 py-2 rounded-full shadow-md">
          💬 Chat with AI
        </Button>
      ) : (
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-lg w-80 h-[500px] max-h-[500px] flex flex-col">
          <div className="flex justify-between items-center p-3 dark:border-slate-700">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent">
              💬 Finanz Assistant
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              ✖
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* Starter Questions */}
            {!hasUserAsked && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {starterQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleStarterClick(q)}
                    className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm w-fit max-w-[75%] break-words ${
                  msg.role === 'user'
                    ? 'bg-purple-500 ml-auto mb-2 p-4 text-white text-right'
                    : 'bg-gray-200 dark:bg-slate-800 text-black dark:text-white'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && <div className="text-gray-500 italic text-sm">AI is typing...</div>}
          </div>

          <div className="flex items-center gap-2 p-3 pb-10 dark:border-slate-700">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
              placeholder="Ask something..."
              className="text-sm"
              disabled={loading}
            />
            <Button
              size="lg"
              onClick={handleSend}
              className="bg-purple-700 rounded-full text-amber-50"
              disabled={loading}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
