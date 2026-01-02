'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Send, Mic, Phone, PhoneOff, Volume2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { addMessage, getDealMessages, markMessageAsRead, Message, User } from '@/lib/storage';

interface ChatWindowProps {
    dealId: string;
    otherUser: User;
}

export function ChatWindow({ dealId, otherUser }: ChatWindowProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isInCall, setIsInCall] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const callTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 2000); // Poll for new messages
        return () => clearInterval(interval);
    }, [dealId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isInCall) {
            callTimerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
            }
            setCallDuration(0);
        }
        return () => {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
            }
        };
    }, [isInCall]);

    const loadMessages = () => {
        const msgs = getDealMessages(dealId);
        setMessages(msgs);

        // Mark unread messages as read
        msgs.forEach(msg => {
            if (msg.receiverId === user?.id && !msg.read) {
                markMessageAsRead(msg.id);
            }
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const message: Message = {
            id: `msg_${Date.now()}`,
            dealId,
            senderId: user.id,
            receiverId: otherUser.id,
            content: newMessage,
            type: 'text',
            timestamp: new Date().toISOString(),
            read: false,
        };

        addMessage(message);
        setMessages([...messages, message]);
        setNewMessage('');
    };

    const handleVoiceRecord = () => {
        if (!user) return;

        setIsRecording(!isRecording);

        if (!isRecording) {
            // Simulate voice recording
            setTimeout(() => {
                const voiceMessage: Message = {
                    id: `msg_${Date.now()}`,
                    dealId,
                    senderId: user.id,
                    receiverId: otherUser.id,
                    content: 'Voice message',
                    type: 'voice',
                    voiceData: 'simulated_audio_data',
                    timestamp: new Date().toISOString(),
                    read: false,
                };
                addMessage(voiceMessage);
                setMessages([...messages, voiceMessage]);
                setIsRecording(false);
            }, 2000);
        }
    };

    const handleCall = () => {
        setIsInCall(!isInCall);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-[600px]">
            {/* Call Overlay */}
            {isInCall && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-light-blue z-50 flex flex-col items-center justify-center text-white">
                    <Avatar src={otherUser.avatar} name={otherUser.name} size="xl" className="mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">{otherUser.name}</h3>
                    <p className="text-blue-100 mb-8">{formatTime(callDuration)}</p>
                    <div className="flex gap-4">
                        <button className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <Volume2 className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleCall}
                            className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                    <Avatar src={otherUser.avatar} name={otherUser.name} size="md" />
                    <div>
                        <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                        <span className="text-xs text-green-600">● Online</span>
                    </div>
                </div>
                <button
                    onClick={handleCall}
                    className="p-2 rounded-lg bg-brand-blue text-white hover:bg-brand-blue-dark transition-colors"
                >
                    <Phone className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe
                                            ? 'bg-brand-blue text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.type === 'voice' ? (
                                        <div className="flex items-center gap-2">
                                            <Volume2 className="w-4 h-4" />
                                            <div className="flex-1 h-1 bg-current opacity-30 rounded-full" />
                                            <span className="text-xs">0:03</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{msg.content}</p>
                                    )}
                                    <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleVoiceRecord}
                        className={`p-2 rounded-full transition-colors ${isRecording
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isRecording ? 'Recording...' : 'Type a message...'}
                        className="flex-1 rounded-full border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                        disabled={isRecording}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full w-10 h-10 bg-brand-blue hover:bg-brand-blue-dark"
                        disabled={!newMessage.trim() || isRecording}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
