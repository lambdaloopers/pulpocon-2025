import { NextRequest, NextResponse } from 'next/server'
import { convertToModelMessages, streamText, UIMessage, stepCountIs, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { experimental_createMCPClient as createMCPClient } from 'ai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import z from 'zod';

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

    // const dsn = process.env.DATABASE_URL || '';
    // const mcpClient = await createMCPClient({
    //   transport: new StdioClientTransport({
    //     command: 'npx',
    //     args: [
    //       '-y',
    //       '@bytebase/dbhub',
    //       '--dsn',
    //       dsn
    //     ],
    //   }),
    // });

    // const tools = await mcpClient.tools();

    const userData = JSON.stringify(user);

    const result = streamText({
      model: openai('gpt-4.1'),
      system: `
      Eres un agente encargado de hacer match entre el usuario que te está hablando y el resto de los usuarios existentes en base a sus perfiles.

      Idealmente deberías de encontrar dos matches para el usuario: uno basado en aspectos técnicos y otro basado en intereses.

      También es importante que con cada match recomiendes un tema de conversación informal y coloquial para romper el hielo.

      Estás hablando con ${userData}, tenlo en cuenta para dirigirte a la persona y para cuando tengas que hacer matches.
      `,
      messages: convertToModelMessages(messages),
      tools: {
        get_profiles: tool({
            name: 'get_profiles',
            description: 'Obtener datos de los usuarios y sus perfiles',
            inputSchema: z.object({}),
            execute: async () => {
              const profiles = await prisma.profile.findMany({
                include: {
                  user: true
                }
              })
              return profiles
            }
        })
      },
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