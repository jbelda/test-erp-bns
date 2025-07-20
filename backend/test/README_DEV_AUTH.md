# Autenticación Simulada en Desarrollo

## Configuración Automática

En modo desarrollo (`NODE_ENV=development`), la aplicación automáticamente simula un usuario admin sin necesidad de autenticación real.

## Headers de Desarrollo

### Simular Admin
```bash
curl -H "X-Dev-Admin: true" http://localhost:3000/api/companies
```

### Simular Empleado
```bash
curl -H "X-Dev-Admin: true" -H "X-Dev-Company-Id: company123" http://localhost:3000/api/users
```

## Usuarios Simulados

### Admin
- **ID**: `dev-admin-id`
- **Email**: `admin@example.com`
- **Role**: `admin`
- **CompanyId**: `undefined`

### Employee
- **ID**: `dev-employee-id`
- **Email**: `employee@example.com`
- **Role**: `employee`
- **CompanyId**: Valor del header `X-Dev-Company-Id`

## Ejemplos de Uso

### 1. Obtener todas las compañías (solo admin)
```bash
# Automático en desarrollo
curl http://localhost:3000/api/companies

# Manual con header
curl -H "X-Dev-Admin: true" http://localhost:3000/api/companies
```

### 2. Obtener usuarios de una compañía (empleado)
```bash
curl -H "X-Dev-Admin: true" -H "X-Dev-Company-Id: company123" http://localhost:3000/api/users
```

### 3. Crear una nueva compañía (solo admin)
```bash
curl -X POST -H "X-Dev-Admin: true" -H "Content-Type: application/json" \
  -d '{"name":"Nueva Compañía","address":"Calle 123","phone":"123456789","email":"nueva@company.com"}' \
  http://localhost:3000/api/companies
```

## Utilidades de Desarrollo

```typescript
import { devHelpers } from '../utils/devHelpers';

// Obtener headers para admin
const adminHeaders = devHelpers.getDevHeaders('admin');

// Obtener headers para empleado
const employeeHeaders = devHelpers.getDevHeaders('employee', 'company123');

// Verificar si estamos en desarrollo
if (devHelpers.isDevelopment()) {
  // Lógica específica de desarrollo
}
```

## Notas Importantes

1. **Solo funciona en desarrollo**: En producción, se requiere autenticación JWT real
2. **Headers opcionales**: En desarrollo, los endpoints funcionan sin headers
3. **Testing**: Usa los headers para probar diferentes roles y permisos
4. **Seguridad**: Esta funcionalidad está deshabilitada en producción 