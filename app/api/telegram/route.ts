import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

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

// State management for article creation process
const userStates = new Map<
  number,
  {
    step:
      | "awaiting_title"
      | "awaiting_content"
      | "awaiting_image"
      | "awaiting_excerpt";
    data: Partial<{
      title: string;
      content: string;
      excerpt: string;
      coverImage: string;
    }>;
  }
>();

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();

    if (!update.message) {
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    const username = message.from?.username;
    const userId = message.from?.id;
    const text = message.text?.trim();

    // Проверка авторизации
    if (!isAuthorized(username)) {
      await sendMessage(
        message.chat.id,
        "❌ У вас нет доступа к управлению статьями."
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

    // Обработка процесса создания статьи
    if (userId && userStates.has(userId)) {
      await handleArticleCreation(userId, text, message);
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
  const userId = message.from?.id;

  switch (command.split(" ")[0]) {
    case "/start":
      await sendMessage(
        chatId,
        "👋 Привет! Я бот для управления сайтом СТИЛКРАФТ.\n\n" +
          "Доступные команды:\n" +
          "/new_article - Создать новую статью\n" +
          "/list_articles - Список статей\n" +
          "/help - Справка"
      );
      break;

    case "/new_article":
      if (userId) {
        userStates.set(userId, {
          step: "awaiting_title",
          data: {},
        });
        await sendMessage(
          chatId,
          "📝 <b>Создание новой статьи</b>\n\n" +
            "Шаг 1/4: Введите заголовок статьи"
        );
      }
      break;

    case "/list_articles":
      const articles = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      if (articles.length === 0) {
        await sendMessage(chatId, "Пока нет опубликованных статей.");
      } else {
        const list = articles
          .map(
            (a, i) =>
              `${i + 1}. ${a.published ? "✅" : "❌"} <b>${a.title}</b>\n   slug: ${a.slug}`
          )
          .join("\n\n");
        await sendMessage(chatId, `<b>Последние статьи:</b>\n\n${list}`);
      }
      break;

    case "/cancel":
      if (userId && userStates.has(userId)) {
        userStates.delete(userId);
        await sendMessage(chatId, "❌ Создание статьи отменено.");
      }
      break;

    case "/help":
      await sendMessage(
        chatId,
        "<b>📖 Справка по боту</b>\n\n" +
          "<b>/new_article</b> - Создать новую статью (пошаговый процесс)\n" +
          "<b>/list_articles</b> - Показать список статей\n" +
          "<b>/cancel</b> - Отменить текущее действие\n\n" +
          "<b>Формат статей:</b>\n" +
          "Статьи поддерживают Markdown формат:\n" +
          "- Заголовки: # H1, ## H2, ### H3\n" +
          "- Списки: - пункт или 1. пункт\n" +
          "- Жирный: **текст**\n" +
          "- Курсив: *текст*\n" +
          "- Ссылки: [текст](url)"
      );
      break;

    default:
      await sendMessage(
        chatId,
        "Неизвестная команда. Используйте /help для справки."
      );
  }
}

async function handleArticleCreation(
  userId: number,
  text: string,
  message: TelegramMessage
) {
  const state = userStates.get(userId);
  if (!state) return;

  const chatId = message.chat.id;

  switch (state.step) {
    case "awaiting_title":
      state.data.title = text;
      state.step = "awaiting_content";
      await sendMessage(
        chatId,
        "✅ Заголовок сохранен!\n\n" +
          "Шаг 2/4: Введите содержание статьи (в формате Markdown)"
      );
      break;

    case "awaiting_content":
      state.data.content = text;
      state.step = "awaiting_excerpt";
      await sendMessage(
        chatId,
        "✅ Содержание сохранено!\n\n" +
          'Шаг 3/4: Введите краткое описание статьи (excerpt) или отправьте "skip" для пропуска'
      );
      break;

    case "awaiting_excerpt":
      if (text.toLowerCase() !== "skip") {
        state.data.excerpt = text;
      }
      state.step = "awaiting_image";
      await sendMessage(
        chatId,
        "✅ Описание сохранено!\n\n" +
          'Шаг 4/4: Отправьте изображение для обложки или введите URL изображения, или "skip" для пропуска'
      );
      break;

    case "awaiting_image":
      if (text.toLowerCase() !== "skip") {
        // URL изображения
        state.data.coverImage = text;
      }
      // Создаем статью
      await createArticle(state.data, message.from?.username, chatId);
      userStates.delete(userId);
      break;
  }
}

async function createArticle(
  data: Partial<{
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
  }>,
  authorUsername: string | undefined,
  chatId: number
) {
  try {
    if (!data.title || !data.content) {
      await sendMessage(
        chatId,
        "❌ Ошибка: не хватает данных для создания статьи."
      );
      return;
    }

    // Генерируем slug
    const slug = generateSlug(data.title);

    // Проверяем уникальность slug
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      await sendMessage(
        chatId,
        `❌ Статья с таким slug уже существует: ${slug}\nИзмените заголовок.`
      );
      return;
    }

    // Создаем статью
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage || "/images/example.webp",
        published: true,
        publishedAt: new Date(),
        authorUsername,
        metaTitle: data.title,
        metaDescription: data.excerpt || data.title,
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const articleUrl = `${siteUrl}/articles/${article.slug}`;

    await sendMessage(
      chatId,
      `✅ <b>Статья успешно создана!</b>\n\n` +
        `📰 <b>Заголовок:</b> ${article.title}\n` +
        `🔗 <b>Slug:</b> ${article.slug}\n` +
        `🌐 <b>URL:</b> ${articleUrl}\n\n` +
        `Статья опубликована и доступна на сайте.`
    );
  } catch (error) {
    console.error("Create article error:", error);
    await sendMessage(
      chatId,
      "❌ Ошибка при создании статьи. Попробуйте позже."
    );
  }
}

function generateSlug(title: string): string {
  const translitMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return title
    .toLowerCase()
    .split("")
    .map(char => translitMap[char] || char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
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
