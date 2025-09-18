'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta de Pulpocon 2025
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Autenticación</CardTitle>
            <CardDescription>
              Elige tu método de autenticación preferido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers &&
              Object.values(providers).map((provider: { id: string; name: string }) => (
                <div key={provider.name}>
                  <Button
                    onClick={() => signIn(provider.id)}
                    className="w-full"
                  >
                    Iniciar sesión con {provider.name}
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
