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

### IMPORTANTE

#### 🏗️ Primera vez que se levanta la app o con cambios en código
```bash
# Construir imagen y levantar aplicación
npm run docker:build
```

#### ⚡ Ejecuciones posteriores (más rápido)
```bash
# Solo levantar contenedores existentes
npm run docker:dev
```

#### 📊 Base de datos
```bash
# Ejecutar migraciones manualmente (puede fallar debido a la config de dev, de todos modos se ejecuta automaticamente en el docker build)
npm run db:migrate

# Cargar estados del sistema (requerido)
npm run db:seed:estados
```

## 🔧 Desarrollo

### Logs y Debugging
```bash
# Ver logs de Docker
npm run docker:logs
```

## 📝 Notas

- La aplicación corre en `http://localhost:3002` por defecto
- PostgreSQL corre en `localhost:5432`
- **Primera vez**: Usar `npm run docker:build`
- **Ejecuciones posteriores**: Usar `npm run docker:dev` para mayor velocidad
- Los estados del sistema se cargan manualmente con `npm run db:seed:estados`
