# 🚀 Быстрый старт

## Первый запуск (без БД)

Если вы хотите быстро посмотреть сайт без настройки базы данных:

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск dev сервера
npm run dev
```

Сайт будет доступен на `http://localhost:3000`

⚠️ **Примечание:** Без БД не будут работать:
- Страница статей (будет пустой)
- Форма обратной связи (не будет сохраняться в БД)
- Telegram бот

---

## Полная установка с БД

### 1. Установка PostgreSQL

#### macOS (Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
createdb stilkraft
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb stilkraft
```

#### Docker:
```bash
docker run -d \
  --name stilkraft-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=stilkraft \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Настройка .env.local

Отредактируйте `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/stilkraft?schema=public"
```

### 3. Применение миграций

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Запуск

```bash
npm run dev
```

---

## Настройка Telegram бота

### 1. Создание бота

1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Сохраните токен (выглядит как: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### 2. Получение Chat ID

1. Отправьте любое сообщение вашему боту
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
3. Найдите `"chat":{"id":123456789}`
4. Это ваш Chat ID

### 3. Добавьте в .env.local

```env
TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
TELEGRAM_CHAT_ID="123456789"
TELEGRAM_ADMIN_USERNAMES="your_telegram_username"
```

### 4. Установка Webhook (после деплоя)

```bash
npm run telegram:webhook
```

---

## Работа с контентом

### Услуги (статические)

Редактируйте файл `lib/data/services.json`

### Статьи (через Telegram)

После настройки бота:

1. Откройте бота в Telegram
2. Отправьте `/start`
3. Отправьте `/new_article`
4. Следуйте инструкциям

Или через Prisma Studio:
```bash
npm run prisma:studio
```

### Компания (статические)

Редактируйте файл `lib/data/company.ts`

---

## Деплой на VPS

### Вариант 1: Docker Compose (рекомендуется)

```bash
# 1. Клонируйте на сервер
git clone <repo-url>
cd metal

# 2. Создайте .env файл
cp .env.example .env
nano .env  # Отредактируйте переменные

# 3. Запустите
docker-compose up -d

# 4. Проверьте логи
docker-compose logs -f app
```

### Вариант 2: PM2

```bash
# 1. Установите зависимости
npm install
npm run build

# 2. Установите PM2
npm install -g pm2

# 3. Запустите
pm2 start npm --name "stilkraft" -- start

# 4. Автозапуск
pm2 startup
pm2 save
```

### Вариант 3: Systemd

Создайте `/etc/systemd/system/stilkraft.service`:

```ini
[Unit]
Description=STILKRAFT Website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/stilkraft
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
sudo systemctl enable stilkraft
sudo systemctl start stilkraft
```

---

## Настройка Nginx (опционально)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## SSL сертификат (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Troubleshooting

### Ошибка подключения к БД

```bash
# Проверьте, что PostgreSQL запущен
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Проверьте DATABASE_URL в .env.local
```

### Telegram webhook не работает

1. Убедитесь, что сайт доступен по HTTPS
2. Проверьте TELEGRAM_WEBHOOK_URL
3. Запустите: `npm run telegram:webhook`
4. Проверьте webhook: 
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

### Изображения не загружаются

Убедитесь, что файлы в папке `public/`:
- `logo.png` - логотип
- `bg.jpg.webp` - фон главной страницы
- `example.jpg.webp` - тестовое изображение

---

## Полезные команды

```bash
# Разработка
npm run dev              # Dev сервер
npm run build            # Production сборка
npm run start            # Запуск production
npm run lint             # ESLint

# База данных
npm run prisma:generate  # Генерация Prisma Client
npm run prisma:migrate   # Применить миграции
npm run prisma:studio    # Открыть Prisma Studio

# Telegram
npm run telegram:webhook # Установить webhook
```

---

## Поддержка

- Email: cool.paseka@yandex.ru
- Телефон: +7(902) 798-16-70

---

**Удачи с запуском! 🚀**

