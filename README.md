# Sistema de Remitos - Backend

API REST para el sistema de gestión de remitos desarrollada con Node.js, Express y PostgreSQL.

## 🚀 Inicio Rápido con Docker

### Prerrequisitos
- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (versión 14 o superior)

### Configuración Inicial

1. **Clonar el repositorio y navegar al directorio del backend:**
```bash
cd remitos-backend
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

3. **Primera vez - Construir y levantar:**
```bash
# Construir imagen y levantar aplicación
npm run docker:build
```
4. **Ejecutar seeds de estados:**
```bash
# Construir imagen y levantar aplicación
npm run db:seed:estados
```

### Estados del Sistema
El sistema requiere que se carguen los estados básicos para funcionar correctamente:
- Autorizado
- En preparación
- En carga
- En camino
- Entregado
- No entregado
- Retenido

**Importante:** Siempre ejecutar `npm run db:seed:estados` después de las migraciones.

### Otros Seeds (Opcionales)
Los siguientes seeds contienen datos de demostración y son opcionales:
- `demo-clientes.js` - Clientes de ejemplo
- `demo-destinos.js` - Destinos de ejemplo
- `demo-contactos.js` - Contactos de ejemplo
- `demo-mercaderias-remitos.js` - Remitos y mercaderías de ejemplo


## 🔧 Desarrollo

### Logs y Debugging
```bash
# Ver logs de Docker
npm run docker:logs
```

## 📝 Notas

- La aplicación corre en `http://localhost:3002` por defecto
- PostgreSQL corre en `localhost:5432`
- Siempre ejecutar `db:seed:estados` después de migraciones para cargar los estados requeridos
- Tener cuidado con los demas seeds ya que no estan actualizados y pueden generar problemas
