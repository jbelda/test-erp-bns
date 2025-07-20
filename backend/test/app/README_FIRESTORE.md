# Firestore Database Setup

Este proyecto incluye una configuración completa de Firestore para manejar empresas y usuarios con control de acceso basado en roles.

## Estructura de la Base de Datos

### Colección: `companies`
```typescript
{
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // ID del usuario que creó la empresa
}
```

### Colección: `users`
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  companyId?: string; // Solo para empleados, null para admins
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

## Reglas de Acceso

- **Admins**: Pueden ver todas las empresas y todos los usuarios
- **Employees**: Solo pueden ver usuarios de su propia empresa

## Uso de los Servicios

### Crear una empresa
```typescript
import { companyService } from './services/firestoreService';

const companyId = await companyService.create({
  name: 'Mi Empresa',
  address: 'Calle Principal 123',
  phone: '+1234567890',
  email: 'contacto@miempresa.com',
  createdBy: 'user-id'
});
```

### Crear un usuario
```typescript
import { userService } from './services/firestoreService';

// Crear admin
const adminId = await userService.create({
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin'
});

// Crear empleado
const employeeId = await userService.create({
  email: 'employee@example.com',
  name: 'Employee User',
  role: 'employee',
  companyId: 'company-id'
});
```

### Obtener usuarios por rol
```typescript
// Obtener todos los admins
const admins = await userService.getByRole('admin');

// Obtener empleados de una empresa
const employees = await userService.getByCompanyId('company-id');
```

## API Routes

### GET /api/companies
Obtiene todas las empresas (solo para admins)

### POST /api/companies
Crea una nueva empresa
```json
{
  "name": "Mi Empresa",
  "address": "Calle Principal 123",
  "phone": "+1234567890",
  "email": "contacto@miempresa.com",
  "createdBy": "user-id"
}
```

### GET /api/users?role=admin
Obtiene todos los usuarios (solo para admins)

### GET /api/users?role=employee&companyId=company-id
Obtiene usuarios de una empresa específica (para empleados)

### POST /api/users
Crea un nuevo usuario
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "role": "employee",
  "companyId": "company-id"
}
```

## Configuración Requerida

1. Instalar firebase-admin:
```bash
npm install firebase-admin
```

2. Configurar las credenciales de servicio en `firebaseServiceAccountKey.json`

3. Asegurarse de que el archivo de credenciales esté en `.gitignore`

## Próximos Pasos

- Implementar autenticación con Firebase Auth
- Agregar middleware para verificar roles
- Implementar validación de datos
- Agregar paginación para listas grandes 