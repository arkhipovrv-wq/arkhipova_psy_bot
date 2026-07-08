import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

# ─── CONFIG ───────────────────────────────────────────────────
BOT_TOKEN     = os.environ.get("BOT_TOKEN", "ВСТАВЬ_ТОКЕН_СЮДА")
ADMIN_CHAT    = os.environ.get("ADMIN_CHAT_ID", "ВСТАВЬ_СВОЙ_CHAT_ID")  # chat_id Александры/Романа
WEB_APP_URL   = os.environ.get("WEB_APP_URL", "").strip()
CHANNEL_ID    = os.environ.get("CHANNEL_ID", "@amoralniy_psiholog")     # канал для промо гайда
BOT_USERNAME  = os.environ.get("BOT_USERNAME", "arkhipova_psy_bot")     # для deep-link кнопки
GUIDE_PAY_URL = os.environ.get("GUIDE_PAY_URL", "https://qr.nspk.ru/BS1A0009246PQ1MC8VKQ42M0KCOIKM6A")
TG_API        = f"https://api.telegram.org/bot{BOT_TOKEN}"

# ─── APP ──────────────────────────────────────────────────────
app = FastAPI(title="Arkhipova PSY Bot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # в продакшене — заменить на домен Mini App
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


def normalize_web_app_url(url: str) -> str:
    value = (url or "").strip()
    if not value:
        return ""
    if value.startswith("http://") or value.startswith("https://"):
        return value
    return f"https://{value}"

# ─── MODELS ───────────────────────────────────────────────────
class BookingRequest(BaseModel):
    service:  str
    price:    str
    duration: str
    format:   str          # "online" | "offline"
    name:     str
    telegram: str
    datetime: str          # "18 мая, 14:00"
    note:     str = ""

# ─── HELPERS ──────────────────────────────────────────────────
async def send_message(chat_id: str, text: str, reply_markup: dict | None = None):
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if reply_markup:
        payload["reply_markup"] = reply_markup

    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{TG_API}/sendMessage",
            json=payload,
        )
        log.info("TG response: %s", r.text)
        return r.json()


async def send_start_menu(chat_id: str):
    web_app_url = normalize_web_app_url(WEB_APP_URL)

    if not web_app_url:
        return await send_message(
            chat_id,
            "Бот подключен, но не настроен WEB_APP_URL. Добавьте переменную окружения и перезапустите сервис.",
        )

    keyboard = {
        "inline_keyboard": [
            [{"text": "Открыть Mini App", "web_app": {"url": web_app_url}}],
            [{"text": "Записаться через ссылку", "url": web_app_url}],
        ]
    }
    text = (
        "Психолог для смелых жизненных изменений.\n"
        "Запись на сессию, блог и материалы — всё здесь."
    )
    return await send_message(chat_id, text, reply_markup=keyboard)

# ─── ГАЙД «Терапия в кармане» ─────────────────────────────────
def guide_cover_url() -> str:
    base = normalize_web_app_url(WEB_APP_URL).rstrip("/")
    return f"{base}/guide.jpg" if base else "https://relaxed-liger-2d17fd.netlify.app/guide.jpg"


GUIDE_PITCH = (
    "<b>Гайд «Терапия в кармане» — 490 ₽</b>\n\n"
    "32 страницы по психоаналитической диагностике и самопомощи: типы личности "
    "простым языком + как себе помочь и куда смотреть в своих реакциях.\n\n"
    "<b>Как забрать:</b>\n"
    "1. Оплатите 490 ₽ по кнопке ниже (СБП).\n"
    "2. Пришлите чек об оплате сюда, в этот чат.\n"
    "3. Мы вышлем вам PDF.\n\n"
    "Не замена терапии, но честная опора, чтобы понять себя глубже. 🌿"
)

CHANNEL_PROMO = (
    "<b>«Терапия в кармане» — гайд-методичка</b>\n\n"
    "Узнаёте себя в моих постах и рилс и думаете «и что мне теперь с этим делать»? "
    "Этот гайд — первый шаг, чтобы начать понимать себя глубже.\n\n"
    "Внутри, 32 страницы:\n"
    "• типы личности простым языком\n"
    "• как себе помочь и какие вопросы себе задавать\n"
    "• куда смотреть в своих реакциях\n\n"
    "Не замена терапии, но честная опора."
)


async def send_photo(chat_id: str, photo: str, caption: str, reply_markup: dict | None = None):
    payload = {"chat_id": chat_id, "photo": photo, "caption": caption, "parse_mode": "HTML"}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{TG_API}/sendPhoto", json=payload)
        log.info("TG sendPhoto: %s", r.text)
        return r.json()


async def send_guide_pitch(chat_id: str):
    """Питч гайда клиенту (по deep-link /start guide из канала)."""
    keyboard = {"inline_keyboard": [[{"text": "Оплатить 490 ₽ по СБП", "url": GUIDE_PAY_URL}]]}
    return await send_photo(chat_id, guide_cover_url(), GUIDE_PITCH, reply_markup=keyboard)


async def post_guide_to_channel():
    """Публикует промо-пост гайда в канал с кнопкой-воронкой в бота."""
    start_link = f"https://t.me/{BOT_USERNAME}?start=guide"
    keyboard = {"inline_keyboard": [[{"text": "Забрать гайд · 490 ₽", "url": start_link}]]}
    return await send_photo(CHANNEL_ID, guide_cover_url(), CHANNEL_PROMO, reply_markup=keyboard)

# ─── ROUTES ───────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"status": "ok", "bot": "Arkhipova PSY"}


@app.post("/webhook")
async def telegram_webhook(request: Request):
    """
    Telegram webhook endpoint.
    Telegram отправляет update сюда после setWebhook.
    """
    update = await request.json()
    message = update.get("message") or {}
    text = (message.get("text") or "").strip()
    chat = message.get("chat") or {}
    chat_id = chat.get("id")

    if not chat_id:
        return {"ok": True, "ignored": "no_chat_id"}

    # Разбираем команду и её payload (deep-link «/start guide» приходит как текст).
    parts = text.split(maxsplit=1)
    cmd = parts[0] if parts else ""
    payload = parts[1].strip() if len(parts) > 1 else ""

    if cmd == "/start" and payload == "guide":
        result = await send_guide_pitch(str(chat_id))
        return {"ok": bool(result.get("ok")), "action": "guide_pitch"}

    if cmd == "/post_guide":
        if str(chat_id) != str(ADMIN_CHAT):
            await send_message(str(chat_id), "Команда доступна только администратору.")
            return {"ok": False, "action": "post_guide_denied"}
        result = await post_guide_to_channel()
        ok = bool(result.get("ok"))
        await send_message(
            str(chat_id),
            "✅ Пост про гайд опубликован в канал." if ok
            else f"❌ Не удалось опубликовать. Проверьте, что бот — админ канала с правом постить.\n{result}",
        )
        return {"ok": ok, "action": "post_guide"}

    if cmd in {"/start", "/menu"}:
        result = await send_start_menu(str(chat_id))
        return {"ok": bool(result.get("ok")), "action": "start_menu"}

    if cmd == "/help":
        result = await send_message(
            str(chat_id),
            "Команды:\n"
            "/start — открыть меню\n"
            "/menu — показать кнопку Mini App\n"
            "/help — помощь",
        )
        return {"ok": bool(result.get("ok")), "action": "help"}

    # Любое прочее сообщение (в т.ч. чек об оплате гайда) пересылаем администратору,
    # клиенту отвечаем подтверждением. Так работает «чек об оплате — боту».
    msg_id = message.get("message_id")
    from_user = message.get("from") or {}
    uname = from_user.get("username")
    who = f"@{uname}" if uname else (from_user.get("first_name") or "без имени")

    if msg_id is not None:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{TG_API}/forwardMessage",
                json={"chat_id": ADMIN_CHAT, "from_chat_id": chat_id, "message_id": msg_id},
            )

    await send_message(
        ADMIN_CHAT,
        f"⬆️ Сообщение от {who} (chat_id {chat_id}).\n"
        "Возможно — чек об оплате гайда «Терапия в кармане».",
    )
    await send_message(
        str(chat_id),
        "Спасибо! Сообщение получено — Александра ответит вам лично.\n"
        "Если это оплата гайда, пришлём «Терапия в кармане» после проверки. 🌿",
    )
    return {"ok": True, "action": "forwarded_to_admin"}


@app.post("/booking")
async def create_booking(data: BookingRequest):
    """Mini App отправляет сюда заявку — бот пишет Александре."""

    fmt_label = "💻 Онлайн" if data.format == "online" else "🏡 Очно (Малая Покровская 18)"

    msg = (
        "🔔 <b>Новая заявка на сессию!</b>\n"
        "─────────────────────\n"
        f"👤 <b>Имя:</b> {data.name}\n"
        f"📱 <b>Telegram:</b> {data.telegram}\n"
        "─────────────────────\n"
        f"🌿 <b>Услуга:</b> {data.service}\n"
        f"💰 <b>Стоимость:</b> {data.price}\n"
        f"⏱ <b>Длительность:</b> {data.duration}\n"
        f"📍 <b>Формат:</b> {fmt_label}\n"
        f"📅 <b>Дата и время:</b> {data.datetime}\n"
    )

    if data.note:
        msg += f"─────────────────────\n💬 <b>Запрос клиента:</b>\n{data.note}\n"

    msg += "─────────────────────\n✅ Ответь клиенту в Telegram для подтверждения."

    result = await send_message(ADMIN_CHAT, msg)

    if result.get("ok"):
        return {"status": "sent"}
    else:
        log.error("Failed to send: %s", result)
        return {"status": "error", "detail": result}


@app.get("/get_my_id")
async def get_my_id():
    """
    Временный эндпоинт для получения chat_id.
    Напиши боту /start, затем открой этот URL — увидишь свой chat_id.
    Удали эндпоинт после использования!
    """
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{TG_API}/getUpdates")
        updates = r.json()

    results = []
    for u in updates.get("result", []):
        msg = u.get("message", {})
        chat = msg.get("chat", {})
        results.append({
            "chat_id":    chat.get("id"),
            "username":   chat.get("username"),
            "first_name": chat.get("first_name"),
        })
    return {"updates": results}


def resolve_public_base_url() -> str:
    """
    Публичный https-адрес сервиса — не зависит от платформы.
    Приоритет: явный PUBLIC_BASE_URL → Render (RENDER_EXTERNAL_URL) → Railway.
    """
    explicit = os.environ.get("PUBLIC_BASE_URL", "").strip()
    if explicit:
        return explicit.rstrip("/")

    render_url = os.environ.get("RENDER_EXTERNAL_URL", "").strip()
    if render_url:
        return render_url.rstrip("/")

    railway_host = os.environ.get("RAILWAY_PUBLIC_DOMAIN", "").strip()
    if railway_host:
        return f"https://{railway_host}".rstrip("/")

    return ""


@app.get("/set_webhook")
async def set_webhook():
    """
    Вспомогательный endpoint для установки webhook из браузера.
    Открой: https://<your-service>/set_webhook — один раз после деплоя.
    """
    base_url = resolve_public_base_url()
    if not base_url:
        return {
            "ok": False,
            "error": "Не найден публичный URL. Задай PUBLIC_BASE_URL "
                     "(или используй Render/Railway, где адрес подставляется автоматически).",
        }

    webhook_url = f"{base_url}/webhook"
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{TG_API}/setWebhook", json={"url": webhook_url})
        data = r.json()

    return {"ok": data.get("ok", False), "webhook_url": webhook_url, "telegram_response": data}
