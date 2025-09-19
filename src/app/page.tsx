'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginButton } from "@/components/auth/login-button";
import { UserProfile } from "@/components/auth/user-profile";
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <main className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
              Tenta<span className="text-cyan-400">Cool</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl mx-auto">
              La plataforma más genial para conectar, colaborar y crear experiencias increíbles en la PulpoCon 2025
            </p>
          </div>

          {session ? (
            <div className="w-full max-w-2xl space-y-6">
              <UserProfile />
              <div className="text-center">
                <Link 
                  href="/users"
                  className="inline-flex items-center px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Ver todos los usuarios
                </Link>
              </div>
            </div>
          ) : (
            <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-white mb-4">
                  ¡Bienvenido a TentaCool!
                </CardTitle>
                <CardDescription className="text-blue-200 text-lg">
                  Descubre un mundo de posibilidades donde la tecnología se encuentra con la creatividad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-white">Gestión de usuarios avanzada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-white">Autenticación segura</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-white">Interfaz moderna y intuitiva</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-white">Base de datos robusta</span>
                  </div>
                </div>
                
                <div className="pt-6">
                  <LoginButton />
                </div>
              </CardContent>
            </Card>
          )}

        </main>
      </div>
    </div>
  );
}
