# СТИЛКРАФТ - Сайт металлообработки

Современный веб-сайт компании СТИЛКРАФТ на Next.js 14 с Server-Side Rendering, оптимизацией SEO и интеграцией Telegram бота.

## 🚀 Технологии

- **Next.js 14+** - React фреймворк с App Router
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **PostgreSQL** - База данных
- **Prisma** - ORM
- **Telegram Bot API** - Управление контентом
- **React Hook Form + Zod** - Формы и валидация
- **React Markdown** - Рендеринг статей
- **Framer Motion** - Анимации
- **Docker** - Контейнеризация

## 📋 Требования

- Node.js 18+
- PostgreSQL 14+
- npm или yarn
- Docker и Docker Compose (опционально)

## 🛠️ Установка

### 1. Клонирование и установка зависимостей

```bash
cd metal
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` на основе `.env.example`:

```bash
cp .env.example .env.local
```

Заполните переменные:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stilkraft?schema=public"

# Telegram Bot
TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN"
TELEGRAM_CHAT_ID="YOUR_CHAT_ID"
TELEGRAM_WEBHOOK_URL="https://yourdomain.com/api/telegram"
TELEGRAM_ADMIN_USERNAMES="username1,username2"

# Site
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Analytics (опционально)
NEXT_PUBLIC_YANDEX_METRIKA_ID="YOUR_METRIKA_ID"
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="YOUR_GA_ID"
```

### 3. Настройка базы данных

```bash
# Генерация Prisma Client
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# Открыть Prisma Studio (опционально)
npm run prisma:studio
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Сайт будет доступен по адресу: `http://localhost:3000`

## 🐳 Деплой с Docker

### Вариант 1: Docker Compose (рекомендуется)

```bash
# Создайте .env файл с необходимыми переменными
cp .env.example .env

# Запустите все сервисы
docker-compose up -d

# Проверьте логи
docker-compose logs -f app

# Остановка
docker-compose down
```

### Вариант 2: Ручная сборка

```bash
# Сборка образа
docker build -t stilkraft-app .

# Запуск контейнера
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e TELEGRAM_BOT_TOKEN="..." \
  stilkraft-app
```

## 📱 Настройка Telegram Бота

### 1. Создание бота

1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям и сохраните токен

### 2. Получение Chat ID

1. Отправьте сообщение вашему боту
2. Откройте: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Найдите `chat.id` в ответе

### 3. Установка Webhook

После деплоя на VPS:

```bash
npm run telegram:webhook
```

Или вручную:

```bash
node scripts/set-webhook.js
```

### 4. Использование бота

Команды:

- `/start` - Начало работы
- `/new_article` - Создать новую статью (пошагово)
- `/list_articles` - Список статей
- `/help` - Справка

## 📂 Структура проекта

```
metal/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── contact/          # Обработка форм
│   │   └── telegram/         # Telegram webhook
│   ├── articles/             # Страницы статей
│   ├── services/             # Страницы услуг
│   ├── gallery/              # Галерея работ
│   ├── kontakty/             # Контакты
│   ├── layout.tsx            # Главный layout
│   ├── page.tsx              # Главная страница
│   ├── sitemap.ts            # Динамический sitemap
│   └── robots.ts             # Robots.txt
├── components/               # React компоненты
│   ├── layout/               # Header, Footer
│   ├── ui/                   # UI компоненты
│   └── ...                   # Остальные компоненты
├── lib/                      # Утилиты и данные
│   ├── data/                 # Статические данные
│   │   ├── services.json     # Услуги
│   │   └── company.ts        # Информация о компании
│   ├── types/                # TypeScript типы
│   └── utils/                # Вспомогательные функции
├── prisma/                   # Prisma схема
│   └── schema.prisma
├── public/                   # Статические файлы
│   ├── logo.png
│   ├── bg.jpg.webp
│   └── example.jpg.webp
├── scripts/                  # Вспомогательные скрипты
├── docker-compose.yml        # Docker Compose конфигурация
├── Dockerfile                # Docker образ
└── package.json
```

## 🎨 Особенности

### Адаптивный дизайн

Полностью адаптивный для всех устройств (mobile-first подход)

### SEO оптимизация

- Динамический sitemap.xml
- Robots.txt
- Open Graph теги
- Twitter Cards
- Structured Data (Schema.org)
- Оптимизация изображений через next/image

### Производительность

- SSG для статических страниц
- ISR для динамического контента
- Оптимизация изображений
- Code splitting
- Lazy loading для аналитики

### Telegram Bot

- Публикация статей через Telegram
- Markdown поддержка
- Сохранение заявок в БД
- Уведомления о новых заявках

## 🔧 Команды

```bash
# Разработка
npm run dev                    # Запуск dev сервера
npm run build                  # Production сборка
npm run start                  # Запуск production сервера
npm run lint                   # ESLint проверка

# База данных
npm run prisma:generate        # Генерация Prisma Client
npm run prisma:migrate         # Применить миграции
npm run prisma:studio          # Открыть Prisma Studio

# Telegram
npm run telegram:webhook       # Установить webhook
```

## 📝 Управление контентом

### Услуги

Услуги хранятся в `lib/data/services.json` - редактируйте напрямую

### Статьи

Статьи управляются через Telegram бота или напрямую через Prisma Studio

### Заявки

Заявки сохраняются в БД и отправляются в Telegram чат

## 🔐 Безопасность

- Валидация данных через Zod
- Sanitization для Markdown (react-markdown с remark-gfm)
- Environment variables для секретов
- Авторизация для Telegram бота через usernames
- SQL injection защита через Prisma

## 📊 Аналитика

Поддержка:

- Яндекс.Метрика
- Google Analytics

Скрипты загружаются с задержкой для оптимизации производительности.

## 🐛 Troubleshooting

### Ошибка подключения к БД

Проверьте `DATABASE_URL` в `.env.local`

### Telegram webhook не работает

1. Убедитесь, что сайт доступен по HTTPS
2. Проверьте `TELEGRAM_WEBHOOK_URL`
3. Запустите `npm run telegram:webhook`

### Изображения не загружаются

Убедитесь, что файлы находятся в папке `public/`

## 📄 Лицензия

© 2024 СТИЛКРАФТ. Все права защищены.

## 👨‍💻 Разработка

Разработано с использованием современных технологий для максимальной производительности и SEO.

---

**Контакты:**

- Email: cool.paseka@yandex.ru
- Телефон: +7(902) 798-16-70, +7(912) 883-67-46
- Адрес: г. Пермь, ул. Самаркандская, 28
