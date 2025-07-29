# Configuración de MongoDB Atlas

Este proyecto ha sido migrado para usar MongoDB Atlas en la nube. Sigue estos pasos para configurar la conexión:

## Pasos para configurar MongoDB Atlas

### 1. Crear una cuenta en MongoDB Atlas
- Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crea una cuenta gratuita o inicia sesión

### 2. Crear un cluster
- Crea un nuevo cluster (puedes usar el tier gratuito M0)
- Selecciona la región más cercana a tu ubicación
- Espera a que el cluster se despliegue

### 3. Configurar acceso a la base de datos
- Ve a "Database Access" en el panel lateral
- Crea un nuevo usuario de base de datos
- Asigna permisos de lectura y escritura
- **Guarda el username y password** para usarlos en la configuración

### 4. Configurar acceso de red
- Ve a "Network Access" en el panel lateral
- Añade tu dirección IP actual
- Para desarrollo, puedes usar `0.0.0.0/0` (permite acceso desde cualquier IP)

### 5. Obtener la cadena de conexión
- Ve a "Clusters" y haz clic en "Connect"
- Selecciona "Connect your application"
- Copia la cadena de conexión (connection string)

### 6. Configurar la aplicación
Actualiza los archivos de configuración con tu cadena de conexión:

#### En `appsettings.json`:
```json
{
  "MongoDB": {
    "ConnectionString": "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority",
    "DatabaseName": "Unity"
  }
}
```

#### En `appsettings.Development.json`:
```json
{
  "MongoDB": {
    "ConnectionString": "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority",
    "DatabaseName": "Unity"
  }
}
```

**Importante:** Reemplaza:
- `<username>` con tu nombre de usuario de MongoDB Atlas
- `<password>` con tu contraseña de MongoDB Atlas
- `<cluster>` con el nombre de tu cluster

## 🔧 Configuración de Variables de Entorno (Recomendado para Producción)

La aplicación ahora soporta variables de entorno con **prioridad sobre la configuración de archivos**:

### Variables Disponibles:
- `MONGODB_CONNECTION_STRING`: Cadena de conexión a MongoDB Atlas
- `MONGODB_DATABASE_NAME`: Nombre de la base de datos (opcional, por defecto "Unity")

### Orden de Prioridad:
1. **Variables de entorno** (más alta prioridad)
2. **appsettings.json** / **appsettings.Development.json**
3. **Valor por defecto** ("Unity" para database name)

### Configuración con Variables de Entorno:

#### Opción 1: Usando el script de ejemplo
```bash
# Copia y edita el script de ejemplo
cp setup-env.example.sh setup-env.sh

# Edita setup-env.sh con tus credenciales reales
nano setup-env.sh

# Ejecuta el script
source setup-env.sh

# Ejecuta la aplicación
dotnet run
```

#### Opción 2: Configuración manual
```bash
# Configura las variables de entorno
export MONGODB_CONNECTION_STRING="mongodb+srv://tu-usuario:tu-password@tu-cluster.mongodb.net/?retryWrites=true&w=majority"
export MONGODB_DATABASE_NAME="Unity"
export ASPNETCORE_ENVIRONMENT="Development"

# Ejecuta la aplicación
dotnet run
```

#### Opción 3: Archivo .env (para desarrollo local)
Crea un archivo `.env` en el directorio `api/` (ya está en .gitignore):
```env
MONGODB_CONNECTION_STRING=mongodb+srv://tu-usuario:tu-password@tu-cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE_NAME=Unity
ASPNETCORE_ENVIRONMENT=Development
```

### ⚠️ Importante para Producción:
- **NUNCA** hardcodees credenciales en el código
- **SIEMPRE** usa variables de entorno en producción
- **NUNCA** commites archivos con credenciales reales

## Migración de datos existentes

Si tienes datos en MongoDB local, puedes migrarlos usando MongoDB Compass o mongodump/mongorestore:

### Usando MongoDB Compass:
1. Conecta a tu base de datos local
2. Exporta las colecciones
3. Conecta a MongoDB Atlas
4. Importa las colecciones

### Usando mongodump/mongorestore:
```bash
# Exportar desde local
mongodump --host localhost:27017 --db Unity --out ./backup

# Importar a Atlas
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/" --db Unity ./backup/Unity
```

## Verificación

Una vez configurado, ejecuta la aplicación y verifica:
1. Que no hay errores de conexión en los logs
2. Que las colecciones se crean automáticamente en MongoDB Atlas
3. Que puedes realizar operaciones CRUD a través de la API

## Beneficios de MongoDB Atlas

- **Escalabilidad automática**: Se ajusta según la demanda
- **Backups automáticos**: Copias de seguridad regulares
- **Monitoreo**: Métricas y alertas en tiempo real
- **Seguridad**: Encriptación y controles de acceso
- **Disponibilidad global**: Réplicas en múltiples regiones