# Test ERP BNS

Sistema ERP con frontend en Angular y backend en Next.js con Firebase.

## Estructura del Proyecto

- `frontend/` - Aplicación Angular
- `backend/test/` - API REST con Next.js y Firebase

## Backend Setup

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Firebase con Firestore habilitado

### Configuración de Firebase

1. **Crear proyecto en Firebase Console**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o usa uno existente
   - Habilita Firestore Database

2. **Generar clave de servicio**
   - En Firebase Console, ve a Configuración del proyecto > Cuentas de servicio
   - Haz clic en "Generar nueva clave privada"
   - Descarga el archivo JSON

3. **Configurar clave de servicio**
   - Coloca el archivo JSON descargado en `backend/test/app/firebaseServiceAccountKey.json`
   - **IMPORTANTE**: Nunca subas este archivo a Git (ya está en .gitignore)

### Instalación y Ejecución

1. **Instalar dependencias**
   ```bash
   cd backend/test
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   El servidor se ejecutará en `http://localhost:3000`

3. **Construir para producción**
   ```bash
   npm run build
   npm start
   ```

### Variables de Entorno (Opcional)

Si prefieres usar variables de entorno en lugar del archivo JSON:

1. Crea un archivo `.env.local` en `backend/test/`
2. Agrega las siguientes variables:
   ```
   FIREBASE_PROJECT_ID=tu-proyecto-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
   ```

### Endpoints de la API

- `GET /api/companies` - Obtener todas las empresas (solo admin)
- `POST /api/companies` - Crear nueva empresa (solo admin)
- `PUT /api/companies/[id]` - Actualizar empresa (solo admin)
- `GET /api/users` - Obtener usuarios (admin ve todos, employee ve su empresa)
- `POST /api/users` - Crear nuevo usuario (solo admin)

### Autenticación

La API utiliza autenticación basada en JWT. Los endpoints requieren un header `Authorization: Bearer <token>`.

### Roles de Usuario

- **admin**: Puede ver y gestionar todas las empresas y usuarios
- **employee**: Solo puede ver usuarios de su empresa asignada

## Frontend Setup

### Prerrequisitos

- Node.js (versión 18 o superior)
- Angular CLI (`npm install -g @angular/cli`)

### Instalación y Ejecución

1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   ng serve
   ```
   La aplicación se ejecutará en `http://localhost:4200`

3. **Construir para producción**
   ```bash
   ng build
   ```

### Configuración del Environment

**IMPORTANTE**: Debes configurar la URL de la API en el archivo de environment del frontend.

1. **Editar environment de desarrollo**
   ```bash
   # Archivo: frontend/src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api' // Cambia esta URL según tu configuración
   };
   ```

2. **Editar environment de producción** (si existe)
   ```bash
   # Archivo: frontend/src/environments/environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://tu-dominio.com/api' // URL de tu API en producción
   };
   ```

**Nota**: Asegúrate de que la URL del backend coincida con donde esté ejecutándose tu servidor Next.js.

## Desarrollo

### Scripts Útiles

**Backend:**
- `npm run dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar versión de producción
- `npm run lint` - Ejecutar linter

**Frontend:**
- `ng serve` - Ejecutar en modo desarrollo
- `ng build` - Construir para producción
- `ng test` - Ejecutar tests
- `ng lint` - Ejecutar linter

### Estructura de Base de Datos

**Colección: companies**
- `name` (string) - Nombre de la empresa
- `address` (string) - Dirección
- `phone` (string) - Teléfono
- `email` (string) - Email
- `createdAt` (timestamp) - Fecha de creación
- `updatedAt` (timestamp) - Fecha de actualización
- `createdBy` (string) - ID del usuario que la creó

**Colección: users**
- `email` (string) - Email del usuario
- `name` (string) - Nombre completo
- `role` (string) - 'admin' o 'employee'
- `companyId` (string, opcional) - ID de la empresa (solo para employees)
- `createdAt` (timestamp) - Fecha de creación
- `updatedAt` (timestamp) - Fecha de actualización
- `isActive` (boolean) - Estado activo del usuario