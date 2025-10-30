import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Configure API route to accept larger body sizes for file uploads
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  files: z.array(z.instanceof(File)).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const data = {
      name: formData.get("name")?.toString() || undefined,
      phone: formData.get("phone")?.toString() || "",
      email: formData.get("email")?.toString() || undefined,
      message: formData.get("message")?.toString() || undefined,
      source:
        (formData.get("source")?.toString() as "website" | "callback") ||
        "website",
      files: formData.getAll("files").filter(f => f instanceof File) as File[],
    };

    // Validate with zod
    const validatedData = contactSchema.parse(data);

    // Отправляем в Telegram
    try {
      const telegramMessage = formatTelegramMessage(validatedData);
      await sendToTelegram(telegramMessage, validatedData.files || []);
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
    `👤 <b>Имя:</b> ${data.name || "Не указано"}`,
  ];

  if (data.phone) {
    parts.push(`📱 <b>Телефон:</b> ${data.phone}`);
  }

  if (data.email) {
    parts.push(`📧 <b>Email:</b> ${data.email}`);
  }

  parts.push("", `💬 <b>Сообщение:</b>`, data.message ?? "Не указано");

  if (data.files && data.files.length > 0) {
    parts.push("", `📎 <b>Файлы:</b> ${data.files.length} шт.`);
  }

  parts.push("", `🕐 ${new Date().toLocaleString("ru-RU")}`);

  return parts.join("\n");
}

async function sendToTelegram(message: string, files: File[]) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram credentials not configured");
    return null;
  }

  // First send the text message
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

  // Then send files if any
  if (files && files.length > 0) {
    for (const file of files) {
      try {
        await sendFileToTelegram(file);
      } catch (error) {
        console.error(`Error sending file ${file.name}:`, error);
      }
    }
  }

  return result.result;
}

async function sendFileToTelegram(file: File) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram credentials not configured");
  }

  const url = `https://api.telegram.org/bot${botToken}/sendDocument`;

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create FormData for file upload
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("document", new Blob([buffer]), file.name);
  formData.append(
    "caption",
    `📎 ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
  );

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Telegram API error: ${response.statusText} - ${errorText}`
    );
  }

  return await response.json();
}
