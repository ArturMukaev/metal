import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/utils/prisma';

const contactSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
  source: z.enum(['website', 'callback']).default('website'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Сохраняем в БД
    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
        source: data.source,
        ipAddress: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Отправляем в Telegram
    try {
      const telegramMessage = formatTelegramMessage(data);
      const sent = await sendToTelegram(telegramMessage);

      if (sent) {
        await prisma.contactRequest.update({
          where: { id: contactRequest.id },
          data: {
            telegramSent: true,
            telegramMessageId: sent.message_id?.toString(),
          },
        });
      }
    } catch (telegramError) {
      console.error('Telegram send error:', telegramError);
      // Не возвращаем ошибку пользователю, заявка сохранена в БД
    }

    return NextResponse.json(
      { success: true, message: 'Заявка успешно отправлена' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Ошибка валидации данных', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Произошла ошибка при отправке заявки' },
      { status: 500 }
    );
  }
}

function formatTelegramMessage(data: z.infer<typeof contactSchema>) {
  const parts = [
    '🔔 <b>Новая заявка с сайта!</b>',
    '',
    `👤 <b>Имя:</b> ${data.name}`,
  ];

  if (data.phone) {
    parts.push(`📱 <b>Телефон:</b> ${data.phone}`);
  }

  if (data.email) {
    parts.push(`📧 <b>Email:</b> ${data.email}`);
  }

  parts.push('', `💬 <b>Сообщение:</b>`, data.message);
  parts.push('', `🕐 ${new Date().toLocaleString('ru-RU')}`);

  return parts.join('\n');
}

async function sendToTelegram(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured');
    return null;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.result;
}

