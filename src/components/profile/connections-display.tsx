'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SmartAvatar } from '@/components/ui/smart-avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Briefcase, MapPin } from 'lucide-react'

interface ConnectionUser {
  id: string
  name: string
  email: string
  image?: string
  profile?: {
    jobTitle?: string
    company?: string
    experience?: string
    techSkills: string[]
    interests: string[]
  }
}

interface Connection {
  id: string
  connectedAt: string
  user: ConnectionUser
  isRequester: boolean
}

export function ConnectionsDisplay() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/connections')
      if (response.ok) {
        const data = await response.json()
        setConnections(data.connections || [])
      }
    } catch (error) {
      console.error('Error fetching connections:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="pt-6">
          <p className="text-center text-white">Cargando conexiones...</p>
        </CardContent>
      </Card>
    )
  }

  if (connections.length === 0) {
    return (
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white mb-2 flex items-center gap-2">
            <Users className="h-6 w-6 text-cyan-400" />
            Mis Conexiones
          </CardTitle>
          <CardDescription className="text-blue-200">
            Aún no tienes conexiones. ¡Explora perfiles y conecta con otros profesionales!
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white mb-2 flex items-center gap-2">
          <Users className="h-6 w-6 text-cyan-400" />
          Mis Conexiones ({connections.length})
        </CardTitle>
        <CardDescription className="text-blue-200">
          Personas con las que te has conectado en TentaCool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <SmartAvatar
                src={connection.user.image}
                name={connection.user.name}
                size={48}
                className="h-12 w-12 ring-2 ring-cyan-400/30"
                fallbackClassName="text-white text-sm font-semibold"
              />
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white truncate">
                      {connection.user.name}
                    </h4>
                    {connection.user.profile?.jobTitle && (
                      <div className="flex items-center gap-1 text-sm text-blue-300">
                        <Briefcase className="h-3 w-3" />
                        {connection.user.profile.jobTitle}
                      </div>
                    )}
                    {connection.user.profile?.company && (
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <MapPin className="h-3 w-3" />
                        {connection.user.profile.company}
                      </div>
                    )}
                    {connection.user.profile?.experience && (
                      <div className="text-sm text-gray-300 mt-1">
                        <p className="line-clamp-2 leading-relaxed">
                          {connection.user.profile.experience}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                    <Calendar className="h-3 w-3" />
                    {new Date(connection.connectedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>

                {connection.user.profile?.techSkills && connection.user.profile.techSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {connection.user.profile.techSkills.slice(0, 3).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-purple-400/20 text-purple-300 border-purple-400/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {connection.user.profile.techSkills.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-400 text-gray-400"
                      >
                        +{connection.user.profile.techSkills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {connection.user.profile?.interests && connection.user.profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {connection.user.profile.interests.slice(0, 2).map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs border-cyan-400/50 text-cyan-300"
                      >
                        {interest}
                      </Badge>
                    ))}
                    {connection.user.profile.interests.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-400 text-gray-400"
                      >
                        +{connection.user.profile.interests.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
