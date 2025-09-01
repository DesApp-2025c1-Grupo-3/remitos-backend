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

## 🚀 Despliegue

### Render
El proyecto incluye configuración para despliegue en Render y Neon, se despliega automaticamente al mergear a main
