import TelegrafI18n from "telegraf-i18n";
import path from "path";
import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";

const i18n = new TelegrafI18n({
  defaultLanguage: "ukr",
  allowMissing: false,
  directory: path.resolve(process.cwd(), 'src', 'modules', 'telegram_bot', "locales"),
});

const i18nMiddleware = (bot: Telegraf<TelegrafContext>) => {
  bot.use(i18n.middleware());
};

export default i18nMiddleware;
