import { NextRequest, NextResponse } from 'next/server'
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai('gpt-4.1'),
      system: 'Eres un agente encargado de defender los beneficios de la PulpoCon 2025, un evento gastrotech increible que se celebra en la ciudad de Vigo alrededor del desarrollo de software.',
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}