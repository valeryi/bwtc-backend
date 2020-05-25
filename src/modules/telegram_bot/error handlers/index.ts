import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ITelegramContext } from "../controllers/start";
import { logger } from "../../../utils/winston";

export function errorHandler(bot: Telegraf<TelegrafContext>) {
  bot.catch((err: Error, _: ITelegramContext) => {
    logger.error(err.message);
    bot.telegram.sendMessage(
      476963932,
      `uncaughtException: "${err.message}" at /${Date.now()}/`
    );
  });
}
