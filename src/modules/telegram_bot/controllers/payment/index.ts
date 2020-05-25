import Scene from "telegraf/scenes/base";
import { getClientInfo } from "../../middlewares/functional/getClientInfo";
import { fetchCartItems } from "../../middlewares/functional/fetchCartItems";
import { updateUserActivity } from "../../middlewares/functional/updateUserActivity";
import { ITelegramContext } from "../start";
import Keyboard from "telegraf-keyboard";
import { ClientModel, IClient } from "../../../../models/client.model";
import { IOrder, OrderModel } from "../../../../models/order.model";
import { ICartItem, CartModel } from "../../../../models/cart.model";
import { logger } from "../../utils/winston";
import { orderNotifier } from "../../utils/feedback";

export const payment = new Scene("payment");

payment.enter(
  getClientInfo,
  fetchCartItems,
  updateUserActivity,
  async (ctx: ITelegramContext) => {
    const payment_list = new Keyboard({ inline: true })
      .add(`${ctx.i18n.t("scenes.payment.options.privatBank")}:PrivatBank`)
      .add(`${ctx.i18n.t("scenes.payment.options.novaPoshta")}:NovaPoshta`)
      .add(`${ctx.i18n.t("scenes.payment.options.pickup")}:Pickup`)
      .add(`${ctx.i18n.t("scenes.payment.options.delivery")}:Delivery`);

    await ctx.reply(
      ctx.i18n.t("scenes.payment.paymentList"),
      payment_list.draw()
    );
    setTimeout(() => {
      ctx.reply(
        ctx.i18n.t("toAction.chooseOptionToPay"),
        new Keyboard().add(ctx.i18n.t("navigation.cancel")).draw()
      );
    }, 1000);
  }
);

payment.hears(
  /(Cancel)|(Скасувати)|(Отметить)/i,
  getClientInfo,
  async (ctx: ITelegramContext) => {

    await ctx.reply(ctx.i18n.t("alerts.cancelled"));
    ctx.scene.enter("home");
  }
);

payment.leave(async (_: ITelegramContext) => {});

export default payment;

payment.action("PrivatBank", getClientInfo, async (ctx: ITelegramContext) => {
  const client = ctx.session.client;

  if (!client.phone_number) {
    ctx.reply(ctx.i18n.t("scenes.payment.phoneNumberQuestion"));

    payment.on("text", getClientInfo, async (ctx: ITelegramContext) => {
      const client = ctx.session.client;
      const feedback = ctx.message?.text as string;

      if (/\+{0,1}[0-9]+/i.test(feedback)) {
        try {
          await updateUser(ctx, client.id, { phone_number: feedback });
          await createOrder(ctx, "PrivatBank");

          await ctx.reply(ctx.i18n.t("scenes.payment.managerWillContact"));
          await ctx.scene.enter("shop");
        } catch (err) {
          await ctx.reply(ctx.i18n.t("system.error"));
          logger.error(`Payment: ${err.message}`);
          await ctx.scene.enter("cart");
        }
      }
    });
  } else {
    await createOrder(ctx, "PrivatBank");

    await ctx.reply(`${client.first_name}!`);
    await ctx.reply(ctx.i18n.t("scenes.payment.managerWillContact"));
    await ctx.scene.enter("shop");
  }
  ctx.answerCbQuery();
});

payment.action("NovaPoshta", getClientInfo, (ctx: ITelegramContext) => {
  ctx.answerCbQuery(
    `${ctx.reply(ctx.i18n.t("system.underConstruction"))}`,
    true
  );
});

payment.action("Pickup", getClientInfo, (ctx: ITelegramContext) => {
  ctx.answerCbQuery(`This method currently doesn't work.`, true);
});

payment.action("Delivery", getClientInfo, (ctx: ITelegramContext) => {
  ctx.answerCbQuery(`This method currently doesn't work.`, true);
});

export async function createOrder(
  ctx: ITelegramContext,
  payment_method: string
) {
  const client = ctx.session.client;
  const cart_items = ctx.session.cart.items;
  const order_total = cart_items.reduce(
    (acc: number, value: ICartItem) => acc + value.unit_total,
    0
  );

  const order: IOrder = {
    client_id: client.id,
    client_name: `${client.first_name} ${client.last_name}`,
    client_phone_number: client.phone_number,
    item_number: cart_items.length,
    items: cart_items,
    order_total,
    payment_method: payment_method,
  };

  const createdOrder = await new OrderModel(order).save() as unknown as IOrder;

  if (ctx.session.cart.orders?.length) {
    ctx.session.cart.orders.push(createdOrder);
  } else {
    ctx.session.cart.orders = [createdOrder];
  }

  if (createdOrder) {
    CartModel.deleteMany({ client_id: client.id }).exec();
    ctx.session.cart.items = [];
  }

  orderNotifier(ctx, 476963932, (createdOrder as unknown) as IOrder);

  return createdOrder;
}

export async function updateUser(
  ctx: ITelegramContext,
  id: string,
  update: object
) {
  try {
    const updated = ((await ClientModel.findByIdAndUpdate(id, update, {
      new: true,
    })) as unknown) as IClient;

    if (updated) {
      ctx.session.client = updated as IClient;
    }

    return updated;
  } catch (err) {
    logger.error(`Client: ${err.message}`);
    return;
  }
}
