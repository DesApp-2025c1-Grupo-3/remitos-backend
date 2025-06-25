# Sistema de Remitos - Backend API 🚚

API REST para el sistema de gestión de remitos desarrollada con Node.js, Express y PostgreSQL.

## 🛠️ Tecnologías Utilizadas

- **[Node.js 14+](https://nodejs.org/)**: Entorno de ejecución JavaScript
- **[Express.js](https://expressjs.com/)**: Framework web para Node.js
- **[Sequelize](https://sequelize.org/)**: ORM para PostgreSQL
- **[PostgreSQL 12+](https://www.postgresql.org/)**: Base de datos relacional
- **[Redis](https://redis.io/)**: Cache y sesiones
- **[Docker](https://www.docker.com/)**: Contenedores para desarrollo
- **[Jest](https://jestjs.io/)**: Framework de testing

## 📋 Prerrequisitos

### Para Nuevos Desarrolladores

Necesitas tener instalado:

1. **Node.js 14+** (recomendamos usar [nvm](https://github.com/nvm-sh/nvm))
2. **Docker y Docker Compose**
3. **Git**

### Editor Recomendado: Visual Studio Code

Con las siguientes extensiones:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Jest Test Explorer](https://marketplace.visualstudio.com/items?itemName=kavod-io.vscode-jest-test-adapter)

## 🚀 Configuración Inicial (Nuevos Desarrolladores)

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd remitos-backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivos de configuración
cp .env.example .env.development
cp .env.example .env.test
```

### 4. Levantar Base de Datos con Docker

```bash
# Levantar PostgreSQL y Redis
docker compose up -d

# Verificar que los contenedores estén corriendo
docker compose ps
```

### 5. Configurar Base de Datos

```bash
# Ejecutar migraciones
npm run db:migrate

# Cargar datos iniciales (estados del sistema)
npm run db:seed
```

### 6. Iniciar el Servidor

```bash
# Modo desarrollo (recarga automática)
npm start

# O modo producción
npm run prod
```

¡Listo! El servidor estará corriendo en `http://localhost:3000`

## 🔄 Para Desarrolladores Existentes (Limpiar y Reiniciar)

Si ya tenías el proyecto y quieres empezar limpio:

### Opción 1: Limpieza Completa (Recomendada)

```bash
# 1. Detener contenedores
docker compose down

# 2. Eliminar volúmenes de datos (Cuidado. Esto borra todo)
sudo rm -rf docker/postgres/data/*
sudo rm -rf docker/redis/data/*

# 3. Levantar contenedores frescos
docker compose up -d


# 4. Ejecutar migraciones
npm run db:migrate

# 5. Cargar datos iniciales
npm run db:seed

# 6. Iniciar servidor
npm start
```

### Opción 2: Solo Recrear Base de Datos

```bash
# 1. Conectarse a PostgreSQL y eliminar/recrear la base
docker compose exec db psql -U postgres -c "DROP DATABASE IF EXISTS desApp;"
docker compose exec db psql -U postgres -c "CREATE DATABASE desApp;"

# 2. Ejecutar migraciones y seeders
npm run db:migrate
npm run db:seed

# 3. Iniciar servidor
npm start
```

## 📁 Estructura del Proyecto

```
remitos-backend/
├── bin/                    # Punto de entrada del servidor
├── config/                 # Configuración de la aplicación
├── docker/                 # Configuración de Docker
│   ├── postgres/           # Datos de PostgreSQL
│   └── redis/              # Datos de Redis
├── lib/                    # Código fuente principal
│   ├── config/             # Configuración de Sequelize
│   ├── controllers/        # Lógica de negocio
│   ├── middlewares/        # Middlewares personalizados
│   ├── migrations/         # Migraciones de base de datos
│   ├── models/             # Modelos de Sequelize
│   ├── routes/             # Definición de rutas API
│   ├── schemas/            # Esquemas de validación
│   └── uploads/            # Archivos subidos
├── migrations/             # Migraciones adicionales
├── seeders/                # Datos iniciales
└── test/                   # Utilidades de testing
```

## 🗄️ Modelos de Datos

El sistema maneja las siguientes entidades principales:

- **Cliente**: Información de clientes
- **Destino**: Direcciones de destino
- **Contacto**: Contactos asociados a destinos
- **Remito**: Documento principal del sistema
- **Mercadería**: Información de la carga
- **Estado**: Estados del remito (Autorizado, En preparación, etc.)

## 🌐 Endpoints Principales

### Remitos

- `GET /remito?page=1&limit=20` - Listar remitos con paginación
- `GET /remito/:id` - Obtener remito por ID
- `POST /remitoFinal` - Crear remito completo (con cliente, destino y mercadería)
- `PUT /remito/:id` - Actualizar datos básicos del remito
- `PUT /remito/:id/mercaderia` - Actualizar mercadería del remito
- `PUT /remito/:id/estado/:estadoId` - Cambiar estado del remito
- `DELETE /remito/:id` - Eliminar remito (soft delete)

### Clientes

- `GET /cliente` - Listar clientes
- `POST /cliente` - Crear cliente
- `PUT /cliente/:id` - Actualizar cliente

### Destinos

- `GET /destino` - Listar destinos
- `POST /destino` - Crear destino
- `PUT /destino/:id` - Actualizar destino

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm test -- --coverage
```

## 📊 Base de Datos

### Estados del Sistema

El sistema incluye los siguientes estados predefinidos:

1. **Autorizado** (id: 1) - Estado inicial
2. **Retenido** (id: 2) - No se puede despachar
3. **En preparación** (id: 3) - Armando envoltorio
4. **En carga** (id: 4) - Asignado a viaje
5. **En camino** (id: 5) - Viaje iniciado
6. **No entregado** (id: 6) - Fallo en entrega
7. **Entregado** (id: 7) - Entregado exitosamente

### Comandos Útiles de Base de Datos

```bash
# Crear nueva migración
npx sequelize-cli migration:generate --name nombre-migracion

# Crear nuevo seeder
npx sequelize-cli seed:generate --name nombre-seeder

# Deshacer última migración
npx sequelize db:migrate:undo

# Ver estado de migraciones
npx sequelize db:migrate:status
```

## 🐳 Docker

### Servicios Incluidos

- **PostgreSQL 12.5**: Puerto 5432
- **Redis 7.0**: Puerto 6379

### Comandos Docker Útiles

```bash
# Ver logs de PostgreSQL
docker compose logs db

# Ver logs de Redis
docker compose logs redis

# Conectarse a PostgreSQL
docker compose exec db psql -U postgres -d desApp

# Conectarse a Redis
docker compose exec redis redis-cli

# Reiniciar solo un servicio
docker compose restart db
```

## 🔧 Scripts Disponibles

```bash
npm start          # Desarrollo con recarga automática
npm run build      # Compilar código
npm run server     # Ejecutar servidor compilado
npm run dev        # Desarrollo
npm run prod       # Producción
npm run db:migrate # Ejecutar migraciones
npm run db:seed    # Ejecutar seeders
npm test           # Ejecutar tests
npm run lint       # Verificar código con ESLint
```

## 🚨 Solución de Problemas Comunes

### Error: "Database connection failed"

```bash
# Verificar que PostgreSQL esté corriendo
docker compose ps

# Si no está corriendo, levantarlo
docker compose up -d db
```

### Error: "Port already in use"

```bash
# Ver qué proceso usa el puerto 3000
lsof -i :3000

# Matar el proceso si es necesario
kill -9 [PID]
```

### Error: "Migration failed"

```bash
# Verificar estado de migraciones
npx sequelize db:migrate:status

# Deshacer última migración si es necesario
npx sequelize db:migrate:undo
```

### Limpiar Cache de Node

```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 👥 Equipo de Desarrollo

Para reportar bugs o solicitar features, crear un issue en el repositorio.

---

**¡Happy coding! 🚀**
