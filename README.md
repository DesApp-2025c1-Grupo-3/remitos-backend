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

3. **Levantar la aplicación con Docker:**
```bash
# Desarrollo básico
npm run docker:dev
```

4. **Ejecutar migraciones de base de datos:**
```bash
npm run db:migrate
```

5. **Cargar estados del sistema (requerido):**
```bash
npm run db:seed:estados
```

### Comandos Principales
```bash
# Levantar aplicación en modo desarrollo
npm run docker:dev


## 📁 Estructura del Proyecto

```
remitos-backend/
├── bin/                    # Punto de entrada del servidor
├── config/                 # Configuración de base de datos
├── lib/                    # Lógica de la aplicación
│   ├── controllers/        # Controladores de la API
│   ├── models/            # Modelos de Sequelize
│   └── routes/            # Definición de rutas
├── migrations/            # Migraciones de base de datos
├── seeders/               # Datos de prueba
│   └── 20250101000000-initial-estados.js  # Estados del sistema
├── docker-compose.yml     # Configuración de Docker
└── package.json           # Dependencias y scripts
```

## 🗄️ Base de Datos

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
El proyecto incluye configuración para despliegue en Render:
```bash
npm run render:deploy
```

## 📝 Notas

- La aplicación corre en `http://localhost:3000` por defecto
- PostgreSQL corre en `localhost:5432`
- Siempre ejecutar `db:seed:estados` después de migraciones para cargar los estados requeridos
