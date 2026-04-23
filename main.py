import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

# ─── CONFIG ───────────────────────────────────────────────────
BOT_TOKEN   = os.environ.get("BOT_TOKEN", "ВСТАВЬ_ТОКЕН_СЮДА")
ADMIN_CHAT  = os.environ.get("ADMIN_CHAT_ID", "ВСТАВЬ_СВОЙ_CHAT_ID")  # chat_id Александры
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
async def send_message(chat_id: str, text: str):
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{TG_API}/sendMessage",
            json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
        )
        log.info("TG response: %s", r.text)
        return r.json()

# ─── ROUTES ───────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"status": "ok", "bot": "Arkhipova PSY"}


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
