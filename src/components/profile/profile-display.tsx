'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Profile {
  id?: string
  jobTitle?: string
  interests: string[]
  experience?: string
  company?: string
  techSkills: string[]
}

interface ProfileDisplayProps {
  profile: Profile
  onEdit: () => void
}

export function ProfileDisplay({ profile, onEdit }: ProfileDisplayProps) {
  return (
    <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl text-white mb-2">
              Perfil Profesional
            </CardTitle>
            <CardDescription className="text-blue-200 text-lg">
              Tu información en TentaCool
            </CardDescription>
          </div>
          <Button
            onClick={onEdit}
            className="bg-cyan-400 hover:bg-cyan-500 text-white"
          >
            Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-cyan-300">Título del Trabajo</p>
            <p className="text-lg text-white">
              {profile.jobTitle || 'No especificado'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-cyan-300">Empresa</p>
            <p className="text-lg text-white">
              {profile.company || 'No especificada'}
            </p>
          </div>
        </div>

        {profile.experience && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-cyan-300">Experiencia</p>
            <p className="text-white leading-relaxed">
              {profile.experience}
            </p>
          </div>
        )}

        {profile.techSkills.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-cyan-300">Habilidades Técnicas</p>
            <div className="flex flex-wrap gap-2">
              {profile.techSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-400/20 text-purple-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.interests.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-cyan-300">Intereses no profesionales</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
