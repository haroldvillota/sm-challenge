# README - Squadmakers Challenge for Backend - LLM Engineer

## Descripción

## Modulo chistes

Obtiene chistes aleatorios de:

1. API de Chuck Norris (https://api.chucknorris.io)
2. API de Dad Jokes (https://icanhazdadjoke.com/api)

CRUD completo para gestión de chistes locales

Hace 5 combinacines de chistes de chuck y dad

## Modulo matemático

Esta API proporciona servicios matemáticos básicos a través de endpoints RESTful. Actualmente incluye funcionalidades para:

1. Calcular el Mínimo Común Múltiplo (MCM) de una lista de números
2. Incrementar un número en 1

La API está construida con Node.js, Express, TypeScript y sigue buenas prácticas de desarrollo como separación de responsabilidades, validación de entradas y manejo adecuado de errores.

## Requisitos

- Node.js (v16 o superior)
- npm o yarn
- TypeScript
- Base de datos SQL (configurable) Listo para PostresQL

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [url-del-repositorio]
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configurar variables de entorno (si aplica):
   ```bash
   cp .env.example .env
   ```

4. Compilar TypeScript:
   ```bash
   npm run build
   ```

## Ejecución

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

Para producción:
```bash
npm start
```

## Endpoints Disponibles

### Módulo de Chistes (`/joke`)

#### 1. Obtener chiste aleatorio
**Endpoint:** `GET /joke`  
**Descripción:** Devuelve un chiste aleatorio de cualquier fuente disponible  
**Respuesta exitosa (200):**
```json
{
  "value": "Chiste aleatorio",
  "source": "random"
}
```

#### 2. Obtener chiste por fuente específica
**Endpoint:** `GET /joke/:source`  
**Parámetros:**
- `source`: Fuente del chiste (`chuck` o `dad`)

**Respuesta exitosa (200):**
```json
{
  "value": "Chiste específico de la fuente solicitada",
  "source": "chuck|dad"
}
```

**Respuesta de error (400):**
```json
{
  "errors": [
    {
      "message": "Invalid source parameter"
    }
  ]
}
```

#### 3. Crear nuevo chiste
**Endpoint:** `POST /joke`  
**Body:**
```json
{
  "value": "Texto del nuevo chiste"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": 123,
  "value": "Texto del nuevo chiste",
  "createdAt": "2023-05-20T12:00:00Z"
}
```

#### 4. Actualizar chiste existente
**Endpoint:** `PUT /joke`  
**Parámetros query:**
- `number`: ID del chiste a actualizar
- `value`: Nuevo texto del chiste

**Respuesta exitosa (200):**
```json
{
  "id": 123,
  "value": "Texto actualizado del chiste",
  "updatedAt": "2023-05-20T12:05:00Z"
}
```

#### 5. Eliminar chiste
**Endpoint:** `DELETE /joke`  
**Parámetro query:**
- `number`: ID del chiste a eliminar

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Joke deleted successfully"
}
```

#### 6. Combinar chiste

**Endpoint:** `GET /jokes/combined`  
**Descripción:** Obtiene 5 pares de chistes combinados (Chuck Norris + Dad Joke)
**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Combined jokes retrieved successfully",
  "data": [
    {
      "chuck": "Chuck Norris can divide by zero.",
      "dad": "Why don't scientists trust atoms? Because they make up everything.",
      "combined": "Chuck Norris can divide by zero, just like atoms make up everything in science."
    },
    ...
  ]
}
```

### Módulo de matemáticas (`/math`)

#### 1. Cálculo de MCM

**Endpoint:** `GET /mcm`

**Parámetro:**
- `numbers`: Lista de números enteros positivos separados por comas

**Ejemplo:**
```bash
GET /mcm?numbers=4,6,8
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "MCM calculated successfully",
  "data": 24
}
```

#### 2. Incrementar número

**Endpoint:** `GET /increment`

**Parámetro:**
- `number`: Número entero positivo a incrementar

**Ejemplo:**
```bash
GET /increment?number=5
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Number incremented successfully",
  "data": 6
}
```


## Ejemplos de Uso

### Obtener chiste aleatorio
```bash
curl -X GET http://localhost:8080/joke
```

### Obtener chiste de Chuck Norris
```bash
curl -X GET http://localhost:8080/joke/chuck
```

### Crear nuevo chiste
```bash
curl -X POST http://localhost:8080/joke \
  -H "Content-Type: application/json" \
  -d '{"value":"¿Qué hace un libro de matemáticas en la playa? Se hace una integral"}'
```

### Actualizar chiste
```bash
curl -X PUT "http://localhost:8080/joke?number=123&value=Nuevo%20texto%20del%20chiste"
```

### Eliminar chiste
```bash
curl -X DELETE "http://localhost:8080/joke?number=123"
```

### Obtener combinaciones de chistes
```bash
curl -X GET http://localhost:8080/jokes/combined
```

### Calcular Máximo común múltiplo
```bash
curl -X GET "http://localhost:8080/math/mcm?numbers=5,2,7"
```

### Incrementar en uno
```bash
curl -X GET "http://localhost:8080/math/increment?number=100"
```


## Pruebas

El proyecto incluye pruebas unitarias e integrales usando Vitest y Supertest.

Para ejecutar las pruebas:
```bash
npm test
```

Para cobertura de pruebas:
```bash
npm run test:coverage
```

## Documentación API

La documentación OpenAPI/Swagger está disponible en `/api-docs` cuando el servidor está en ejecución.

## Variables de Entorno Actualizadas

### Configuración del Servidor

- `NODE_ENV`: Entorno de ejecución (opciones: `development`, `production`)
  ```env
  NODE_ENV="development"
  ```

- `PORT`: Puerto donde se ejecutará la aplicación
  ```env
  PORT="8080"
  ```

- `HOST`: Hostname del servidor
  ```env
  HOST="localhost"
  ```

### Configuración CORS

- `CORS_ORIGIN`: Orígenes permitidos para CORS (usar `*` para desarrollo)
  ```env
  CORS_ORIGIN="http://localhost:*"
  ```

### Limitación de Tasa (Rate Limiting)

- `COMMON_RATE_LIMIT_WINDOW_MS`: Ventana de tiempo para limitación de tasa en milisegundos
  ```env
  COMMON_RATE_LIMIT_WINDOW_MS="1000"
  ```

- `COMMON_RATE_LIMIT_MAX_REQUESTS`: Máximo número de peticiones por ventana de tiempo por IP
  ```env
  COMMON_RATE_LIMIT_MAX_REQUESTS="20"
  ```

### Configuración de Base de Datos

- `DB_USER`: Usuario de la base de datos
  ```env
  DB_USER="myLocalUser"
  ```

- `DB_HOST`: Host de la base de datos
  ```env
  DB_HOST="localhost"
  ```

- `DB_NAME`: Nombre de la base de datos
  ```env
  DB_NAME="myLocalDb"
  ```

- `DB_PASSWORD`: Contraseña de la base de datos
  ```env
  DB_PASSWORD="myLocalPassword"
  ```

- `DB_PORT`: Puerto de la base de datos
  ```env
  DB_PORT="5432"
  ```

- `OPENAI_API_KEY`: Key de OpenApi
  ```env
  OPENAI_API_KEY="myOpenApiKey"
  ```