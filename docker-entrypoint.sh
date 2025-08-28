#!/bin/sh

# Esperar base de datos
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10
echo "✅ Base de datos lista"

# Ejecutar migraciones si está habilitado y no se debe saltar
if [ "$SKIP_DB_SETUP" != "true" ] && [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🔄 Ejecutando migraciones..."
  npx sequelize-cli db:migrate || echo "⚠️  Algunas migraciones fallaron"
else
  echo "ℹ️  Migraciones omitidas (SKIP_DB_SETUP=$SKIP_DB_SETUP, RUN_MIGRATIONS=$RUN_MIGRATIONS)"
fi

# Ejecutar seeds si está habilitado y no se debe saltar
if [ "$SKIP_DB_SETUP" != "true" ] && [ "$RUN_SEEDS" = "true" ]; then
  echo "🌱 Ejecutando seeds de normalización..."
  
  # Limpiar datos existentes primero
  npx sequelize-cli db:seed:undo:all || echo "ℹ️  No hay datos para limpiar"
  
  # Ejecutar solo seeds de normalización
  echo "🌱 1. Tipos de empresa..."
  npx sequelize-cli db:seed --seed 20250101000005-seed-tipos-empresa.js || echo "⚠️  Seed tipos empresa falló"
  
  echo "🌱 2. Tipos de mercadería..."
  npx sequelize-cli db:seed --seed 20250101000006-seed-tipos-mercaderia.js || echo "⚠️  Seed tipos mercadería falló"
  
  echo "🌱 3. Estados..."
  npx sequelize-cli db:seed --seed 20250101000000-initial-estados.js || echo "⚠️  Seed estados falló"
  
  echo "✅ Seeds de normalización completados"
else
  echo "ℹ️  Seeds omitidos (SKIP_DB_SETUP=$SKIP_DB_SETUP, RUN_SEEDS=$RUN_SEEDS)"
fi

# Mostrar configuración
echo "🔧 Configuración: Migraciones=$RUN_MIGRATIONS, Seeds=$RUN_SEEDS"
echo "🚀 Iniciando aplicación..."

exec "$@"
