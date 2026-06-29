# Backend Evaluación Final - Galería de Fotos

Backend simple en **Node.js + Express + Sequelize** para que los estudiantes desarrollen un frontend consumiendo una API REST.

## Contexto funcional

La aplicación permite:

- Registrar usuarios.
- Iniciar sesión.
- Crear galerías de fotos.
- Definir una galería como `public` o `private`.
- Ver galerías públicas sin iniciar sesión.
- Ver, editar y eliminar solo las galerías propias.
- Agregar fotos a una galería propia.
- Usar imágenes por URL o subir archivo de imagen.

## Tecnologías

- Node.js
- Express
- Sequelize
- SQLite por defecto
- MySQL opcional
- JWT
- Multer para subida de imágenes

## Instalación

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

Servidor por defecto:

```txt
http://localhost:3000
```

Verificar funcionamiento:

```txt
GET http://localhost:3000/api/health
```

## Credenciales de prueba

```txt
Admin:
admin@demo.cl
Admin123

Usuario:
usuario@demo.cl
User1234
```

## Cambiar de SQLite a MySQL

En el archivo `.env` cambiar:

```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=galeria_fotos
DB_USER=root
DB_PASSWORD=tu_password
```

Luego crear la base de datos en MySQL:

```sql
CREATE DATABASE galeria_fotos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Y ejecutar:

```bash
npm run seed
npm run dev
```

## Autenticación

Las rutas protegidas usan token JWT.

Enviar en headers:

```txt
Authorization: Bearer TU_TOKEN
```

## Endpoints principales

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Ver perfil autenticado |

### Galerías

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| GET | `/api/galleries/public` | No | Lista todas las galerías públicas |
| GET | `/api/galleries/my` | Sí | Lista las galerías del usuario autenticado |
| GET | `/api/galleries/:id` | Parcial | Permite ver pública; privada solo dueño o admin |
| POST | `/api/galleries` | Sí | Crear galería |
| PUT | `/api/galleries/:id` | Sí | Editar galería propia |
| DELETE | `/api/galleries/:id` | Sí | Eliminar galería propia |

### Fotos

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| POST | `/api/galleries/:galleryId/photos` | Sí | Agregar foto a galería propia |
| PUT | `/api/galleries/:galleryId/photos/:photoId` | Sí | Editar foto propia |
| DELETE | `/api/galleries/:galleryId/photos/:photoId` | Sí | Eliminar foto propia |

## Ejemplos de uso

### Registrar usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ana Pérez",
  "email": "ana@demo.cl",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@demo.cl",
  "password": "User1234"
}
```

### Crear galería

```http
POST /api/galleries
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
  "title": "Mis vacaciones",
  "description": "Fotos del viaje al sur",
  "visibility": "public"
}
```

### Cambiar galería a privada

```http
PUT /api/galleries/1
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
  "visibility": "private"
}
```

### Agregar foto usando URL

```http
POST /api/galleries/1/photos
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
  "title": "Foto del lago",
  "description": "Imagen tomada durante el viaje",
  "imageUrl": "https://ejemplo.com/foto.jpg"
}
```

### Agregar foto subiendo archivo

Usar `multipart/form-data`:

| Campo | Tipo |
|---|---|
| title | texto |
| description | texto |
| image | archivo |

Ruta:

```txt
POST /api/galleries/1/photos
```

## Reglas de negocio importantes

1. Un usuario puede crear muchas galerías.
2. Una galería pertenece a un solo usuario.
3. Una galería puede ser `public` o `private`.
4. Las galerías públicas las puede ver cualquier persona.
5. Las galerías privadas solo las puede ver su dueño o un administrador.
6. Solo el dueño o un administrador puede editar o eliminar una galería.
7. Solo el dueño o un administrador puede agregar, editar o eliminar fotos.

## Recomendación para estudiantes

El frontend debería tener como mínimo:

- Pantalla de registro.
- Pantalla de login.
- Página pública de galerías públicas.
- Panel privado del usuario.
- Crear galería.
- Editar visibilidad pública/privada.
- Agregar fotos.
- Ver detalle de galería.
- Cerrar sesión.
