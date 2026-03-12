"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

function BotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="18" height="13" rx="3" stroke="#a78bfa" strokeWidth="1.5"/>
      <path d="M8 8V6a4 4 0 018 0v2" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="14" r="1.5" fill="#a78bfa"/>
      <circle cx="15" cy="14" r="1.5" fill="#a78bfa"/>
      <path d="M9 18h6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-accent-glow"
          style={{
            animation: `pulseDot 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const SUGGESTED_PROMPTS = [
  "Tell me a joke 😄",
  "What's the date today?",
  "What can you do?",
  "What's your name?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hi! I'm ChatBot AI 👋 I'm your intelligent conversation partner. Ask me anything or pick a suggestion below!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        text: res.ok ? data.reply : (data.message ?? "Something went wrong. Please try again."),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "Connection error. Please check your network and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "bot",
        text: "Chat cleared! Fresh start — what would you like to talk about?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="mesh-bg min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, #7c5cfc 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Header */}
      <header className="w-full max-w-2xl mb-6 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #3d2d8a, #7c5cfc)",
              boxShadow: "0 0 20px rgba(124,92,252,0.4)",
            }}
          >
            <BotIcon />
          </div>
          <div>
            <h1
              className="text-xl font-bold leading-none"
              style={{ fontFamily: "'Syne', sans-serif", color: "#e2e2f0" }}
            >
              ChatBot AI
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#8888aa" }}>
              Powered by Abhinav
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: "#8888aa" }}>Online</span>
          </div>
          <button
            onClick={clearChat}
            className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/5"
            style={{ color: "#8888aa", border: "1px solid #1e1e2e" }}
          >
            Clear
          </button>
        </div>
      </header>

      {/* Chat window */}
      <main
        className="w-full max-w-2xl flex flex-col rounded-3xl overflow-hidden"
        style={{
          background: "rgba(13,13,20,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid #1e1e2e",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,92,252,0.08)",
          minHeight: "60vh",
          maxHeight: "75vh",
        }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex msg-enter ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${i === messages.length - 1 ? 0 : 0}ms` }}
            >
              {msg.role === "bot" && (
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #3d2d8a, #7c5cfc)" }}
                >
                  <BotIcon />
                </div>
              )}

              <div className="max-w-[78%]">
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg, #7c5cfc, #5b3ee0)",
                          color: "#ffffff",
                          borderBottomRightRadius: "6px",
                          boxShadow: "0 4px 16px rgba(124,92,252,0.25)",
                          fontFamily: "'DM Sans', sans-serif",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          color: "#e2e2f0",
                          border: "1px solid #1e1e2e",
                          borderBottomLeftRadius: "6px",
                          fontFamily: "'DM Sans', sans-serif",
                        }
                  }
                >
                  {msg.text}
                </div>
                <p
                  className={`text-[10px] mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}
                  style={{ color: "#4a4a6a", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start msg-enter">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #3d2d8a, #7c5cfc)" }}
              >
                <BotIcon />
              </div>
              <div
                className="rounded-2xl rounded-bl-md"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid #1e1e2e",
                }}
              >
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts - show only when few messages */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(124,92,252,0.1)",
                  border: "1px solid rgba(124,92,252,0.3)",
                  color: "#a78bfa",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div
          className="p-4 pt-3"
          style={{ borderTop: "1px solid #1e1e2e" }}
        >
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #1e1e2e",
            }}
            onFocus={() => {}}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:opacity-40 leading-relaxed"
              style={{
                color: "#e2e2f0",
                fontFamily: "'DM Sans', sans-serif",
                maxHeight: "120px",
                minHeight: "24px",
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="btn-glow flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: input.trim() && !isLoading
                  ? "linear-gradient(135deg, #7c5cfc, #5b3ee0)"
                  : "#1e1e2e",
                color: "#fff",
                boxShadow: input.trim() && !isLoading
                  ? "0 4px 16px rgba(124,92,252,0.35)"
                  : "none",
              }}
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-center text-[10px] mt-2" style={{ color: "#4a4a6a", fontFamily: "'JetBrains Mono', monospace" }}>
            ChatBot AI · Built on ahmadfaizalbh/Chatbot · Deployed on Vercel
          </p>
        </div>
      </main>
    </div>
  );
}
