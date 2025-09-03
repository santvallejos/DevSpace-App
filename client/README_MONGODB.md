# DevSpace Client - Configuración de MongoDB Personal

## Nueva Funcionalidad: Conexión a MongoDB Personal

DevSpace Client ahora soporta la conexión a tu propia base de datos MongoDB, permitiéndote mantener tus recursos en tu propia infraestructura mientras usas la aplicación.

## Características Implementadas

### 🔧 Configuración Dinámica
- Configuración de connection string y nombre de base de datos
- Almacenamiento seguro en localStorage (persistente)
- Validación automática de connection strings
- Indicador visual del estado de conexión

### 🔄 Modo Híbrido
- **Conexión Personal**: Usa tu propia base de datos MongoDB
- **Conexión por Defecto**: Usa la base de datos compartida del servidor
- Cambio dinámico sin necesidad de reiniciar la aplicación

### 🛡️ Seguridad
- Los headers se envían automáticamente con cada request
- Validación de formato de connection string
- Enmascaramiento de passwords en la interfaz
- Comunicación HTTPS en producción

## Cómo Usar

### 1. Configurar tu Base de Datos

Haz clic en el botón de estado de conexión en el sidebar izquierdo:
- **"Conexión por defecto"** (naranja): Si no tienes configurada una base de datos personal
- **"Base de datos personal"** (verde): Si ya tienes una configurada

### 2. Proporcionar Connection String

En el modal de configuración, ingresa:

**MongoDB Atlas:**
```
mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/
```

**MongoDB Local:**
```
mongodb://localhost:27017/
```

**MongoDB con Autenticación:**
```
mongodb://usuario:password@host:27017/
```

### 3. Configurar Base de Datos (Opcional)

- Por defecto se usa "Unity"
- Puedes cambiar al nombre que prefieras
- La aplicación creará las colecciones automáticamente

## Estructura de Base de Datos

Tu base de datos MongoDB debe tener (o tendrá) estas colecciones:

### Folders
```javascript
{
  "_id": ObjectId,
  "name": "string",
  "parentFolderID": "string | null",
  "subFolders": ["string"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Resources
```javascript
{
  "_id": ObjectId,
  "name": "string",
  "url": "string",
  "description": "string",
  "type": "string",
  "folderId": "string | null",
  "favorite": "boolean",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

## Ventajas de Usar tu Propia Base de Datos

### 🔒 **Control Total**
- Tus datos permanecen en tu infraestructura
- Control completo sobre backups y seguridad
- Sin límites de almacenamiento

### 🚀 **Rendimiento**
- Latencia optimizada según tu ubicación
- Configuración personalizada de MongoDB
- Escalabilidad según tus necesidades

### 💾 **Persistencia**
- Datos seguros en tu cuenta MongoDB
- Acceso desde cualquier instancia de DevSpace
- Migración sencilla entre entornos

## Casos de Uso

### Desarrollo Personal
```bash
# Desarrollo local
mongodb://localhost:27017/
Database: development_devspace
```

### Producción
```bash
# MongoDB Atlas
mongodb+srv://usuario:password@cluster.mongodb.net/
Database: production_devspace
```

### Equipos
```bash
# Base de datos compartida del equipo
mongodb+srv://team:password@team-cluster.mongodb.net/
Database: team_devspace
```

## Troubleshooting

### Connection String Inválida
- Verifica el formato: debe empezar con `mongodb://` o `mongodb+srv://`
- Asegúrate de incluir usuario y password si es necesario
- Verifica que el host y puerto sean correctos

### No se Pueden Cargar los Datos
- Verifica que la base de datos sea accesible desde tu ubicación
- Confirma que tu IP esté en la whitelist de MongoDB Atlas
- Revisa las credenciales de acceso

### Error de Conexión
- Prueba la connection string directamente en MongoDB Compass
- Verifica que el servidor MongoDB esté funcionando
- Confirma que no hay firewalls bloqueando la conexión

## Migración de Datos

Si tienes datos en la base de datos por defecto y quieres migrarlos a tu base personal:

1. Exporta los datos desde la base por defecto
2. Configura tu base de datos personal
3. Importa los datos usando MongoDB tools
4. Activa la conexión personal en DevSpace

## Configuración Avanzada

### Variables de Entorno (Opcional)
```bash
# .env
VITE_API_URL=https://tu-api-devspace.com/api/
```

### Desarrollo Local
Para desarrollo, puedes usar una base de datos MongoDB local:
```bash
# Instalar MongoDB localmente
brew install mongodb/brew/mongodb-community

# Iniciar MongoDB
brew services start mongodb/brew/mongodb-community

# Connection string
mongodb://localhost:27017/
```

## Seguridad y Mejores Prácticas

1. **HTTPS Obligatorio**: Siempre usa HTTPS en producción
2. **Credenciales Seguras**: No compartas tu connection string
3. **IP Whitelist**: Configura MongoDB Atlas para aceptar solo IPs conocidas
4. **Backups Regulares**: Configura backups automáticos
5. **Monitoreo**: Supervisa el uso y rendimiento de tu base de datos

¡Disfruta de DevSpace con tu propia base de datos MongoDB! 🚀
