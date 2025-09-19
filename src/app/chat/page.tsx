'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect } from 'react';

import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { MessageSquare, Mic, MicOff } from 'lucide-react';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { Button } from '@/components/ui/button';
import { useSpeechToText } from '@/hooks/use-speech-to-text';

export default function Page() {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/agent',
        }),
    });
    const [input, setInput] = useState('');
    
    const {
        transcript,
        isListening,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
        error
    } = useSpeechToText({
        continuous: false,
        interimResults: true,
        language: 'es-ES'
    });

    // Update input when transcript changes
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const handleMicrophoneToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            startListening();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                            Tenta<span className="text-cyan-400">Cool</span> Chat
                        </h1>
                        <p className="text-lg text-blue-200">
                            Conversa con nuestra IA inteligente
                        </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                        <Conversation className="relative w-full" style={{ height: '500px' }}>
                            <ConversationContent className="p-6">
                                {messages.length === 0 ? (
                                    <ConversationEmptyState
                                        icon={<MessageSquare className="size-16 text-cyan-400" />}
                                        title="¡Hola! Soy TentaCool AI"
                                        description="Pregúntame lo que quieras sobre la PulpoCon 2025 o cualquier tema que te interese"
                                        className="[&_h3]:text-white [&_h3]:text-2xl [&_h3]:font-bold [&_p]:text-blue-200 [&_p]:text-lg [&_p]:font-medium"
                                    />
                                ) : (
                                    messages.map(message => (
                                        <Message from={message.role} key={message.id} className="mb-4">
                                            <MessageContent>
                                            {
                                            message.parts.map((part, index) => {
                                                switch (part.type) {
                                                    case 'text':
                                                        return <Response key={index}>{part.text}</Response>
                                                    default:
                                                        return null
                                                }
                                                })
                                            }
                                            </MessageContent>
                                        </Message>
                                    ))
                                )}
                            </ConversationContent>
                            <ConversationScrollButton className="text-cyan-400" />
            </Conversation>

                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                if (input.trim()) {
                                    sendMessage({ text: input });
                                    setInput('');
                                    resetTranscript();
                                }
                            }}
                            className="flex gap-3 items-center p-6 border-t border-white/20 bg-white/5"
                        >
                            <div className="flex-1 relative">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    disabled={status !== 'ready'}
                                    placeholder="Escribe tu mensaje aquí..."
                                    className="w-full px-4 py-3 pr-12 border border-white/30 rounded-xl bg-white/10 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 backdrop-blur-sm"
                                />
                                {isSupported && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleMicrophoneToggle}
                                        disabled={status !== 'ready'}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg ${
                                            isListening 
                                                ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10' 
                                                : 'text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10'
                                        }`}
                                        title={isListening ? 'Detener grabación' : 'Iniciar entrada de voz'}
                                    >
                                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                    </Button>
                                )}
                            </div>
                            <Button 
                                type="submit" 
                                disabled={status !== 'ready' || !input.trim()}
                                className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Enviar
                            </Button>
                        </form>
            
                    {error && (
                        <div className="px-4 py-2 text-sm text-red-400 bg-red-400/10 border-t border-red-400/20">
                            {error}
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}