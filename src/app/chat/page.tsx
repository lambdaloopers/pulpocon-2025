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
        language: 'en-US'
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
        <>
            <Conversation className="relative w-full" style={{ height: '500px' }}>
                <ConversationContent>
                    {messages.length === 0 ? (
                        <ConversationEmptyState
                            icon={<MessageSquare className="size-12" />}
                            title="No messages yet"
                            description="Start a conversation to see messages here"
                        />
                    ) : (
                        messages.map(message => (
                            <Message from={message.role} key={message.id}>
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
                <ConversationScrollButton />
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
                className="flex gap-2 items-center p-4 border-t bg-background"
            >
                <div className="flex-1 relative">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={status !== 'ready'}
                        placeholder="Say something..."
                        className="w-full px-4 py-2 pr-12 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                    {isSupported && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleMicrophoneToggle}
                            disabled={status !== 'ready'}
                            className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${
                                isListening ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title={isListening ? 'Stop recording' : 'Start voice input'}
                        >
                            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
                <Button type="submit" disabled={status !== 'ready' || !input.trim()}>
                    Send
                </Button>
            </form>
            
            {error && (
                <div className="px-4 py-2 text-sm text-destructive bg-destructive/10 border-t">
                    {error}
                </div>
            )}
        </>
    );
}