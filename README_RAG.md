# Diseño de un sistema RAG para consulta de decisiones tomadas en juntas comunitarias

## Resumen del flujo completo

### ETL (Extract, Transform, Load)

En esta etapa se prepara la información extraída de los archivos PDF de las actas.

* **Extract**
  *Extracción de texto PDF*: Se extrae el texto de las actas de reunión en formato PDF.

* **Transform**

  * *Parsing*: Estructuración del texto extraído según el esquema diseñado para las actas.
  * *Chunking*: División del texto en fragmentos semánticos y/o estructurales.
  * *Embedding*: Conversión de los fragmentos de texto a vectores numéricos.

* **Load**
  *Almacenamiento vectorial*: Los vectores se almacenan en ChromaDB para su posterior consulta.


### RAG (Retrieval-Augmented Generation)

En esta etapa se responden las preguntas del usuario utilizando el contexto de las actas.

* **Query Embedding**: Conversión de la pregunta del usuario en un vector.
* **Vector Search**: Búsqueda de los fragmentos más similares mediante similitud semántica.
* **Prompting**: Composición del prompt con el contexto relevante y la pregunta.
* **LLM Generation**: Generación de la respuesta usando un modelo LLM (OpenAI).


## Requisitos

Este proyecto depende de los siguientes componentes:

* **Node.js** `>=18.x`
* **npm** o **pnpm**
* **Docker** y **docker-compose**
* **Chroma DB**
  Incluido en el archivo `docker-compose.yml`, no necesitas instalarlo por separado.

### Levantar dependencias con Docker

Antes de ejecutar el pipeline ETL, debes levantar los servicios necesarios (incluido Chroma) con:

```bash
docker-compose up -d
```

Esto iniciará una instancia local de Chroma DB accesible en `http://localhost:8000`.

### Variables de entorno requeridas

Crea un archivo `.env` en la raíz del proyecto con al menos:

```env
CHROMA_URL=http://localhost:8000
OPENAI_API_KEY=sk-...
```

## Ejecución

El pipeline ETL se ejecuta desde línea de comandos, ejemplo:

```bash
npm run process-pdf ActaJuntaVecinos2024Short.pdf
npm run process-pdf ActaJuntaVecinos2024.pdf
```

El pipeline RAG se ejecuta desde línea de comandos con, ejemplo:

```bash
npm run query "Que se acordo con la piscina?"
npm run query "¿Se habló del coste eléctrico?"
```