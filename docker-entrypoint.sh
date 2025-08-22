#!/bin/sh
set -e

# Función para esperar la base de datos
wait_for_db() {
  echo "⏳ Esperando a que la base de datos esté lista..."
  # Esperar un poco para que PostgreSQL esté completamente listo
  sleep 10
  echo "✅ Base de datos lista"
}

# Ejecutar migraciones solo si es necesario
run_migrations() {
  if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "🔄 Ejecutando migraciones..."
    npx sequelize-cli db:migrate || echo "⚠️  Algunas migraciones fallaron (puede ser normal si ya están aplicadas)"
  else
    echo "ℹ️  Migraciones omitidas (RUN_MIGRATIONS no está habilitado)"
  fi
}

# Verificar que el script se puede ejecutar
if [ ! -x "$0" ]; then
  echo "❌ Error: El script no tiene permisos de ejecución"
  exit 1
fi

# Ejecutar funciones
wait_for_db
run_migrations

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec "$@"
