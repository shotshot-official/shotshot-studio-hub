// components/StudioChatWidget.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MessageSquare, X, Send, Sparkles, ChevronDown, Lock } from 'lucide-react';
import { ChatMessage } from '@/types/notion';
import { AuthSession } from '@/lib/auth';
import { fetchChatMessagesAction, sendChatMessageAction } from '@/app/actions/chat';

interface StudioChatWidgetProps {
  session: AuthSession | null;
  onOpenAuth?: () => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

export default function StudioChatWidget({ session, onOpenAuth }: StudioChatWidgetProps) {
  const triggerOpenAuth = onOpenAuth || (() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-auth-drawer'));
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll messages every 4 seconds
  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      try {
        const msgs = await fetchChatMessagesAction();
        if (isMounted) {
          setMessages(msgs);
        }
      } catch {
        // Silently handle fetch hiccups during poll
      }
    }

    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    if (!session) {
      triggerOpenAuth();
      return;
    }

    const text = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    const res = await sendChatMessageAction(text);
    setIsSending(false);

    if (res.success && res.message) {
      setMessages((prev) => [...prev, res.message!]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="swiss-border bg-neutral-900/95 backdrop-blur-xl rounded-2xl w-[92vw] sm:w-[380px] h-[480px] mb-3 flex flex-col justify-between shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800/80 bg-neutral-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>SHOTSHOT Feed</span>
                  <span className="text-[10px] font-mono text-neutral-400 font-normal px-1.5 py-0.5 rounded bg-neutral-800/80">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-neutral-400">
                  Real-time asynchronous channel
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="swiss-focus text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close feed"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <MessageSquare className="w-8 h-8 mb-2 stroke-1 opacity-50" />
                <p className="text-xs font-mono">No messages yet.</p>
                <p className="text-[11px] text-neutral-400 mt-1">Be the first to leave a team note.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine =
                  Boolean(session) &&
                  (session?.memberId === msg.senderId ||
                   (Boolean(session?.name) && session?.name.trim().toLowerCase() === msg.senderName.trim().toLowerCase()));
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isMine ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="relative w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-300">
                      {msg.senderAvatar ? (
                        <Image
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      ) : (
                        msg.senderName.slice(0, 1)
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div className={`max-w-[78%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-medium text-white">{msg.senderName}</span>
                        <span className="text-[9px] font-mono text-neutral-400">{msg.senderRole}</span>
                        <span className="text-[9px] font-mono text-neutral-400">&bull; {formatRelativeTime(msg.createdAt)}</span>
                      </div>

                      <div
                        className={`text-xs p-3 rounded-xl leading-relaxed whitespace-pre-wrap break-words ${
                          isMine
                            ? 'bg-white text-black font-medium rounded-tr-none'
                            : 'bg-neutral-800/80 text-neutral-200 border border-neutral-700/50 rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/70">
            {session ? (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Share a team note or status..."
                  maxLength={500}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 swiss-focus"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSending}
                  className="p-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white rounded-xl transition-all swiss-focus"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-mono">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Sign in to post in feed</span>
                </div>
                <button
                  type="button"
                  onClick={triggerOpenAuth}
                  className="text-xs font-mono font-medium text-white hover:text-amber-300 underline underline-offset-2 transition-colors px-2 py-0.5"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="swiss-focus inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-900 border border-neutral-700/80 hover:border-neutral-500 text-white font-mono text-xs shadow-2xl hover:bg-neutral-800 transition-all group"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-neutral-900" />
        </div>
        <span className="font-medium tracking-tight">SHOTSHOT Feed</span>
        <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
          {messages.length}
        </span>
      </button>
    </div>
  );
}
