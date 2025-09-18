import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || '',
                image: user.image || null,
              }
            })
          } else {
            // Update image if it has changed
            if (existingUser.image !== user.image) {
              await prisma.user.update({
                where: { email: user.email },
                data: { image: user.image || null }
              })
            }
          }
        } catch (error) {
          console.error('Error creating user:', error)
          return false
        }
      }
      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        })
        if (user) {
          session.user.id = user.id
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}
