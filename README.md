# 🏒 Kellun Finance - MVP Sistema de Gestión de Socios

Sistema de automatización de cobros y gestión de socios para clubes deportivos, enfocado en escalabilidad y bajo costo operativo.

## 🏗️ Arquitectura
- **Frontend:** Next.js 14 (App Router) alojado en Vercel.
- **Backend-as-a-Service:** Supabase (Auth, PostgreSQL, RLS).
- **Serverless Logic:** Google Cloud Functions (Node.js) para integración con pasarela Flow.
- **Database:** PostgreSQL con políticas de seguridad a nivel de fila (RLS).

## 🚀 Características
- Gestión de cuotas mensuales automatizada.
- Simulación de pasarela de pagos (Flow Chile).
- Seguridad robusta: los socios solo acceden a su propia información.

## 🛠️ Instalación
1. Clonar el repo.
2. Configurar variables de entorno en `./frontend/.env.local`.
3. Ejecutar `npm install` en ambas carpetas.
4. `npm run dev` para iniciar el portal.
