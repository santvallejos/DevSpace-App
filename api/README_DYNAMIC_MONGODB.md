# DevSpace API - Header-Based MongoDB Connection

## Descripción
La API DevSpace ahora soporta conexiones dinámicas a diferentes bases de datos MongoDB mediante headers HTTP. Esto permite que múltiples usuarios utilicen la misma API conectándose a sus propias bases de datos.

## Headers Requeridos

### X-MongoDB-Connection (Requerido)
La connection string de tu base de datos MongoDB.

**Formato:**
```
X-MongoDB-Connection: mongodb://usuario:password@host:puerto/database
```

**Ejemplos:**
```
# MongoDB Atlas
X-MongoDB-Connection: mongodb+srv://usuario:password@cluster.mongodb.net/

# MongoDB Local
X-MongoDB-Connection: mongodb://localhost:27017/

# MongoDB con autenticación
X-MongoDB-Connection: mongodb://usuario:password@localhost:27017/
```

### X-MongoDB-Database (Opcional)
Nombre de la base de datos a utilizar. Si no se proporciona, se usará "Unity" por defecto.

**Formato:**
```
X-MongoDB-Database: nombre_de_tu_base_de_datos
```

## Ejemplos de Uso

### 1. Usando cURL

```bash
# Obtener todas las carpetas
curl -X GET "http://localhost:5000/api/folder" \
  -H "X-MongoDB-Connection: mongodb+srv://usuario:password@cluster.mongodb.net/" \
  -H "X-MongoDB-Database: mi_base_de_datos" \
  -H "Content-Type: application/json"

# Crear una nueva carpeta
curl -X POST "http://localhost:5000/api/folder" \
  -H "X-MongoDB-Connection: mongodb+srv://usuario:password@cluster.mongodb.net/" \
  -H "X-MongoDB-Database: mi_base_de_datos" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Nueva Carpeta",
    "parentFolderID": null
  }'
```

### 2. Usando JavaScript/Fetch

```javascript
const headers = {
  'Content-Type': 'application/json',
  'X-MongoDB-Connection': 'mongodb+srv://usuario:password@cluster.mongodb.net/',
  'X-MongoDB-Database': 'mi_base_de_datos'
};

// Obtener recursos
fetch('http://localhost:5000/api/resource', {
  method: 'GET',
  headers: headers
})
.then(response => response.json())
.then(data => console.log(data));

// Crear un nuevo recurso
fetch('http://localhost:5000/api/resource', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify({
    name: 'Mi Recurso',
    url: 'https://ejemplo.com',
    description: 'Descripción del recurso',
    type: 'URL'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 3. Usando Python/Requests

```python
import requests

headers = {
    'Content-Type': 'application/json',
    'X-MongoDB-Connection': 'mongodb+srv://usuario:password@cluster.mongodb.net/',
    'X-MongoDB-Database': 'mi_base_de_datos'
}

# Obtener todas las carpetas
response = requests.get('http://localhost:5000/api/folder', headers=headers)
carpetas = response.json()

# Crear una nueva carpeta
nueva_carpeta = {
    'name': 'Carpeta desde Python',
    'parentFolderID': None
}

response = requests.post('http://localhost:5000/api/folder', 
                        json=nueva_carpeta, 
                        headers=headers)
```

## Configuración de Base de Datos

### Estructura Requerida
Tu base de datos MongoDB debe tener las siguientes colecciones:

1. **Folders** - Para almacenar carpetas
2. **Resources** - Para almacenar recursos

### Esquema de Documentos

#### Folder
```json
{
  "_id": "ObjectId",
  "name": "string",
  "parentFolderID": "string | null",
  "subFolders": ["string"],
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

#### Resource
```json
{
  "_id": "ObjectId",
  "name": "string",
  "url": "string",
  "description": "string",
  "type": "string",
  "folderId": "string | null",
  "favorite": "boolean",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

## Manejo de Errores

### Errores Comunes

#### 400 Bad Request
- Connection string vacía o inválida
- Headers mal formateados

#### 500 Internal Server Error
- No se pudo establecer conexión con la base de datos
- Connection string incorrecta
- Problemas de autenticación con MongoDB

#### Ejemplo de Respuesta de Error
```json
{
  "error": "Invalid MongoDB connection string",
  "statusCode": 400
}
```

## Consideraciones de Seguridad

1. **HTTPS Requerido:** Siempre usa HTTPS en producción para proteger las connection strings
2. **Validación:** La API valida automáticamente las connection strings antes de usarlas
3. **Cache:** Las conexiones se almacenan en cache para mejorar el rendimiento
4. **Límites:** Implementa rate limiting en tu cliente para evitar sobrecargar la API

## Fallback a Conexión por Defecto

Si no proporcionas los headers de MongoDB, la API utilizará la conexión por defecto configurada en el servidor. Esto es útil para:
- Testing
- Usuarios que prefieren usar una base de datos compartida
- Desarrollo local

## Testing

Puedes probar la funcionalidad usando herramientas como:
- Postman
- Insomnia
- Thunder Client (VS Code)
- cURL

Asegúrate de incluir los headers apropiados en todas tus peticiones.
