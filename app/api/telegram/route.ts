import { NextRequest, NextResponse } from "next/server";

// Типы Telegram
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface TelegramMessage {
  message_id: number;
  from?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  photo?: Array<{
    file_id: string;
    file_size: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();

    if (!update.message) {
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    const username = message.from?.username;
    const text = message.text?.trim();

    // Проверка авторизации
    if (!isAuthorized(username)) {
      await sendMessage(
        message.chat.id,
        "❌ У вас нет доступа к управлению ботом."
      );
      return NextResponse.json({ ok: true });
    }

    if (!text) {
      return NextResponse.json({ ok: true });
    }

    // Команды
    if (text.startsWith("/")) {
      await handleCommand(text, message);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true }); // Всегда возвращаем ok для Telegram
  }
}

function isAuthorized(username?: string): boolean {
  if (!username) return false;

  const adminUsernames =
    process.env.TELEGRAM_ADMIN_USERNAMES?.split(",").map(u => u.trim()) || [];
  return adminUsernames.includes(username);
}

async function handleCommand(command: string, message: TelegramMessage) {
  const chatId = message.chat.id;

  switch (command.split(" ")[0]) {
    case "/start":
      await sendMessage(
        chatId,
        "👋 Привет! Я бот для сайта СТИЛКРАФТ.\n\n" +
          "Доступные команды:\n" +
          "/help - Справка"
      );
      break;

    case "/help":
      await sendMessage(
        chatId,
        "<b>📖 Справка по боту</b>\n\n" +
          "Этот бот используется для получения заявок с сайта СТИЛКРАФТ.\n" +
          "Новые заявки будут автоматически отправляться в этот чат."
      );
      break;

    default:
      await sendMessage(
        chatId,
        "Неизвестная команда. Используйте /help для справки."
      );
  }
}

async function sendMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
}
