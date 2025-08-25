#!/bin/sh

# Función para esperar la base de datos
wait_for_db() {
  echo "⏳ Esperando a que la base de datos esté lista..."
  until pg_isready -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USERNAME"; do
    echo "⏳ PostgreSQL no listo, esperando 2s..."
    sleep 2
  done
  echo "✅ Base de datos lista"
}

# Ejecutar migraciones
run_migrations() {
  echo "🔄 Ejecutando migraciones..."
  npx sequelize-cli db:migrate || echo "⚠️  Algunas migraciones fallaron (puede ser normal si ya están aplicadas)"
}

# Limpiar datos existentes si es necesario
clean_existing_data() {
  if [ "$NODE_ENV" = "development" ] && [ "$RUN_SEEDS" = "true" ]; then
    echo "🧹 Limpiando datos existentes..."
    npx sequelize-cli db:seed:undo:all || echo "ℹ️  No hay datos para limpiar"
  fi
}

# Ejecutar seeds si es necesario
run_seeds() {
  if [ "$NODE_ENV" = "development" ] && [ "$RUN_SEEDS" = "true" ]; then
    echo "🌱 Ejecutando seeds..."
    # Limpiar datos existentes primero
    clean_existing_data
    # Ejecutar seeds con manejo de errores
    npx sequelize-cli db:seed:all || echo "⚠️  Algunos seeds fallaron (puede ser normal si los datos ya existen)"
  else
    echo "ℹ️  Seeds omitidos (RUN_SEEDS no está habilitado)"
  fi
}

# Ejecutar funciones
wait_for_db
run_migrations
run_seeds

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec "$@"
