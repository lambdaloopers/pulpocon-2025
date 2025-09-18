import { NextRequest, NextResponse } from 'next/server'
import { convertToModelMessages, streamText, UIMessage, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { experimental_createMCPClient as createMCPClient } from 'ai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const dsn = process.env.DATABASE_URL || '';
    const mcpClient = await createMCPClient({
      transport: new StdioClientTransport({
        command: 'npx',
        args: [
          '-y',
          '@bytebase/dbhub',
          '--dsn',
          dsn
        ],
      }),
    });

    const tools = await mcpClient.tools();

    const result = streamText({
      model: openai('gpt-4.1'),
      system: `
      Eres un agente encargado de responder preguntas sobre la base de datos Postgresql que tienes disponible.

      IMPORTANTE:
      - Siempre mira que tablas tienes disponibles antes de responder.
      - Siempre mira que columnas tiene cada tabla antes de responder.
      - Siempre mira que relaciones tiene cada tabla antes de responder.
      `,
      messages: convertToModelMessages(messages),
      tools: tools,
      stopWhen: stepCountIs(10),
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