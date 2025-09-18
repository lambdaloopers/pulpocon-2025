'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from './logout-button'

export function UserProfile() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center">Cargando...</p>
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return null
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
        <CardDescription>
          Bienvenido a Pulpocon 2025
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Nombre:</p>
          <p className="text-sm text-muted-foreground">
            {session.user?.name || 'No disponible'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Email:</p>
          <p className="text-sm text-muted-foreground">
            {session.user?.email || 'No disponible'}
          </p>
        </div>
        {session.user?.image && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Imagen:</p>
            <img 
              src={session.user.image} 
              alt="Avatar" 
              className="w-16 h-16 rounded-full"
            />
          </div>
        )}
        <div className="pt-4">
          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  )
}
