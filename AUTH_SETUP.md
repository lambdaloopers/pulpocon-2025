# Configuración de Autenticación con Google

## Pasos para configurar la autenticación con Google

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (o Google Identity)

### 2. Configurar OAuth 2.0

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Selecciona "Web application"
4. Configura las URIs de redirección autorizadas:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.com/api/auth/callback/google` (producción)

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro-aqui

# Google OAuth Configuration
GOOGLE_CLIENT_ID=tu-google-client-id-aqui
GOOGLE_CLIENT_SECRET=tu-google-client-secret-aqui
```

### 4. Generar NEXTAUTH_SECRET

Puedes generar un secret seguro usando:

```bash
openssl rand -base64 32
```

### 5. Ejecutar la aplicación

```bash
npm run dev
```

## Funcionalidades implementadas

- ✅ Autenticación con Google OAuth 2.0
- ✅ Página de inicio de sesión personalizada
- ✅ Perfil de usuario con información de Google
- ✅ Botones de login/logout
- ✅ Protección de rutas (opcional)
- ✅ Manejo de sesiones con NextAuth.js

## Estructura de archivos

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # Configuración de NextAuth
│   ├── auth/signin/page.tsx             # Página de login personalizada
│   └── layout.tsx                       # Layout con AuthProvider
├── components/
│   ├── auth/
│   │   ├── login-button.tsx            # Botón de login
│   │   ├── logout-button.tsx           # Botón de logout
│   │   └── user-profile.tsx            # Perfil de usuario
│   └── providers/
│       └── auth-provider.tsx           # Provider de NextAuth
```

## Próximos pasos

1. Configurar las variables de entorno
2. Probar la autenticación en desarrollo
3. Configurar para producción
4. Añadir más proveedores de autenticación si es necesario
5. Implementar protección de rutas específicas
