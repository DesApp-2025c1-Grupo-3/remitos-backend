#!/bin/sh

# Función para esperar la base de datos
wait_for_db() {
  echo "⏳ Esperando a que la base de datos esté lista..."
  # En Render, la base de datos puede tardar más en estar lista
  sleep 15
  echo "✅ Base de datos lista"
}

# Ejecutar migraciones usando nuestro script personalizado
run_migrations() {
  echo "🔄 Ejecutando migraciones..."
  node scripts/migrate-prod.js || echo "⚠️  Algunas migraciones fallaron"
}

# Ejecutar seeds de normalización
run_seeds() {
  echo "🌱 Ejecutando seeds de normalización..."
  node scripts/seed-prod.js || echo "⚠️  Algunos seeds fallaron"
}

# Verificar si se debe poblar la base de datos
should_populate_db() {
  if [ "$POPULATE_DB" = "true" ]; then
    echo "✅ POPULATE_DB está configurado como true - se poblará la base de datos"
    return 0
  else
    echo "❌ POPULATE_DB no está configurado como true - NO se poblará la base de datos"
    return 1
  fi
}

# Ejecutar funciones
wait_for_db
run_migrations

# Solo ejecutar seeds si la variable de entorno lo indica
if should_populate_db; then
  run_seeds
else
  echo "ℹ️  Saltando seeds - POPULATE_DB no está configurado como true"
fi

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec "$@"
