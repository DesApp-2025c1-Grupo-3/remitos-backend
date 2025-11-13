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
### Primera vez que levantes el back
3. **Levantar la aplicación con Docker:**
```bash
# Desarrollo básico
npm run docker:clean (Ya deja levantada la app por lo que ya estaria lista)
```
### Desarrollo diario
3. **Levantar la aplicación con Docker:**
```bash
# Desarrollo básico
npm run docker:dev (Se recompila solo al hacer cambios)
```

### Comandos Principales
```bash
# Levantar aplicación en modo desarrollo
npm run docker:dev
```

### Logs y Debugging
```bash
# Ver logs de Docker
npm run docker:logs

# Ejecutar en modo desarrollo local
npm run dev
```

## 🗄️ Conexión a Base de Datos (DBeaver)

Para visualizar y gestionar la base de datos con DBeaver u otro cliente PostgreSQL:

### Configuración de Conexión

```
Host:          localhost
Puerto:        5432
Base de Datos: remitos_db
Usuario:       postgres
Contraseña:    1234
```

### Notas Importantes
- ⚠️ **Asegúrate de que los contenedores de Docker estén corriendo** antes de conectarte
- 🔍 Verifica que los contenedores estén activos con: `docker ps`
- 📊 Dentro del contenedor Docker, el servicio se llama `remitos-db`, pero desde tu máquina local debes usar `localhost`
- 🔐 En producción, las credenciales se configuran mediante variables de entorno

## 🚀 Despliegue

### Render
El proyecto incluye configuración para despliegue en Render y Neon, se despliega automaticamente al mergear a main
