module.exports = Object.freeze({
  // Telegram API
  // TELEGRAM_BOT_API_TOKEN: '123456789:ABC-DefgHijKLm01no_23pqRs45TU6v78y9z', // Change with your API TOKEN
  TELEGRAM_BOT_POLLING_INTERVAL_MS: 1000,
  TELEGRAM_BOT_RETRY_TIMEOUT_MS: 5000,
  TELEGRAM_BOT_POLLING_TIMEOUT: 0,
  TELEGRAM_BOT_POLLING_LIMIT: 100,

  // Telebot settings
  TELEBOT_ANTI_FLOOD_INTERVAL: 3,
  TELEBOT_PLUGINS_DIR: '../plugins/', // default plugins dir for Telebot is '../plugins'

  // Broadcasting
  // Telegram BOT spec: Current maximum length is 4096 UTF8 characters. Exceeding this limit will result in getting 400 errors.
  BROADCAST_CHARACTER_LIMIT: 3000, // max 3000 characters.
  // Telegram BOT spec: The API will not allow more than ~30 messages to different users per second, if you go over that, you'll start getting 429 errors.
  BROADCAST_INTERVAL_MS: 100, // 10 per second.

  // Database
  DATABASE_DIR: './database/',
  FILE_PREFIX: 'data_',
  FILE_EXT: '.json'
});
