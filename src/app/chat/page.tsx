'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { MessageSquare } from 'lucide-react';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';

export default function Page() {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/agent',
        }),
    });
    const [input, setInput] = useState('');

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
                    }
                }}
            >
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={status !== 'ready'}
                    placeholder="Say something..."
                />
                <button type="submit" disabled={status !== 'ready'}>
                    Submit
                </button>
            </form>
        </>
    );
}