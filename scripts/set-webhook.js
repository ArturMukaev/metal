// Script to set Telegram webhook
// Usage: node scripts/set-webhook.js

require("dotenv").config({ path: ".env.local" });

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL;

if (!TELEGRAM_BOT_TOKEN || !WEBHOOK_URL) {
  console.error(
    "❌ Error: TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_URL must be set in .env.local"
  );
  process.exit(1);
}

async function setWebhook() {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ["message"],
      }),
    });

    const result = await response.json();

    if (result.ok) {
      console.log("✅ Webhook successfully set!");
      console.log(`🔗 Webhook URL: ${WEBHOOK_URL}`);
      console.log("\nWebhook info:", result.result);
    } else {
      console.error("❌ Error setting webhook:", result);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

setWebhook();
