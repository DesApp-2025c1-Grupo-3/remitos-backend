#!/bin/sh

echo "🚀 Iniciando configuración de la aplicación..."

# Ejecutar configuración de base de datos
echo "⚙️  Configurando base de datos..."
node scripts/setup-database.js

if [ $? -eq 0 ]; then
  echo "✅ Configuración de base de datos completada exitosamente"
else
  echo "❌ Error en la configuración de base de datos"
  exit 1
fi

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec "$@"
