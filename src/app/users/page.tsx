'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoginButton } from "@/components/auth/login-button"
import { Marquee } from "@/components/ui/marquee"
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  image?: string
  createdAt: string
  profile?: {
    jobTitle?: string
    company?: string
    interests: string[]
    techSkills: string[]
  }
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('Error al cargar los usuarios')
        }
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchUsers()
    }
  }, [session])

  // Ordenar usuarios por fecha de creación (más recientes primero)
  const sortedUsers = users.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <main className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-white mb-4">
                  Acceso Requerido
                </CardTitle>
                <CardDescription className="text-blue-200 text-lg">
                  Necesitas iniciar sesión para ver la lista de usuarios
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <LoginButton />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-white text-xl">Cargando usuarios...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">Error: {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">PulpoCon</span> 2025
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 mb-4">
                🐙 Crea tu perfil y empieza a hacer match
              </p>
              <p className="text-lg text-blue-300">
                Conoce a otros profesionales tech en el evento más genial del año
              </p>
            </div>
            <Link 
              href="/"
              className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <span className="flex items-center space-x-2">
                <span>←</span>
                <span>Volver al inicio</span>
              </span>
            </Link>
          </div>
        </div>


        <div className="space-y-8">
          {/* Primera fila - Desliza hacia la derecha */}
          <Marquee pauseOnHover className="[--duration:20s]">
            {sortedUsers.map((user) => {
              const hasProfile = user.profile && (
                user.profile.jobTitle || 
                user.profile.company || 
                (user.profile.techSkills && user.profile.techSkills.length > 0) ||
                (user.profile.interests && user.profile.interests.length > 0)
              )

              return (
                <Card key={user.id} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-white/20 hover:from-white/15 hover:to-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 w-80 mx-4">
                  <CardHeader className="pb-4 text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="h-16 w-16 ring-2 ring-cyan-400/30 group-hover:ring-cyan-400/60 transition-all duration-300 mx-auto">
                        <AvatarImage src={user.image || ''} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white font-bold text-lg">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {hasProfile && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-white text-lg font-bold mb-2 group-hover:text-cyan-300 transition-colors truncate">
                      {user.name}
                    </CardTitle>
                    
                    {hasProfile ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-2 py-1 text-xs">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                        Listo para conectar
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-500/30 text-orange-300 bg-orange-500/10 px-2 py-1 text-xs">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-1"></span>
                        Completa tu perfil
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {hasProfile ? (
                      <>
                        {user.profile?.company && (
                          <div className="text-center">
                            <p className="text-xs text-cyan-400 font-medium mb-1">🏢 Empresa</p>
                            <p className="text-white font-semibold text-sm truncate">{user.profile.company}</p>
                          </div>
                        )}
                        
                        {user.profile?.techSkills && user.profile.techSkills.length > 0 && (
                          <div>
                            <p className="text-xs text-cyan-400 font-medium mb-2 text-center">⚡ Skills</p>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {user.profile.techSkills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30 text-xs px-2 py-0.5">
                                  {skill}
                                </Badge>
                              ))}
                              {user.profile.techSkills.length > 3 && (
                                <Badge className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/30 text-xs px-2 py-0.5">
                                  +{user.profile.techSkills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {user.profile?.interests && user.profile.interests.length > 0 && (
                          <div>
                            <p className="text-xs text-cyan-400 font-medium mb-2 text-center">🎯 Intereses</p>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {user.profile.interests.slice(0, 2).map((interest, index) => (
                                <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 text-xs px-2 py-0.5">
                                  {interest}
                                </Badge>
                              ))}
                              {user.profile.interests.length > 2 && (
                                <Badge variant="outline" className="border-gray-500/30 text-gray-300 bg-gray-500/10 text-xs px-2 py-0.5">
                                  +{user.profile.interests.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
                        <p className="text-orange-300 font-medium mb-1 text-sm">🚀 ¡Completa tu perfil!</p>
                        <p className="text-orange-200 text-xs">
                          Añade tu empresa, skills e intereses para hacer match
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </Marquee>

          {/* Segunda fila - Desliza hacia la izquierda */}
          <Marquee pauseOnHover reverse className="[--duration:25s]">
            {sortedUsers.map((user) => {
              const hasProfile = user.profile && (
                user.profile.jobTitle || 
                user.profile.company || 
                (user.profile.techSkills && user.profile.techSkills.length > 0) ||
                (user.profile.interests && user.profile.interests.length > 0)
              )

              return (
                <Card key={`reverse-${user.id}`} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-white/20 hover:from-white/15 hover:to-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 w-80 mx-4">
                  <CardHeader className="pb-4 text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="h-16 w-16 ring-2 ring-purple-400/30 group-hover:ring-purple-400/60 transition-all duration-300 mx-auto">
                        <AvatarImage src={user.image || ''} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {hasProfile && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-white text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors truncate">
                      {user.name}
                    </CardTitle>
                    
                    {hasProfile ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-2 py-1 text-xs">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                        Listo para conectar
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-500/30 text-orange-300 bg-orange-500/10 px-2 py-1 text-xs">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-1"></span>
                        Completa tu perfil
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {hasProfile ? (
                      <>
                        {user.profile?.company && (
                          <div className="text-center">
                            <p className="text-xs text-purple-400 font-medium mb-1">🏢 Empresa</p>
                            <p className="text-white font-semibold text-sm truncate">{user.profile.company}</p>
                          </div>
                        )}
                        
                        {user.profile?.techSkills && user.profile.techSkills.length > 0 && (
                          <div>
                            <p className="text-xs text-purple-400 font-medium mb-2 text-center">⚡ Skills</p>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {user.profile.techSkills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-xs px-2 py-0.5">
                                  {skill}
                                </Badge>
                              ))}
                              {user.profile.techSkills.length > 3 && (
                                <Badge className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/30 text-xs px-2 py-0.5">
                                  +{user.profile.techSkills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {user.profile?.interests && user.profile.interests.length > 0 && (
                          <div>
                            <p className="text-xs text-purple-400 font-medium mb-2 text-center">🎯 Intereses</p>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {user.profile.interests.slice(0, 2).map((interest, index) => (
                                <Badge key={index} variant="outline" className="border-pink-500/30 text-pink-300 bg-pink-500/10 text-xs px-2 py-0.5">
                                  {interest}
                                </Badge>
                              ))}
                              {user.profile.interests.length > 2 && (
                                <Badge variant="outline" className="border-gray-500/30 text-gray-300 bg-gray-500/10 text-xs px-2 py-0.5">
                                  +{user.profile.interests.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
                        <p className="text-orange-300 font-medium mb-1 text-sm">🚀 ¡Completa tu perfil!</p>
                        <p className="text-orange-200 text-xs">
                          Añade tu empresa, skills e intereses para hacer match
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </Marquee>
        </div>


        {users.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🐙</div>
              <h3 className="text-3xl font-bold text-white mb-4">¡Sé el primero en unirte!</h3>
              <p className="text-xl text-blue-200 mb-8">
                La comunidad PulpoCon está esperando a profesionales como tú. 
                ¡Regístrate y forma parte de esta increíble experiencia!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  🚀 Comenzar ahora
                </Link>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  🔄 Actualizar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
