# Test ERP BNS

Sistema ERP básico con frontend en Angular y backend en Next.js con Firebase.

## Estructura del Proyecto

```
test-erp-bns/
├── frontend/          # Aplicación Angular
└── backend/test/      # API REST con Next.js y Firebase
```

## Firebase Hosting Setup (Opción 1 - Recomendada)

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Firebase con Firestore y Hosting habilitado
- Firebase CLI (`npm install -g firebase-tools`)

### Configuración de Firebase

#### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Firestore Database

#### 2. Generar clave de servicio

1. En Firebase Console, ve a **Configuración del proyecto** > **Cuentas de servicio**
2. Haz clic en "Generar nueva clave privada"
3. Descarga el archivo JSON

#### 3. Configurar clave de servicio

1. Coloca el archivo JSON descargado en `backend/test/app/firebaseServiceAccountKey.json`
2. **IMPORTANTE**: Nunca subas este archivo a Git (ya está en .gitignore)

### Configuración del Proyecto Firebase

#### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Firestore Database y Hosting

#### 2. Configurar archivos del proyecto

1. Actualiza `.firebaserc` con tu ID de proyecto
2. Actualiza `frontend/src/environments/environment.prod.ts` con tu URL de Firebase

#### 3. Configurar GitHub Secrets (para deploy automático)

1. Ve a tu repositorio en GitHub > **Settings** > **Secrets and variables** > **Actions**
2. Agrega `FIREBASE_SERVICE_ACCOUNT` con el contenido de tu clave de servicio

## Instalación y Ejecución

### Instalar todas las dependencias

```bash
npm run install:all
```

### Ejecutar en modo desarrollo

```bash
# Frontend (Angular)
npm run dev:frontend

# Backend (Next.js)
npm run dev:backend
```

### Construir para producción

```bash
npm run build
```

### Deploy a Firebase Hosting

```bash
npm run deploy
```

## Variables de Entorno (Opcional)

Si prefieres usar variables de entorno en lugar del archivo JSON:

1. Crea un archivo `.env.local` en `backend/test/`
2. Agrega las siguientes variables:

```env
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
```

## URLs de Producción

Una vez desplegado en Firebase Hosting:

- **Frontend**: `https://tu-proyecto-id.web.app/`
- **API Backend**: `https://tu-proyecto-id.web.app/api/`

## Endpoints de la API

- `GET /api/companies` - Obtener todas las empresas (solo admin)
- `POST /api/companies` - Crear nueva empresa (solo admin)
- `PUT /api/companies/[id]` - Actualizar empresa (solo admin)
- `GET /api/users` - Obtener usuarios (admin ve todos, employee ve su empresa)
- `POST /api/users` - Crear nuevo usuario (solo admin)

## Autenticación

La API utiliza autenticación basada en JWT. Los endpoints requieren un header `Authorization: Bearer <token>`.

### Roles de Usuario

- **admin**: Puede ver y gestionar todas las empresas y usuarios
- **employee**: Solo puede ver usuarios de su empresa asignada

## Frontend Setup

### Prerrequisitos

- Node.js (versión 18 o superior)
- Angular CLI (`npm install -g @angular/cli`)

### Instalación y Ejecución

#### Instalar dependencias

```bash
cd frontend
npm install
```

#### Ejecutar en modo desarrollo

```bash
ng serve
```

La aplicación se ejecutará en `http://localhost:4200`

#### Construir para producción

```bash
ng build
```

### Configuración del Environment

**IMPORTANTE**: Debes configurar la URL de la API en el archivo de environment del frontend.

#### Editar environment de desarrollo

```typescript
// Archivo: frontend/src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // Cambia esta URL según tu configuración
};
```

#### Editar environment de producción

```typescript
// Archivo: frontend/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-dominio.com/api' // URL de tu API en producción
};
```

**Nota**: Asegúrate de que la URL del backend coincida con donde esté ejecutándose tu servidor Next.js.

## Desarrollo

### Scripts Útiles

#### Backend:

```bash
npm run dev      # Ejecutar en modo desarrollo con hot reload
npm run build    # Construir para producción
npm run start    # Ejecutar versión de producción
npm run lint     # Ejecutar linter
```

#### Frontend:

```bash
ng serve         # Ejecutar en modo desarrollo
ng build         # Construir para producción
ng test          # Ejecutar tests
ng lint          # Ejecutar linter
```

## Estructura de Base de Datos

### Colección: `companies`

- `name` (string) - Nombre de la empresa
- `address` (string) - Dirección
- `phone` (string) - Teléfono
- `email` (string) - Email
- `createdAt` (timestamp) - Fecha de creación
- `updatedAt` (timestamp) - Fecha de actualización
- `createdBy` (string) - ID del usuario que la creó

### Colección: `users`

- `email` (string) - Email del usuario
- `name` (string) - Nombre completo
- `role` (string) - 'admin' o 'employee'
- `companyId` (string, opcional) - ID de la empresa (solo para employees)
- `createdAt` (timestamp) - Fecha de creación
- `updatedAt` (timestamp) - Fecha de actualización
- `isActive` (boolean) - Estado activo del usuario

## Configuración de CORS

El backend está configurado para manejar peticiones CORS desde cualquier origen. Los headers CORS se agregan automáticamente a todas las respuestas de la API.

## Autenticación de Desarrollo

Para desarrollo local, puedes usar el header `X-Dev-Admin: true` para simular un usuario administrador sin necesidad de JWT.

## Troubleshooting

### Error 404 en Firebase Hosting

1. Verifica que el build se haya generado correctamente
2. Asegúrate de que `firebase.json` apunte al directorio correcto
3. Ejecuta `firebase deploy --only hosting`

### Error de CORS

1. Verifica que los headers CORS estén configurados correctamente
2. Asegúrate de que la URL del backend sea correcta en el environment

### Error de Autenticación

1. Verifica que el header `X-Dev-Admin: true` esté presente en las peticiones
2. Asegúrate de que la clave de servicio de Firebase esté configurada correctamente