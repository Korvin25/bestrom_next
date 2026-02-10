# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Запуск на сервере

1. Установите зависимости:
```bash
npm install
```

2. Создайте production-сборку:
```bash
npm run build
```

3. Запустите сервер:

Вариант А (рекомендуемый):
```bash
npm start
```

Вариант Б (прямой запуск):
```bash
node .output/server/index.mjs
```

### Использование PM2

Для управления процессом в production рекомендуется использовать PM2.

Вариант А (через npm script - рекомендуется):
```bash
pm2 start npm --name "bestrom-frontend" -- start
```

Вариант Б (прямой запуск файла):
```bash
pm2 start .output/server/index.mjs --name "bestrom-frontend"
```

Команды управления:
```bash
# Просмотр логов
pm2 logs bestrom-frontend

# Перезапуск
pm2 restart bestrom-frontend

# Остановка
pm2 stop bestrom-frontend

# Удаление из PM2
pm2 delete bestrom-frontend
```
