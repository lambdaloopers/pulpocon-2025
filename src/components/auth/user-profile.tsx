'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from './logout-button'
import { ProfileForm } from '../profile/profile-form'
import { ProfileDisplay } from '../profile/profile-display'

interface Profile {
  id?: string
  jobTitle?: string
  interests: string[]
  experience?: string
  company?: string
  techSkills: string[]
}

export function UserProfile() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profiles/me')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (profileData: Profile) => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="pt-6">
          <p className="text-center text-white">Cargando...</p>
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return null
  }

  if (isEditing) {
    return (
      <ProfileForm
        profile={profile || undefined}
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-white mb-2">
            ¡Hola, {session.user?.name?.split(' ')[0] || 'Usuario'}!
          </CardTitle>
          <CardDescription className="text-blue-200 text-lg">
            Bienvenido a TentaCool - Tu espacio personal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {session.user?.image && (
              <div className="flex-shrink-0">
                <img 
                  src={session.user.image} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full border-4 border-cyan-400/30 shadow-lg"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-cyan-300">Nombre completo:</p>
                <p className="text-lg text-white">
                  {session.user?.name || 'No disponible'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-cyan-300">Email:</p>
                <p className="text-lg text-white">
                  {session.user?.email || 'No disponible'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/20">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <LogoutButton />
              </div>
              <div className="flex-1">
                <a 
                  href="/users"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-transparent border border-white/30 text-white rounded-md hover:bg-white/10 hover:border-white/50 transition-colors"
                >
                  Explorar Usuarios
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {profile ? (
        <ProfileDisplay
          profile={profile}
          onEdit={() => setIsEditing(true)}
        />
      ) : (
        <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white mb-2">
              Completa tu Perfil
            </CardTitle>
            <CardDescription className="text-blue-200">
              Agrega información profesional para conectar mejor con otros usuarios
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
            >
              Crear Perfil Profesional
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
