import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

# ─── CONFIG ───────────────────────────────────────────────────
BOT_TOKEN   = os.environ.get("BOT_TOKEN", "ВСТАВЬ_ТОКЕН_СЮДА")
ADMIN_CHAT  = os.environ.get("ADMIN_CHAT_ID", "ВСТАВЬ_СВОЙ_CHAT_ID")  # chat_id Александры
WEB_APP_URL = os.environ.get("WEB_APP_URL", "").strip()
TG_API      = f"https://api.telegram.org/bot{BOT_TOKEN}"

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

    if text in {"/start", "/menu"}:
        result = await send_start_menu(str(chat_id))
        return {"ok": bool(result.get("ok")), "action": "start_menu"}

    if text == "/help":
        result = await send_message(
            str(chat_id),
            "Команды:\n"
            "/start — открыть меню\n"
            "/menu — показать кнопку Mini App\n"
            "/help — помощь",
        )
        return {"ok": bool(result.get("ok")), "action": "help"}

    return {"ok": True, "ignored": "unsupported_message"}


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


@app.get("/set_webhook")
async def set_webhook():
    """
    Вспомогательный endpoint для установки webhook из браузера.
    Открой: https://<your-service>.up.railway.app/set_webhook
    """
    base_url = os.environ.get("RAILWAY_PUBLIC_DOMAIN", "").strip()
    if base_url:
        webhook_url = f"https://{base_url}/webhook"
    else:
        return {"ok": False, "error": "RAILWAY_PUBLIC_DOMAIN is not set"}

    async with httpx.AsyncClient() as client:
        r = await client.post(f"{TG_API}/setWebhook", json={"url": webhook_url})
        data = r.json()

    return {"ok": data.get("ok", False), "webhook_url": webhook_url, "telegram_response": data}
