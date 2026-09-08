FROM node:22-alpine

WORKDIR /app

# Copy seluruh source code (tanpa node_modules karena zero-dependency)
COPY . .

# Konfigurasi environment
ENV NODE_ENV=production
ENV PORT=4000

# Expose port aplikasi
EXPOSE 4000

# Jalankan server terpadu (Web Frontend + REST API)
CMD ["node", "server.js"]
