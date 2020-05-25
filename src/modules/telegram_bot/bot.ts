require("dotenv").config();

import { Telegraf } from "telegraf";
import { applyMiddlewares } from "./middlewares";
import {Express} from 'express'

import { updateUserActivity } from "./middlewares/functional/updateUserActivity"; // TODO: Structure well - this is a common function
import { ITelegramContext } from "./controllers/start";
import { getClientInfo } from "./middlewares/functional/getClientInfo";
import { getProducts } from "./middlewares/functional/getProducts";
import { errorHandler } from "./error handlers";
import { launchDevMode, launchProdMode } from "./utils/launch.modes";
import { env } from "../../environments";

export function initTelegramBot(server: Express) {
  const bot = new Telegraf(env.telegram.token as string);

  applyMiddlewares(bot);
  errorHandler(bot);

  bot.start(
    //@ts-ignore
    getClientInfo,
    updateUserActivity,
    async (ctx: ITelegramContext) => {
      ctx.scene.enter("start");
    }
  );

  bot.hears(
    /(Settings)|(Настройки)|(Налаштування)/i,
    //@ts-ignore
    getClientInfo,
    updateUserActivity,
    async (ctx: ITelegramContext) => ctx.scene.enter("settings")
  );

  bot.hears(
    /(Contacts)|(Контакты)|(Контакти)/i,
    //@ts-ignore
    getClientInfo,
    updateUserActivity,
    async (ctx: ITelegramContext) => {
      ctx.reply(ctx.i18n.t("system.underConstruction"));
    }
  );

  bot.hears(
    /(Cart)|(Корзина)|(Кошик)/i,
    //@ts-ignore
    async (ctx: ITelegramContext) => ctx.scene.enter("cart")
  );

  bot.hears(
    /^(Shops)|(Магазины)|(Магазини)$/i,
    //@ts-ignore
    getClientInfo,
    getProducts,
    updateUserActivity,
    (ctx: ITelegramContext) => {
      ctx.reply(ctx.i18n.t("system.underConstruction"));
    }
  );

  bot.hears(
    /(Shop)|(Магазин)|(Магазин)/i,
    //@ts-ignore
    getClientInfo,
    getProducts,
    updateUserActivity,
    (ctx: ITelegramContext) => {
      //@ts-ignore
      ctx.scene.enter("shop");
    }
  );

  bot.hears(
    /(Work)|(Работаем)|(Працюємо)/i,
    //@ts-ignore
    getClientInfo,
    getProducts,
    updateUserActivity,
    (ctx: ITelegramContext) => {
      ctx.reply(ctx.i18n.t("system.underConstruction"));
    }
  );

  //@ts-ignore
  bot.command("home", async (ctx: ITelegramContext) => ctx.scene.enter("home"));

  process.env.NODE_ENV === "development"
    ? launchDevMode(bot, env.telegram.token as string)
    : launchProdMode(bot, server, env.telegram.token as string);
}
