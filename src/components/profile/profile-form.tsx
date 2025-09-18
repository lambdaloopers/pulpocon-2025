'use client'

import { useState, useEffect } from 'react'
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

interface ProfileFormProps {
  profile?: Profile
  onSave: (profile: Profile) => void
  onCancel: () => void
}

export function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState<Profile>({
    jobTitle: '',
    interests: [],
    experience: '',
    company: '',
    techSkills: []
  })

  const [newInterest, setNewInterest] = useState('')
  const [newTechSkill, setNewTechSkill] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        jobTitle: profile.jobTitle || '',
        interests: profile.interests || [],
        experience: profile.experience || '',
        company: profile.company || '',
        techSkills: profile.techSkills || []
      })
    }
  }, [profile])

  const handleInputChange = (field: keyof Profile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const addTechSkill = () => {
    if (newTechSkill.trim() && !formData.techSkills.includes(newTechSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        techSkills: [...prev.techSkills, newTechSkill.trim()]
      }))
      setNewTechSkill('')
    }
  }

  const removeTechSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      techSkills: prev.techSkills.filter(s => s !== skill)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-3xl text-white">
          {profile ? 'Editar Perfil' : 'Crear Perfil'}
        </CardTitle>
        <CardDescription className="text-blue-200 text-lg">
          Completa tu información profesional en TentaCool
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">
                Título del Trabajo
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Ej: Desarrollador Full Stack"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">
                Empresa
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Ej: TentaCool Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">
              Experiencia
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="Describe tu experiencia profesional..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">
              Habilidades Técnicas
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTechSkill}
                onChange={(e) => setNewTechSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechSkill())}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Agregar habilidad técnica..."
              />
              <Button
                type="button"
                onClick={addTechSkill}
                className="bg-cyan-400 hover:bg-cyan-500 text-white"
              >
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.techSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-400/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeTechSkill(skill)}
                    className="text-purple-400 hover:text-purple-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">
              Intereses no profesionales
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Agregar interés no profesional..."
              />
              <Button
                type="button"
                onClick={addInterest}
                className="bg-cyan-400 hover:bg-cyan-500 text-white"
              >
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded-full text-sm flex items-center gap-2"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="text-cyan-400 hover:text-cyan-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-white"
            >
              {profile ? 'Actualizar Perfil' : 'Crear Perfil'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
