# Instalación y uso Backend 

## Índice
1. [Instalación](https://github.com/homerig/MiGanado_app/blob/main/README.md#pasos-para-instalaci%C3%B3n-django).
2. [Agregado de datos IP](https://github.com/homerig/MiGanado_app/blob/main/README.md#pasos-para-instalaci%C3%B3n-django).
3. [Iniciar App](https://github.com/homerig/MiGanado_app/blob/main/README.md#iniciar-aplicaci%C3%B3n).
4. [Ver datos y tablas agregadas](https://github.com/homerig/MiGanado_app/blob/main/README.md#ver-datos-y-tablas-agregadas).
5. [Si cambias el modelo de clases en models.py](https://github.com/homerig/MiGanado_app/blob/main/README.md#si-cambias-el-modelo-de-clases-en-modelspy).
   
___________________________________________________________________________________________
### Pasos para instalación DJANGO
1. Descargar [Python](https://www.python.org/). Asegurate de marcar la opción que diga: `Add Python to PATH`
2. Abrir **CMD** y poner el siguiente comando reemplazando la palabra **RUTA** por la ruta donde hayas instalado el proyecto de MiGanado:
   
   ```bash
   cd RUTA/backend
   pip install django
   pip install django djangorestframework
   pip install django-cors-headers
    ```
### Agrega tus datos de ip para luego poder utilizar
1. Hallar **IP**:
   - poner en **CMD**:
    ```bash
    ipconfig
     ```
   - tenes que ver la variable que diga:
     
   Adaptador de Ethernet Ethernet o Adaptador de LAN inalámbrica Wi-Fi

   Dirección **IPv4**. . . . . . . . . . . . . . : **192.168.X.XX** (las x son los numeros que cambian según la IP)
3. En api.js en baseURL poner `http://(tu IP):8000/miGanado`
   debería quedar algo así:
   
   ```bash
   const baseURL = 'http://192.168.X.XX:8000/miGanado';
   ```
4. En `MiGanado_app\backend\mi_ganado_backend\settings.py` agregar tu **IP** en:
   ```bash
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:8081",
       "http://192.168.X.XX:8081", 
       (agregar aca) 
   ]
    ```
___________________________________________________________________________________________
### Iniciar Aplicación
1. iniciar **Django** (2 opciones):
   - En el CMD:

    ```bash
   cd  Ruta\backend
   python manage.py runserver 0.0.0.0:8000
   ```
   - Desde Visual Studio:

    ```bash
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ``` 
3. Para **salir y cerrar django** presionar: `CTRL + FIN + PAUSA (boton re pag)`

### Ver datos y tablas agregadas
- si queres ver todas las **tablas**: `http://localhost:8000/miGanado/`

- si queres ver **datos** de una tabla en específico: `http://localhost:8000/miGanado/usuarios/`

###  Si cambias el modelo de clases en models.py
1. Tocar guardar
2. Luego poner:
   
   - En el CMD:

    ```bash
   cd  Ruta\backend
   python manage.py makemigrations
   python manage.py migrate
   ```
   - Desde Visual Studio:

    ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ``` 
