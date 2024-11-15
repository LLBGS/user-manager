
# Use a imagem oficial do Node.js como base
FROM node:16

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos de configuração do projeto
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código do projeto
COPY . .

# Gere o cliente Prisma
RUN npx prisma generate

# Compile o projeto TypeScript
RUN npm run build

# Exponha a porta da aplicação
EXPOSE 3002

# Comando para iniciar a aplicação
CMD ["npm", "start"]