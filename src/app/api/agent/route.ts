import { NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function GET() {
  try {
    const result = streamText({
      model: openai('gpt-4.1'),
      prompt: 'Explica lo fabulosa que es la PulpoCon 2025, un evento gastrotech increible que se celebra en la ciudad de Vigo alrededor del desarrollo de software.',
    });

    // example: use textStream as an async iterable
    for await (const textPart of result.textStream) {
      // console.log(textPart);
    }

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}