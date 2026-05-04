"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Send, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusherClient";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesClient({ 
  conversations: initialConversations, 
  currentUserId,
  initialActiveChat
}: { 
  conversations: Conversation[], 
  currentUserId: string,
  initialActiveChat?: string 
}) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeChat, setActiveChat] = useState<string | null>(() => {
    if (initialActiveChat) return initialActiveChat;
    return initialConversations.length > 0 ? initialConversations[0].id : null;
  });
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when activeChat changes
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages?userId=${activeChat}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          
          // Mark as read in local conversation state
          setConversations(prev => prev.map(c => c.id === activeChat ? { ...c, unread: 0 } : c));
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  // Listen for real-time messages via Pusher
  useEffect(() => {
    if (!pusherClient) return;
    const channel = pusherClient.subscribe(`private-user-${currentUserId}`);

    channel.bind("new-message", (newMessage: Message) => {
      // If the message belongs to the active chat, append it
      if (activeChat && (newMessage.senderId === activeChat || newMessage.receiverId === activeChat)) {
        setMessages(prev => [...prev, newMessage]);
      }

      // Update conversation list
      setConversations(prev => {
        const otherUserId = newMessage.senderId === currentUserId ? newMessage.receiverId : newMessage.senderId;
        const existingChat = prev.find(c => c.id === otherUserId);
        
        if (existingChat) {
          return prev.map(c => c.id === otherUserId ? {
            ...c,
            lastMessage: newMessage.content,
            timestamp: newMessage.createdAt,
            unread: c.id === activeChat ? 0 : c.unread + (newMessage.senderId !== currentUserId ? 1 : 0)
          } : c).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        } else {
          return prev;
        }
      });
    });

    return () => {
      if (pusherClient) {
        pusherClient.unsubscribe(`private-user-${currentUserId}`);
      }
    };
  }, [currentUserId, activeChat]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    const content = messageText;
    setMessageText("");

    // Optimistic UI update
    const tempId = Date.now().toString();
    const tempMessage: Message = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: activeChat,
      content,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMessage]);
    
    // Update conversation list optimistically
    setConversations(prev => prev.map(c => c.id === activeChat ? {
      ...c,
      lastMessage: content,
      timestamp: tempMessage.createdAt
    } : c).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: activeChat, content })
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      
      const realMessage = await res.json();
      setMessages(prev => prev.map(m => m._id === tempId ? realMessage : m));
    } catch (error) {
      console.error("Error sending message", error);
      // Remove temp message on failure
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  return (
    <div className="w-full h-[80vh] flex flex-col">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">Messages</h1>
        <p className="text-foreground/70">Chat with other plant enthusiasts to arrange your swaps.</p>
      </div>

      <Card className="flex-1 overflow-hidden grid md:grid-cols-[300px_1fr] bg-cream p-0 border-surface-dim">
        {/* Sidebar Contacts */}
        <div className="border-r border-surface-dim bg-white flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-surface-dim">
            <Input 
              placeholder="Search conversations..." 
              icon={<Search className="w-4 h-4 text-foreground/50" />}
              className="h-10 text-sm"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-foreground/50">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet.</p>
              </div>
            ) : (
              conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full text-left p-4 border-b border-surface-dim hover:bg-surface transition-colors flex items-center gap-3 ${activeChat === chat.id ? 'bg-surface' : ''}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                      {chat.avatar ? <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" /> : chat.name.charAt(0)}
                    </div>
                    {chat.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                      <span className="text-[10px] text-foreground/50 whitespace-nowrap ml-2">
                        {new Date(chat.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${chat.unread > 0 ? 'font-semibold text-foreground' : 'text-foreground/60'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex flex-col h-full bg-cream overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-surface-dim flex items-center shadow-sm z-10">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3 flex-shrink-0">
                {conversations.find(c => c.id === activeChat)?.name.charAt(0)}
              </div>
              <h3 className="font-heading font-bold text-lg truncate">{conversations.find(c => c.id === activeChat)?.name}</h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full text-foreground/50">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-foreground/50">
                  <p>Send a message to start chatting!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isSender = msg.senderId === currentUserId;
                  return (
                    <motion.div 
                      key={msg._id || idx} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm text-sm ${isSender ? 'bg-primary text-cream rounded-tr-sm' : 'bg-white border border-surface-dim rounded-tl-sm'}`}>
                        {msg.content}
                        <div className={`text-[10px] mt-1 text-right ${isSender ? 'text-cream/70' : 'text-foreground/50'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-surface-dim">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1 bg-surface border-transparent"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button type="submit" variant="primary" className="px-6 rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center text-foreground/50 h-full bg-cream">
            <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </Card>
    </div>
  );
}
