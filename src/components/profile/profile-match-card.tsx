'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { MessageCircle, Briefcase, MapPin } from "lucide-react"

interface Match {
  name: string
  image?: string
  job_position: string
  company: string
  tech_skills: string
  interests: string
  conversation_starter?: string
}

interface ProfileMatchCardProps {
  match: Match
  onStartChat?: (match: Match) => void
}

export function ProfileMatchCard({ match, onStartChat }: ProfileMatchCardProps) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <SmartAvatar
            src={match.image}
            name={match.name}
            size={64}
            className="h-16 w-16 ring-2 ring-blue-300"
            fallbackClassName="text-white text-lg font-semibold"
          />
        </div>
        <CardTitle className="text-xl font-bold text-gray-800">
          {match.name}
        </CardTitle>
        <CardDescription className="text-gray-600 flex items-center justify-center gap-1">
          <Briefcase className="h-4 w-4" />
          {match.job_position}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>{match.company}</span>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-blue-700">Habilidades Técnicas</h4>
          <div className="flex flex-wrap gap-1">
            {match.tech_skills.split(',').map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
              >
                {skill.trim()}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-purple-700">Intereses</h4>
          <div className="flex flex-wrap gap-1">
            {match.interests.split(',').map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                {interest.trim()}
              </Badge>
            ))}
          </div>
        </div>
        
        {match.conversation_starter && (
          <div className="space-y-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-700">💡 Tema para romper el hielo</h4>
            <p className="text-xs text-gray-700 italic">
              {match.conversation_starter}
            </p>
          </div>
        )}
        
        <div className="pt-4">
          <Button 
            onClick={() => onStartChat?.(match)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Iniciar Conversación
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
