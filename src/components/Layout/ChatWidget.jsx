import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, SendHorizontal, Bot } from 'lucide-react';

const QUICK_REPLIES = ['Order status', 'Shipping info', 'Return policy'];

const INITIAL_MESSAGES = [
  { id: 1, role: 'bot', text: 'Hi! How can we help you today?' },
];

/**
 * Replace this with your real backend / AI call.
 * It receives the customer's message and must return the bot's reply (string).
 */
async function getBotReply(message) {
  // Example:
  // const res = await fetch('/api/chat', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message }),
  // });
  // const data = await res.json();
  // return data.reply;

  await new Promise((resolve) => setTimeout(resolve, 900));
  return 'Thanks for your message! Our team will get back to you shortly.';
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const nextId = useRef(2);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping, isOpen]);

  // Focus the input when the chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { id: nextId.current++, role, text }]);
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    addMessage('user', trimmed);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await getBotReply(trimmed);
      addMessage('bot', reply);
    } catch {
      addMessage('bot', "Sorry, something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Chat window */}
      <div
        role="dialog"
        aria-label="Customer support chat"
        aria-hidden={!isOpen}
        className={`flex h-[32rem] max-h-[calc(100dvh-11rem)] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition duration-200 motion-reduce:transition-none sm:w-96 ${
          isOpen
            ? 'pointer-events-auto visible translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none invisible translate-y-2 scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">Support</p>
            <p className="text-xs opacity-80">We usually reply in seconds</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="rounded-md p-1.5 transition-colors hover:bg-primary-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Messages */}
        <div
          role="log"
          aria-live="polite"
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <p
                className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'rounded-br-sm bg-primary text-primary-foreground'
                    : 'rounded-bl-sm bg-muted text-foreground'
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}

          {/* Quick replies, shown only before the customer has written anything */}
          {messages.length === 1 && !isTyping && (
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK_REPLIES.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => sendMessage(label)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start" aria-label="Support is typing">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-border px-3 py-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            aria-label="Message"
            className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;