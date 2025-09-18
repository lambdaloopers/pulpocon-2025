'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginButton } from "@/components/auth/login-button";
import { UserProfile } from "@/components/auth/user-profile";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <img
          className="dark:invert w-[180px] h-[38px]"
          src="/next.svg"
          alt="Next.js logo"
        />
        
        {session ? (
          <UserProfile />
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Bienvenido a Pulpocon 2025</CardTitle>
              <CardDescription>
                Una aplicación web moderna construida con Next.js, TypeScript, shadcn/ui, y Prisma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Esta aplicación incluye:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Next.js 15 con App Router</li>
                <li>• TypeScript para seguridad de tipos</li>
                <li>• shadcn/ui components</li>
                <li>• Prisma ORM con PostgreSQL</li>
                <li>• Sistema de gestión de usuarios</li>
                <li>• Autenticación con Google</li>
              </ul>
              <div className="pt-4 space-y-2">
                <LoginButton />
                <Link href="/users">
                  <Button variant="outline" className="w-full">
                    Ver Usuarios
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="dark:invert w-5 h-5"
              src="/vercel.svg"
              alt="Vercel logomark"
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            aria-hidden
            src="/file.svg"
            alt="File icon"
            className="w-4 h-4"
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            className="w-4 h-4"
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            className="w-4 h-4"
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
