import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string({ required_error: "Введите номер телефона" })
    .min(1, "Введите номер телефона")
    .refine(value => {
      const digits = value.replace(/\D/g, "");
      return digits.length === 11 && digits.startsWith("7");
    }, "Введите корректный номер телефона"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  message: z.string().optional(),
  source: z.enum(["website", "callback"]).default("website"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Отправляем в Telegram
    try {
      const telegramMessage = formatTelegramMessage(data);
      await sendToTelegram(telegramMessage);
    } catch (telegramError) {
      console.error("Telegram send error:", telegramError);
      // Не возвращаем ошибку пользователю, заявка отправлена в Telegram
    }

    return NextResponse.json(
      { success: true, message: "Заявка успешно отправлена" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Ошибка валидации данных",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Произошла ошибка при отправке заявки" },
      { status: 500 }
    );
  }
}

function formatTelegramMessage(data: z.infer<typeof contactSchema>) {
  const parts = [
    "🔔 <b>Новая заявка с сайта!</b>",
    "",
    `👤 <b>Имя:</b> ${data.name}`,
  ];

  if (data.phone) {
    parts.push(`📱 <b>Телефон:</b> ${data.phone}`);
  }

  if (data.email) {
    parts.push(`📧 <b>Email:</b> ${data.email}`);
  }

  parts.push("", `💬 <b>Сообщение:</b>`, data.message ?? "");
  parts.push("", `🕐 ${new Date().toLocaleString("ru-RU")}`);

  return parts.join("\n");
}

async function sendToTelegram(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram credentials not configured");
    return null;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.result;
}
