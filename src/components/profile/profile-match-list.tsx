'use client'

import { ProfileMatchCard } from "./profile-match-card"
import { Users, Heart } from "lucide-react"

interface Match {
  name: string
  image?: string
  job_position: string
  company: string
  tech_skills: string
  interests: string
  conversation_starter?: string
}

interface MatchesData {
  matches: Match[]
}

interface ProfileMatchListProps {
  matchesData: MatchesData
  onStartChat?: (match: Match) => void
}

export function ProfileMatchList({ matchesData, onStartChat }: ProfileMatchListProps) {
  if (!matchesData?.matches || matchesData.matches.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No se encontraron matches disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart className="h-6 w-6 text-pink-400" />
          <h3 className="text-xl font-bold text-white">
            ¡Tenemos {matchesData.matches.length} match{matchesData.matches.length !== 1 ? 'es' : ''} para ti!
          </h3>
          <Heart className="h-6 w-6 text-pink-400" />
      </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchesData.matches.map((match, index) => (
          <ProfileMatchCard
            key={index}
            match={match}
            onStartChat={onStartChat}
          />
        ))}
      </div>
    </div>
  )
}
