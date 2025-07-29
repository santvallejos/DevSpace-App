#!/bin/bash

# Script para configurar variables de entorno para MongoDB Atlas
# Copia este archivo como setup-env.sh y actualiza con tus credenciales

# IMPORTANTE: No subas este archivo a control de versiones con credenciales reales
# Añade setup-env.sh a tu .gitignore

# Configuración de MongoDB Atlas
export MONGODB_CONNECTION_STRING="mongodb+srv://tu-usuario:tu-password@tu-cluster.mongodb.net/?retryWrites=true&w=majority"
export MONGODB_DATABASE_NAME="Unity"

# Opcional: Configuración adicional
export ASPNETCORE_ENVIRONMENT="Development"

echo "Variables de entorno configuradas para MongoDB Atlas"
echo "Conexión: $MONGODB_CONNECTION_STRING"
echo "Base de datos: $MONGODB_DATABASE_NAME"
echo "Entorno: $ASPNETCORE_ENVIRONMENT"

# Para usar este script:
# 1. Copia este archivo: cp setup-env.example.sh setup-env.sh
# 2. Edita setup-env.sh con tus credenciales reales
# 3. Ejecuta: source setup-env.sh
# 4. Ejecuta tu aplicación: dotnet run