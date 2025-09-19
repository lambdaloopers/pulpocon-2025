import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's connections
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch connections where the user is either requester or target
    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: user.id },
          { targetId: user.id }
        ]
      },
      include: {
        requester: {
          include: {
            profile: true
          }
        },
        target: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the connections to show the "other" user
    const formattedConnections = connections.map(connection => {
      const isRequester = connection.requesterId === user.id
      const otherUser = isRequester ? connection.target : connection.requester
      
      return {
        id: connection.id,
        connectedAt: connection.createdAt,
        user: {
          id: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          image: otherUser.image,
          profile: otherUser.profile
        },
        isRequester
      }
    })

    return NextResponse.json({ connections: formattedConnections })
  } catch (error) {
    console.error('Error fetching connections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new connection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { targetUserId } = await request.json()

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 })
    }

    const requester = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!requester) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (requester.id === targetUserId) {
      return NextResponse.json({ error: 'Cannot connect to yourself' }, { status: 400 })
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    // Check if connection already exists (in either direction)
    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: requester.id, targetId: targetUserId },
          { requesterId: targetUserId, targetId: requester.id }
        ]
      }
    })

    if (existingConnection) {
      return NextResponse.json({ error: 'Connection already exists' }, { status: 409 })
    }

    // Create new connection
    const connection = await prisma.connection.create({
      data: {
        requesterId: requester.id,
        targetId: targetUserId
      },
      include: {
        requester: {
          include: {
            profile: true
          }
        },
        target: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json({ 
      connection,
      message: 'Connection created successfully' 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating connection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
