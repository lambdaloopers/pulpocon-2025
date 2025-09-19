'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface SmartAvatarProps {
  src?: string | null
  name: string
  className?: string
  size?: number
  fallbackClassName?: string
}

export function SmartAvatar({ 
  src, 
  name, 
  className, 
  size = 64, 
  fallbackClassName 
}: SmartAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [useProxy, setUseProxy] = useState(false)

  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Generate a consistent color based on name
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-blue-600',
      'bg-purple-600',
      'bg-green-600',
      'bg-yellow-600',
      'bg-red-600',
      'bg-indigo-600',
      'bg-pink-600',
      'bg-teal-600',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const shouldShowImage = src && !imageError && src.trim() !== ''
  
  // Create the image URL - use proxy if needed
  const imageUrl = shouldShowImage 
    ? (useProxy ? `/api/image-proxy?url=${encodeURIComponent(src)}` : src)
    : null

  const handleImageError = () => {
    if (!useProxy && src) {
      // First attempt failed, try with proxy
      setUseProxy(true)
      setImageLoading(true)
    } else {
      // Both attempts failed, show fallback
      setImageError(true)
      setImageLoading(false)
    }
  }

  return (
    <Avatar className={cn("relative overflow-hidden", className)}>
      {shouldShowImage && imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={name}
            width={size}
            height={size}
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setImageLoading(false)}
            onError={handleImageError}
            priority={false}
            unoptimized={useProxy} // Use unoptimized for proxy URLs
          />
          {imageLoading && (
            <AvatarFallback 
              className={cn(
                "absolute inset-0 text-white text-lg font-semibold animate-pulse",
                getColorFromName(name),
                fallbackClassName
              )}
            >
              {initials}
            </AvatarFallback>
          )}
        </>
      ) : (
        <AvatarFallback 
          className={cn(
            "text-white text-lg font-semibold",
            getColorFromName(name),
            fallbackClassName
          )}
        >
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
