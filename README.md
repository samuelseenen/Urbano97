# Urbano97 - Proyecto de Barbería

Este es un proyecto de barbería que utiliza Node.js para el backend y Angular para el frontend. A continuación, se detallan los pasos necesarios para configurar y ejecutar el proyecto en un entorno local.

## Requisitos

### Instalación de Node.js y npm

1. **Node.js**: Ve al sitio oficial de Node.js [https://nodejs.org](https://nodejs.org) y descarga el instalador adecuado para tu sistema operativo. Sigue las instrucciones para completar la instalación.

2. **npm**: npm se instala automáticamente con Node.js. Puedes verificar la instalación ejecutando los siguientes comandos en tu terminal:

   ```bash
   node -v
   npm -v

3. **Angular CLI**: Para trabajar con el frontend de Angular, necesitas instalar Angular CLI. Ejecuta el siguiente comando en tu terminal:

npm install -g @angular/cli

Verifica la instalación ejecutando:

ng version

4. **Instalar dependencias del backend**: Ve al directorio del backend y ejecuta el siguiente comando para instalar las dependencias necesarias:

cd backend
npm install

5. **Declarar el path de node.js**: Para asegurarte de que Node.js y npm funcionen correctamente, necesitas agregar Node.js al PATH de tu sistema.

.Abre el Panel de Control.
.Ve a Sistema y Seguridad > Sistema > Configuración avanzada del sistema.
.En la pestaña Opciones avanzadas, haz clic en Variables de entorno.
.En Variables del sistema, busca la variable Path y selecciónala. Luego, haz clic en Editar.
.Agrega la ruta del directorio de instalación de Node.js al final del valor de la variable. La ruta típica es C:\Program Files\nodejs\.
.Haz clic en Aceptar para cerrar todas las ventanas.

6. **Iniciar el servidor de node.js**: Ejecuta el siguiente comando para iniciar el servidor backend:

node server.js

7. **Instalar dependencias del frontend**: Ve al directorio del frontend en este caso es barberia dentro de la carpeta frontend y ejecuta el siguiente comando para instalar las dependencias necesarias:

npm install

7. **Iniciar el servidor del frontend (Angular)**: Ejecuta el siguiente comando para iniciar el servidor frontend:

ng serve
