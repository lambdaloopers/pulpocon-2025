import { NextRequest, NextResponse } from 'next/server'
import { convertToModelMessages, streamText, UIMessage, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { experimental_createMCPClient as createMCPClient } from 'ai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

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

    const userData = JSON.stringify(user);

    const result = streamText({
      model: openai('gpt-4.1'),
      system: `
      Eres un agente encargado de responder preguntas sobre la base de datos Postgresql que tienes disponible.

      IMPORTANTE:
      - Siempre mira que tablas tienes disponibles antes de responder.
      - Siempre mira que columnas tiene cada tabla antes de responder.
      - Siempre mira que relaciones tiene cada tabla antes de responder.

      Estás hablando con ${userData}, tenlo en cuenta para dirigirte a la persona y para cuando tengas que hacer matches.
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