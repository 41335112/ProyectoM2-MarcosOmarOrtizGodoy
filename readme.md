# MiniBlog API

API RESTful desarrollada con **Node.js**, **Express** y **PostgreSQL** (`pg`) para administrar **autores (`authors`)** y **publicaciones (`posts`)**. Implementa consultas SQL parametrizadas para prevenir inyección SQL, validación de datos de entrada, manejo estandarizado de códigos HTTP (`200`, `201`, `400`, `404`, `500`), pruebas de integración automatizadas con `supertest`.

---

## Tabla de contenidos

1. [Tecnologías y herramientas](#tecnologías-y-herramientas)
2. [Arquitectura y estructura del proyecto](#arquitectura-y-estructura-del-proyecto)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación y configuración en local](#instalación-y-configuración-en-local)
5. [Modelo de datos (PostgreSQL)](#modelo-de-datos-postgresql)
6. [Documentación de Endpoints](#documentación-de-endpoints)
7. [Pruebas automatizadas](#pruebas-automatizadas)
8. [Documentación OpenAPI](#documentación-openapi)
9. [Despliegue en Railway](#despliegue-en-railway)
10. [Registro de uso de IA](#registro-de-uso-de-ia)

---

## Tecnologías y herramientas

* **Entorno de ejecución:** Node.js (v20+)
* **Framework web:** Express
* **Base de datos relacional:** PostgreSQL (cliente `pg` con `Pool` de conexiones)
* **Variables de entorno:** `node:process` (`loadEnvFile`) / `.env`
* **Testing:** `supertest` + runner nativo `node:test` (`node:assert/strict`)
* **Documentación de API:** OpenAPI 3.0 (`openapi.yaml`)
* **Control de versiones:** Git y GitHub
* **Infraestructura / Deploy:** Railway

---

## Arquitectura y estructura del proyecto

El proyecto separa la configuración de red, el acceso a base de datos, las validaciones de entrada, los controladores de rutas y las pruebas automatizadas:

```text
ProyectoM2/
├── db/
│   ├── config.js           # Configuración y exportación del Pool de PostgreSQL
│   └── setup.sql           # Ayuda al realway
├── validaciones/
│   ├── validateAuthor.js    # Validaciones de IDs y campos de authors (name, email, bio)
│   └── validatePost.js      # Validaciones de IDs y campos de posts (title, content, author_id, published)
├── router/
│   ├── authors.js           # Endpoints CRUD para el recurso /authors
│   └── posts.js             # Endpoints CRUD para el recurso /posts
├── test/
│   ├── authors.test.js      # Tests HTTP para crear/obtener autores y validar emails únicos
│   └── posts.test.js        # Tests HTTP para crear posts, validar campos y borrar inexistentes
├── app.js                   # Instancia de Express, middlewares globales y montaje de rutas
├── server.js                # Punto de entrada que levanta el servidor HTTP en el puerto configurado
├── .env.example             # Plantilla de variables de entorno requeridas
├── .gitignore               # Archivos excluidos del repositorio (node_modules, .env)
├── package.json             # Dependencias y scripts (start, test)
└── README.md                # Documentación general del proyecto
```

---

## Requisitos previos

* **Node.js** versión 20 o superior.
* **PostgreSQL** versión 14 o superior instalado y ejecutándose localmente (o una instancia en la nube).
* **Git** para clonar el repositorio.

---

## Instalación y configuración en local

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone [https://github.com/TU_USUARIO/TU_REPO.git](https://github.com/TU_USUARIO/TU_REPO.git)
cd TU_REPO
npm install
```

### 2. Configurar las variables de entorno
Creá un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/miniblog_db
```

> **Nota de seguridad:** El archivo `.env` está incluido en `.gitignore` y nunca debe subirse al repositorio.

### 3. Crear la base de datos y las tablas
Creá la base de datos en PostgreSQL (por ejemplo `miniblog_db`) y ejecutá el siguiente script SQL para generar las tablas `authors` y `posts` con sus restricciones:

```sql
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```
### 4. Iniciar el servidor en desarrollo/local
```bash
npm start
```
El servidor quedará escuchando en `http://localhost:3000`.

---

## Modelo de datos (PostgreSQL)

* **`authors`**: almacena los autores del blog.
  * `id` (`SERIAL PRIMARY KEY`): identificador único autoincremental.
  * `name` (`VARCHAR`, obligatorio): nombre del autor.
  * `email` (`VARCHAR`, obligatorio y `UNIQUE`): correo electrónico único.
  * `bio` (`TEXT`, opcional): biografía breve.
  * `created_at` (`TIMESTAMP`): fecha y hora de creación.
* **`posts`**: almacena las publicaciones asociadas a un autor (`1:N`).
  * `id` (`SERIAL PRIMARY KEY`): identificador único autoincremental.
  * `title` (`VARCHAR`, obligatorio): título de la publicación.
  * `content` (`TEXT`, obligatorio): contenido del artículo.
  * `author_id` (`INTEGER`, `FOREIGN KEY -> authors(id)`): identificador del autor dueño del post.
  * `published` (`BOOLEAN`, por defecto `false`): indica si está publicado o en borrador.
  * `created_at` (`TIMESTAMP`): fecha y hora de creación.

---

## Documentación de Endpoints

### Recursos de Autores (`/authors`)

| Método | Ruta | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/authors` | Lista todos los autores ordenados por `id` | `200`, `500` |
| `GET` | `/authors/:id` | Obtiene el detalle de un autor por su `id` | `200`, `400`, `404`, `500` |
| `POST` | `/authors` | Crea un nuevo autor (`name` y `email` obligatorios) | `201`, `400`, `500` |
| `PUT` | `/authors/:id` | Actualiza parcialmente o totalmente un autor existente | `200`, `400`, `404`, `500` |
| `DELETE` | `/authors/:id` | Elimina un autor por su `id` | `200`, `400`, `404`, `500` |

#### Ejemplo: Crear un autor (`POST /authors`)
**Request Body (`application/json`):**
```json
{
  "name": "Ana García",
  "email": "ana@example.com",
  "bio": "Desarrolladora backend especializada en Node.js"
}
```

**Response (`201 Created`):**
```json
{
  "id": 1,
  "name": "Ana García",
  "email": "ana@example.com",
  "bio": "Desarrolladora backend especializada en Node.js",
  "created_at": "2026-11-26T03:00:00.000Z"
}
```

---

### Recursos de Publicaciones (`/posts`)

| Método | Ruta | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts` | Lista todas las publicaciones ordenadas por `id` | `200`, `500` |
| `GET` | `/posts/author/:authorId` | Obtiene el detalle de un autor y todos sus posts | `200`, `400`, `404`, `500` |
| `GET` | `/posts/:id` | Obtiene el detalle de un post por su `id` | `200`, `400`, `404`, `500` |
| `POST` | `/posts` | Crea un nuevo post (`title`, `content` y `author_id` obligatorios) | `201`, `400`, `500` |
| `PUT` | `/posts/:id` | Actualiza un post existente | `200`, `400`, `404`, `500` |
| `DELETE` | `/posts/:id` | Elimina un post por su `id` | `200`, `400`, `404`, `500` |

#### Ejemplo: Crear un post (`POST /posts`)
**Request Body (`application/json`):**
```json
{
  "title": "Introducción a Express y PostgreSQL",
  "content": "En este artículo vemos cómo conectar Express usando consultas parametrizadas.",
  "author_id": 1,
  "published": true
}
```

**Response (`201 Created`):**
```json
{
  "id": 1,
  "title": "Introducción a Express y PostgreSQL",
  "content": "En este artículo vemos cómo conectar Express usando consultas parametrizadas.",
  "author_id": 1,
  "published": true,
  "created_at": "2026-11-26T03:05:00.000Z"
}
```

### Validaciones y manejo de errores implementados
* **Parámetros `:id`:** se verifica que sean números enteros positivos; de lo contrario retorna `400 Bad Request`.
* **Campos obligatorios:** `name` y `email` en `authors`; `title`, `content` y `author_id` en `posts` (rechazando cadenas vacías o solo espacios con `400`).
* **Restricción de unicidad (`23505`):** si se intenta registrar o actualizar un `email` ya existente en PostgreSQL, se retorna `400 Bad Request`.
* **Integridad referencial (`23503`):** si se envía un `author_id` que no existe en la tabla `authors`, se retorna `400 Bad Request`.
* **Recurso no encontrado:** cualquier búsqueda, edición o eliminación sobre un `id` inexistente retorna `404 Not Found`.

---

## Pruebas automatizadas

Las pruebas de integración están escritas con `supertest` y el módulo nativo `node:test`, probando directamente la instancia `app.js` contra la base de datos PostgreSQL y limpiando los registros generados al finalizar (`after`).

Para ejecutar la suite completa de tests:

```bash
npm test
```

**Casos cubiertos:**
* Creación exitosa de un autor (`201`) y verificación de los datos devueltos.
* Rechazo de registro con `email` duplicado (`400`).
* Consulta de un autor por ID (`200`) y respuesta ante ID inexistente (`404`).
* Creación exitosa de un post asociado a un autor válido (`201`).
* Rechazo de creación de post con `title` o `content` vacíos (`400`).
* Intento de eliminación de un post inexistente (`404`).


## Despliegue en Railway

**URL pública de producción:** `proyectom2-marcosomarortizgodoy-production.up.railway.app` 

### Pasos realizados para el despliegue
1. **Creación del proyecto y base de datos:** en Railway se creó un proyecto nuevo y se añadió un servicio de **PostgreSQL**.

2. **Diferencia entre Internal URL y Public URL:**
   * **Public URL:** utilizada desde el entorno local (`psql` / cliente SQL) para conectarse externamente a la base de datos de Railway y ejecutar el script de creación de tablas (`authors` y `posts`).
   * **Internal URL:** configurada en la variable `DATABASE_URL` del servicio de Node.js para que la API se comunique con PostgreSQL dentro de la red privada de Railway sin latencia ni exposición pública innecesaria.

3. **Despliegue continuo desde GitHub:** se vinculó el repositorio de GitHub al proyecto de Railway configurando las variables de entorno `DATABASE_URL` y `NODE_ENV=production` (Railway inyecta automáticamente `PORT`).
4. **Dominio público:** en *Settings -> Networking* se generó el dominio público HTTPS para consumir la API desde cualquier cliente HTTP.

---

## Registro de uso de IA

Durante el desarrollo de este proyecto se empleó asistencia de inteligencia artificial como herramienta de apoyo para:

1. **Modularización y validaciones:** organización de middlewares independientes (`validateAuthor.js` y `validatePost.js`) para validar campos obligatorios, formatos de IDs y sanitización básica de strings (`trim`, `toLowerCase`).
2. **Manejo de errores de PostgreSQL y códigos HTTP:** mapeo de códigos nativos de PostgreSQL (`23505` para violación de restricción `UNIQUE` en emails y `23503` para violación de clave foránea en `author_id`) hacia respuestas HTTP `400` con mensajes descriptivos.
3. **Pruebas de integración:** estructuración de los tests con `supertest` y `node:test`, incluyendo el ciclo de vida (`before`/`after`) para insertar datos de prueba, limpiar registros y cerrar el `Pool` de conexiones al finalizar.


