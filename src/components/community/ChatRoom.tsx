"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Send, Settings, LogOut, Users, X,
  ChevronDown, Circle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import ReactMarkdown from 'react-markdown';

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'member';
  status: 'online' | 'offline' | 'away';
  statusMessage?: string;
}

interface Message {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  edited?: boolean;
  reactions?: { emoji: string; users: string[] }[];
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setShowScrollButton(target.scrollTop < target.scrollHeight - target.clientHeight);
    };

    const messagesDiv = document.querySelector('.messages-container');
    messagesDiv?.addEventListener('scroll', handleScroll);
    return () => messagesDiv?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      user: {
        id: '1',
        name: 'You',
        role: 'member',
        status: 'online'
      },
      content: newMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    scrollToBottom();
  };

  const handleEdit = (messageId: string, newContent: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: newContent, edited: true }
          : msg
      )
    );
    setEditingMessage(null);
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Remove unused function

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      const date = format(message.timestamp, 'yyyy-MM-dd');
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-lg border relative">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Petani Padi Modern</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Circle className="w-3 h-3 fill-green-500" />
            <span>12 online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-md hover:bg-accent"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-0 w-72 h-full bg-card border-l z-10"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Settings</h3>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-md hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="p-4 space-y-4">
              <button className="w-full p-2 rounded-md hover:bg-accent flex items-center gap-2">
                <Users className="w-5 h-5" />
                Members
              </button>
              <button className="w-full p-2 rounded-md text-destructive hover:bg-destructive/10 flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Leave Community
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <motion.div 
        className="messages-container flex-1 overflow-y-auto p-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {Object.entries(groupMessagesByDate()).map(([date, msgs]) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                {format(new Date(date), 'MMMM d, yyyy')}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            {msgs.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  message.user.id === '1' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.user.avatar} />
                  <AvatarFallback>
                    {message.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className={cn(
                  "flex flex-col max-w-[70%]",
                  message.user.id === '1' ? "items-end" : "items-start"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </span>
                  </div>

                  <div className={cn(
                    "rounded-lg p-3 relative group",
                    message.user.id === '1' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    {message.user.id === '1' && (
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="absolute -right-6 top-0 p-1 opacity-0 group-hover:opacity-100 text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {editingMessage === message.id ? (
                      <input
                        type="text"
                        defaultValue={message.content}
                        onBlur={(e) => handleEdit(message.id, e.target.value)}
                        className="bg-transparent border-none outline-none w-full"
                        autoFocus
                      />
                    ) : (
                      <ReactMarkdown className="text-sm break-words">
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>

                  {message.reactions && (
                    <div className="flex gap-1 mt-1">
                      {message.reactions.map((reaction, i) => (
                        <button
                          key={i}
                          className="text-xs bg-muted rounded-full px-2 py-1"
                        >
                          {reaction.emoji} {reaction.users.length}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 right-4 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 rounded-md bg-background border"
            placeholder="Type a message..."
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="p-2 rounded-md bg-primary text-primary-foreground"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}