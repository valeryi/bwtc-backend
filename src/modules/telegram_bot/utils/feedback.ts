import cron from "node-cron";
import { ITelegramContext } from "../controllers/start";
import Keyboard from "telegraf-keyboard";

import Scene from "telegraf/scenes/base";
import { getClientInfo } from "../middlewares/functional/getClientInfo";
import { currencyFormat } from "./helpers/common";
import { IOrder } from "../../../models/order.model";
import { logger } from "../../../utils/winston";

const feedback = new Scene("feedback");

feedback.enter(getClientInfo, async (ctx: ITelegramContext) => {
  await ctx.replyWithHTML(
    ctx.i18n.t("feedback.onCartCancel.noticed") // TODO: Implement feedback function with order was cancelled, user should be asked if he needs any help
  );
  await ctx.reply(
    ctx.i18n.t("feedback.onCartCancel.offer"),
    new Keyboard({ inline: true })
      .add(`${ctx.i18n.t("feedback.onCartCancel.actionButton")}:consult`)
      .draw()
  );
});

export default feedback;

feedback.action("consult", async (ctx: ITelegramContext) => {
  ctx.reply(
    `${ctx.session.client.first_name}, \n\nНаш специалист свяжется с Вами в ближайшее время`
  );
  await ctx.telegram.sendMessage(
    476963932,
    `Мне нужна консультация.\n\nМеня зовут ${ctx.session.client.first_name}, \nмой ID ${ctx.session.client.telegram_id}\n`
  );
  ctx.answerCbQuery();
});

export async function onCancel(ctx: ITelegramContext) {
  if (!ctx.session.feedback.active) {
    ctx.session.feedback = {
      active: true,
    };
    const task = cron.schedule("*/5 * * * *", async () => {
      ctx.scene.enter("feedback");
      ctx.session.feedback = {};
      task.destroy();
    });
  }
}

export async function orderNotifier(
  ctx: ITelegramContext,
  manager_id: number,
  order: IOrder
) {
  const content = order.items.reduce((acc: string, item: any) => {
    return acc.concat(
      ` - <b>${item.product_name}</b> x ${item.amount} | ${
        item.pack
      } = ${currencyFormat(item.unit_total)}\n`
    );
  }, "");

  const header = `
<b>Новый заказ</b>  

`;

  const footer = `
<i>Клиент:</i> ${order.client_name}
<i>Оплата через:</i> ${order.payment_method}
<i>Контактный номер телефона:</i> ${order.client_phone_number}
<i>Сумма заказа:</i> ${currencyFormat(order.order_total)}
<i>ID заказа:</i> ${order.id}
`;

  const template = [header, content, footer].join("");

  // Set proper style
  await ctx.telegram.sendMessage(manager_id, template, { parse_mode: "HTML" });
  logger.debug("informed manager about order: " + JSON.stringify(order));
}
