# Используем официальный образ Node.js 20 на базе Alpine для минимального размера
FROM node:20-alpine AS base

# Установка зависимостей для сборки
FROM base AS deps
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Сборка приложения
FROM base AS builder
WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Собираем приложение Nuxt
RUN npm run build

# Production образ
FROM base AS runner
WORKDIR /app

# Создаем пользователя без прав root для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Копируем только необходимые файлы для production
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

# Устанавливаем владельца файлов
RUN chown -R nuxtjs:nodejs /app

# Переключаемся на непривилегированного пользователя
USER nuxtjs

# Открываем порт 3000
EXPOSE 3000

# Устанавливаем переменные окружения
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Запускаем приложение
CMD ["node", ".output/server/index.mjs"]
