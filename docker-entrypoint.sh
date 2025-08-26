#!/bin/sh

# Esperar base de datos
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10
echo "✅ Base de datos lista"

# Ejecutar migraciones si está habilitado y no se debe saltar
if [ "$SKIP_DB_SETUP" = "false" ] && [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🔄 Ejecutando migraciones..."
  npx sequelize-cli db:migrate || echo "⚠️  Algunas migraciones fallaron"
else
  echo "ℹ️  Migraciones omitidas (SKIP_DB_SETUP=$SKIP_DB_SETUP, RUN_MIGRATIONS=$RUN_MIGRATIONS)"
fi

# Ejecutar seeds si está habilitado y no se debe saltar
if [ "$SKIP_DB_SETUP" = "false" ] && [ "$RUN_SEEDS" = "true" ]; then
  echo "🌱 Ejecutando seeds..."
  
  # Limpiar datos existentes primero
  npx sequelize-cli db:seed:undo:all || echo "ℹ️  No hay datos para limpiar"
  
  # Ejecutar seeds en orden
  echo "🌱 1. Tipos de empresa..."
  npx sequelize-cli db:seed --seed 20250101000005-seed-tipos-empresa.js || echo "⚠️  Seed tipos empresa falló"
  
  echo "🌱 2. Tipos de mercadería..."
  npx sequelize-cli db:seed --seed 20250101000006-seed-tipos-mercaderia.js || echo "⚠️  Seed tipos mercadería falló"
  
  echo "🌱 3. Estados..."
  npx sequelize-cli db:seed --seed 20250101000000-initial-estados.js || echo "⚠️  Seed estados falló"
  
  echo "🌱 4. Clientes demo..."
  npx sequelize-cli db:seed --seed 20250101000001-demo-clientes.js || echo "⚠️  Seed clientes falló"
  
  echo "🌱 5. Destinos demo..."
  npx sequelize-cli db:seed --seed 20250101000002-demo-destinos.js || echo "⚠️  Seed destinos falló"
  
  echo "🌱 6. Contactos demo..."
  npx sequelize-cli db:seed --seed 20250101000003-demo-contactos.js || echo "⚠️  Seed contactos falló"
  
  echo "🌱 7. Mercaderías demo..."
  npx sequelize-cli db:seed --seed 20250101000004-demo-mercaderias-remitos.js || echo "⚠️  Seed mercaderías falló"
  
  echo "✅ Seeds completados"
else
  echo "ℹ️  Seeds omitidos (SKIP_DB_SETUP=$SKIP_DB_SETUP, RUN_SEEDS=$RUN_SEEDS)"
fi

# Mostrar configuración
echo "🔧 Configuración: Migraciones=$RUN_MIGRATIONS, Seeds=$RUN_SEEDS"
echo "🚀 Iniciando aplicación..."

exec "$@"
