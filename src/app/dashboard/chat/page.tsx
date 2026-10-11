'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Send,
  MessageSquare,
  ShieldCheck,
  User,
  CheckCheck,
  Paperclip,
  Clock,
} from 'lucide-react';

function ChatContent() {
  const searchParams = useSearchParams();
  const partnerIdFromQuery = searchParams.get('partnerId');
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(partnerIdFromQuery || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
        if (!selectedPartnerId && data.conversations.length > 0) {
          setSelectedPartnerId(data.conversations[0].partnerId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when partner is selected
  useEffect(() => {
    if (!selectedPartnerId) return;

    const loadConversationMessages = async () => {
      setLoadingMessages(true);
      try {
        // Send a message ping or get conversation
        const found = conversations.find((c) => c.partnerId === selectedPartnerId);
        if (found) {
          setActiveConversationId(found.id);
          const res = await fetch(`/api/chat/messages?conversationId=${found.id}`);
          const data = await res.json();
          if (data.success) {
            setMessages(data.messages);
          }
        } else {
          // If conversation does not exist yet in local state, fetch fresh conversations
          const res = await fetch('/api/chat/conversations');
          const data = await res.json();
          if (data.success) {
            setConversations(data.conversations);
            const fresh = data.conversations.find((c: any) => c.partnerId === selectedPartnerId);
            if (fresh) {
              setActiveConversationId(fresh.id);
              const mRes = await fetch(`/api/chat/messages?conversationId=${fresh.id}`);
              const mData = await mRes.json();
              if (mData.success) setMessages(mData.messages);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadConversationMessages();
  }, [selectedPartnerId, conversations.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedPartnerId) return;

    setSending(true);
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedPartnerId,
          content: messageInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setMessageInput('');
        fetchConversations();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const activePartner = conversations.find((c) => c.partnerId === selectedPartnerId);

  return (
    <div className="bg-white rounded-3xl border border-gold-400/30 shadow-md overflow-hidden h-[680px] flex flex-col md:flex-row">
      {/* Conversations Left Panel */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col">
        <div className="p-4 border-b bg-ivory-200">
          <h2 className="font-bold text-sm text-dark font-bengali">
            {lang === 'bn' ? 'বার্তা ও ইনবক্স' : 'Conversations'}
          </h2>
          <span className="text-[11px] text-dark-muted">১০০% এনক্রিপ্টেড ও নিরাপদ চ্যাট</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-dark-muted">
              এখনো কোনো আলাপ শুরু হয়নি।
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedPartnerId(c.partnerId)}
                className={`w-full p-4 text-left transition-colors flex items-center space-x-3 ${
                  selectedPartnerId === c.partnerId ? 'bg-ivory-300/80 border-l-4 border-maroon-800' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-maroon-100 flex items-center justify-center font-bold text-maroon-800 text-sm flex-shrink-0">
                  {c.partnerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-dark truncate">{c.partnerName}</span>
                    <span className="text-[10px] text-dark-muted">
                      {new Date(c.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-dark-muted truncate block">
                    {c.lastMessage || 'কোনো বার্তা নেই'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Active Conversation Right Panel */}
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        {selectedPartnerId ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-maroon-800 text-ivory flex items-center justify-center font-bold text-xs">
                  {activePartner?.partnerName?.[0] || 'M'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-dark">
                    {activePartner?.partnerName || 'সদস্য'}
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    ভেরিফাইড ও সক্রিয়
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {/* Safety notice in chat */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-[11px] p-2.5 rounded-xl text-center max-w-md mx-auto">
                <span className="font-bold">নিরাপত্তা সতর্কবার্তা:</span> আর্থিক পিন, ওটিপি বা অযাচিত ব্যক্তিগত ছবি শেয়ার করা থেকে বিরত থাকুন।
              </div>

              {loadingMessages ? (
                <div className="p-8 text-center text-xs text-dark-muted">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-xs text-dark-muted">
                  এই সদস্যের সাথে আপনার প্রথম বার্তাটি পাঠান।
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.senderId === user?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                          isMine
                            ? 'bg-maroon-800 text-white rounded-br-none shadow-sm'
                            : 'bg-white text-dark border border-slate-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {m.content}
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] text-dark-muted mt-1 px-1">
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMine && <CheckCheck className="w-3 h-3 text-gold-600" />}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex items-center space-x-2">
              <input
                type="text"
                placeholder={lang === 'bn' ? 'বার্তা লিখুন...' : 'Type a message...'}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-ivory-100 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-maroon-700"
              />
              <button
                type="submit"
                disabled={sending || !messageInput.trim()}
                className="bg-maroon-800 hover:bg-maroon-900 disabled:opacity-40 text-white p-2.5 rounded-2xl transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-dark-muted space-y-2">
            <MessageSquare className="w-12 h-12 text-gold-500" />
            <p className="text-sm font-bold text-dark font-bengali">একটি আলাপ নির্বাচন করুন</p>
            <p className="text-xs max-w-xs">
              বাম পাশের ইনবক্স তালিকা থেকে যেকারো নামের উপর ক্লিক করে সরাসরি চ্যাট শুরু করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
