import { Express } from "express";
import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { sysLog } from "./winston";

export async function launchProdMode(
  bot: Telegraf<TelegrafContext>,
  server: Express,
  TOKEN: string
) {
  bot.telegram.setWebhook(
    `https://fathomless-wave-38776.herokuapp.com/bot${TOKEN}`
  );

  server.use(bot.webhookCallback(`/bot${TOKEN}`));

  const info = await bot.telegram.getWebhookInfo();
  sysLog.info(`Telegram Bot running in a production mode: Token: ${TOKEN}`);
  sysLog.info(`Telegram Bot: WebHookURL ${info.url}`);
}

export function launchDevMode(
  bot: Telegraf<TelegrafContext>,
  TOKEN: string
) {
  bot.telegram.setWebhook(``);
  bot
    .launch()
    .then(() =>
      sysLog.info(`Telegram Bot running in a development mode: Token: ${TOKEN}`)
    );
}
