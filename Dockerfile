# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Define el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY backend/package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto de la aplicación
COPY backend/ .

# Compila la aplicación (en el caso de NestJS)
RUN npm run build

# Expone el puerto 3000 para que Heroku pueda usarlo
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
