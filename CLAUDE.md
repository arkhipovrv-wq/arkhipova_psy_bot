# CLAUDE.md

Инструкция для Claude Code при работе с этим репозиторием. Актуально на 2026-07-08.

## Что это

Telegram Mini App психолога **Александры Архиповой** (@amoralniy_psiholog, «а-моральный психолог»). Личный/семейный проект. Три функции: **запись на сессию**, **раздел контента** (Instagram/канал + витрина Reels + продажа гайда) и **воронка продажи гайда через канал**. Бот — **@arkhipova_psy_bot**.

Две деплоящиеся части (обе автодеплой из GitHub `arkhipovrv-wq/arkhipova_psy_bot`, ветка `main`):

- **Фронтенд** (`frontend/`): Mini App на React 18 + Vite. Хостинг — **Netlify** (`netlify.toml`, base=frontend, publish=dist), боевой адрес **https://relaxed-liger-2d17fd.netlify.app**. Открывается внутри Telegram через `telegram-web-app.js`.
- **Бэкенд** (`psy_bot_backend/`): FastAPI + httpx. Хостинг — **Render free** (`render.yaml` Blueprint, rootDir=psy_bot_backend), боевой адрес **https://arkhipova-psy-bot.onrender.com**. Обрабатывает Telegram webhook, приём заявок и продажу гайда.

Каждый `git push` в `main` пересобирает и Netlify, и Render автоматически.

## Подводные камни (прочитать до правок)

1. **Вся UI-логика Mini App — в корневом `alexa_psy_miniapp.jsx`**, а не в `frontend/src`. [frontend/src/App.jsx](frontend/src/App.jsx) — однострочный реэкспорт `../../alexa_psy_miniapp.jsx`. CSS живёт там же, в инлайн tagged-template-строке `css`. Три вкладки (Главная / Запись / Контент) — тоже там.
2. **Все внешние ресурсы грузятся НЕблокирующе — это защита от RU-блокировок.** Синхронный внешний ресурс в `<head>` ломает рендер в РФ без VPN (пустая страница). Поэтому: `telegram-web-app.js` помечен `async` + `whenTelegramReady()` дожидается `window.Telegram.WebApp`; Google Fonts грузятся через `media=print→onload` с фолбэками Georgia/системный гротеск; **все картинки самохостятся** в `frontend/public/` (фото, обложки Reels, обложка гайда) — не тянуть с внешних CDN.
3. **Хардкод-fallback API у фронта.** `DEFAULT_API_BASE` в [alexa_psy_miniapp.jsx](alexa_psy_miniapp.jsx) = `https://arkhipova-psy-bot.onrender.com`. Локальный `frontend/.env` с `VITE_API_URL` ПЕРЕБИВАЕТ его при локальной сборке (vite грузит .env-файл; на Netlify этого файла нет → прод берёт onrender). Если правишь константу и «не работает» — проверь локальный `.env`.
4. **Webhook ставится вручную** после деплоя: один раз открыть `GET /set_webhook`. Он платформонезависим (`resolve_public_base_url`: `PUBLIC_BASE_URL` → `RENDER_EXTERNAL_URL` → `RAILWAY_PUBLIC_DOMAIN`); на Render адрес подставляется сам.
5. **Render free = cold start:** после 15 мин простоя первый запрос идёт ~30–60 сек. Telegram повторяет вебхуки; для заявки/питча это терпимо.
6. **`GET /get_my_id`** — отладочный эндпоинт (chat_id через `getUpdates`), считать временным. **CORS = `*`** — в проде сузить до домена Mini App.
7. **BOT_TOKEN светился в истории публичного репо** — при любой возможности перевыпустить в BotFather; в репозитории только `.env.example`-плейсхолдеры.

## Архитектура бэкенда (`psy_bot_backend/main.py`)

Эндпоинты:
- `GET /` — health.
- `POST /webhook` — Telegram-апдейты. Роутинг команд (парсит `/start <payload>`):
  - `/start guide` (deep-link из канала) → `send_guide_pitch` (обложка + СБП-кнопка).
  - `/post_guide` (**только ADMIN**) → `post_guide_to_channel` — постит промо гайда в канал.
  - `/start`, `/menu` → меню с кнопкой Mini App. `/help` → справка.
  - Любое прочее сообщение (в т.ч. **чек об оплате**) → пересылается ADMIN + автоответ клиенту.
- `POST /booking` — заявка из Mini App → `sendMessage` на `ADMIN_CHAT_ID`.
- `GET /set_webhook`, `GET /get_my_id` — служебные.

## Переменные окружения

Бэкенд (**Render → Environment**, см. [psy_bot_backend/.env.example](psy_bot_backend/.env.example)):
- `BOT_TOKEN` — токен бота (секрет).
- `ADMIN_CHAT_ID` — куда уходят заявки/чеки. Сейчас `363980484` (Роман).
- `WEB_APP_URL` — публичный адрес Mini App (netlify). Используется в кнопке `/start` и как источник обложки гайда (`WEB_APP_URL/guide.jpg`).
- Опционально (дефолты в коде): `CHANNEL_ID`=@amoralniy_psiholog, `BOT_USERNAME`=arkhipova_psy_bot, `GUIDE_PAY_URL`=СБП-ссылка qr.nspk.ru, `PYTHON_VERSION`, `PUBLIC_BASE_URL`.

Фронтенд (`frontend/.env`, локальный, gitignored):
- `VITE_API_URL` — базовый URL бэкенда (для локальной разработки; в проде не задаётся — берётся `DEFAULT_API_BASE`).

## Основные потоки

**Запись:** Mini App читает `WebApp.initDataUnsafe.user`, предзаполняет имя/username → пользователь выбирает услугу/формат/дату/время → `POST /booking` → бэк шлёт заявку ADMIN в Telegram. Состояние на сервере не хранится, психолог отвечает клиенту напрямую.

**Продажа гайда «Терапия в кармане» (490 ₽) через канал:** ADMIN шлёт боту `/post_guide` → бот постит в канал промо с кнопкой «Забрать гайд» (`t.me/arkhipova_psy_bot?start=guide`) → клиент жмёт Start → бот шлёт питч с кнопкой оплаты по СБП → клиент оплачивает и присылает чек в бота → чек пересылается ADMIN → ADMIN отправляет PDF вручную (автодоставка отложена). **Предусловие:** бот должен быть админом канала с правом Post Messages.

## Команды

Бэкенд (из `psy_bot_backend/`): `pip install -r requirements.txt` → `python -m uvicorn main:app --reload` (локально :8000).
Фронтенд (из `frontend/`): `npm install` → `npm run dev` / `npm run build`.
Тестов, линтера, форматтера в проекте нет.

## Не сделано / на очереди

- **Фича B — синхронизация занятости** (календарь записи пока статичный, все слоты свободны). План: Apple Calendar Александры ↔ Google Calendar → бэк читает free/busy → Mini App показывает только свободные окна. Ждём готовности её календаря и рабочих часов.
- **Автодоставка PDF гайда** — сейчас вручную.
- Развитие: «движок интенсивов» (лид-магнит → регистрация → оплата → когортная рассылка через бота), т.к. личная запись заполнена — растить надо масштабируемые продукты.
