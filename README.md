# MiGanado App

Aplicación mobile/web para gestión ganadera con frontend en Expo/React Native y backend en Django REST Framework.

## Stack

- Frontend: Expo, React Native, React, TypeScript/JavaScript
- Backend: Python, Django, Django REST Framework
- Base de datos: SQLite

## Requisitos

- Node.js 18 o superior
- npm
- Python 3.10 o superior
- pip
- Expo Go si vas a probar desde un celular físico

## Instalación

### 1. Clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd MiGanado_app
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Crear entorno virtual e instalar dependencias del backend

En macOS o Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

En Windows:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Aplicar migraciones

```bash
python manage.py migrate
```

### 5. Generar los datos mock

Este proyecto incluye un comando versionado en GitHub para cargar un usuario demo y datos de prueba.

```bash
python manage.py seed_mock_data
```

El comando:

- elimina el usuario mock anterior si ya existía
- crea nuevamente la cuenta demo
- crea lotes y animales de prueba
- agrega animales vivos, muertos y vendidos
- agrega un lote adicional con vacas

## Cuenta mock incluida

Después de correr `python manage.py seed_mock_data`, podés iniciar sesión con:

- Email: `mock@mi-ganado.com`
- Contraseña: `1234`

## Levantar el backend

Desde la carpeta `backend`:

```bash
python manage.py runserver 0.0.0.0:8000
```

La API queda disponible en:

- `http://localhost:8000/miGanado/`

Ejemplos:

- usuarios: `http://localhost:8000/miGanado/usuarios/`
- lotes: `http://localhost:8000/miGanado/lotes/`
- animales: `http://localhost:8000/miGanado/animales/`

## Levantar el frontend

Volvé a la raíz del proyecto:

```bash
cd ..
npm start
```

También podés usar:

```bash
npm run android
npm run ios
npm run web
```

## Conexión entre frontend y backend

No hace falta editar manualmente la IP en `api/api.js`. El frontend intenta detectar automáticamente el host de Expo y construir la URL base del backend.

Para que funcione correctamente:

- el backend debe estar levantado en el puerto `8000`
- el frontend y el backend deben estar en la misma red si usás un celular físico
- si probás en web o simulador local, `localhost` o `127.0.0.1` suele alcanzar

Si tu red usa una IP distinta y tenés problemas de CORS, revisá `backend/mi_ganado_backend/settings.py` y agregá tu origen en `CORS_ALLOWED_ORIGINS`.

## Docker

También podés levantar el backend con Docker:

```bash
docker compose up --build
```

## Desarrollo

Si cambiás modelos del backend:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

Si querés regenerar los datos demo:

```bash
python manage.py seed_mock_data
```
