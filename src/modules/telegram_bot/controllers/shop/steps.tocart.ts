import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { getClientInfo } from "../../middlewares/functional/getClientInfo";
import Keyboard from "telegraf-keyboard";
import { logger } from "../../utils/winston";
import { fetchCartItems } from "../../middlewares/functional/fetchCartItems";
import { addActive } from "../../utils/helpers/cart";
import { createCartItem } from "../../utils/helpers/cart";
import { clearActive } from "../../utils/helpers/cart";
import { addCartItem } from "../../utils/helpers/cart";
import { currencyFormat } from "../../utils/helpers/common";
import { onCancel } from "../../utils/feedback";
import { ICartItem } from "../../../../models/cart.model";

const grindQuestion = new Scene("grindQuestion");

grindQuestion.enter(getClientInfo, async (ctx: ITelegramContext) => {
  const grindOptions = new Keyboard().add(
    ctx.i18n.t("scenes.shop.questions.grind.answers.yes"),
    ctx.i18n.t("scenes.shop.questions.grind.answers.no")
  );

  await ctx.reply(
    ctx.i18n.t("scenes.shop.questions.grind.question"),
    grindOptions.draw()
  );
  await ctx.reply(ctx.i18n.t("toAction.choose"));

  grindQuestion.on("text", getClientInfo, async (ctx: ITelegramContext) => {
    addActive(ctx, "grind", ctx.message?.text as string);

    if (
      ctx.message?.text ===
      ctx.i18n.t("scenes.shop.questions.grind.answers.yes")
    ) {
      return ctx.scene.enter("methodQuestion");
    } else {
      return ctx.scene.enter("finaltocart");
    }
  });
});

//QUESTION 3
const methodQuestion = new Scene("methodQuestion");

methodQuestion.enter(getClientInfo, async (ctx: ITelegramContext) => {
  await ctx.reply(
    ctx.i18n.t("scenes.shop.questions.method.question"),
    new Keyboard().clear()
  );

  methodQuestion.on("text", getClientInfo, (ctx: ITelegramContext) => {
    addActive(ctx, "description", ctx.message?.text as string);

    return ctx.scene.enter("finaltocart");
  });
});

//QUESTION AMOUNT
const amountQuestion = new Scene("amountQuestion");

amountQuestion.enter(getClientInfo, async (ctx: ITelegramContext) => {
  ctx.reply(
    ctx.i18n.t("scenes.shop.questions.amount.question"),
    new Keyboard().clear()
  );

  amountQuestion.on("text", getClientInfo, async (ctx: ITelegramContext) => {
    if (!/^([0-9]+$)/i.test(ctx.message?.text as string)) {
      await ctx.reply(
        ctx.i18n.t("scenes.shop.questions.amount.validation.notNumber1")
      );
      await ctx.reply(
        ctx.i18n.t("scenes.shop.questions.amount.validation.notNumber2")
      );
      await ctx.reply(
        ctx.i18n.t("scenes.shop.questions.amount.validation.notNumber3")
      );
    } else {
      addActive(ctx, "amount", ctx.message?.text as string);

      return ctx.scene.enter("grindQuestion");
    }
  });
});

//FINAL SCENE TO CART
const finaltocart = new Scene("finaltocart");

finaltocart.enter(getClientInfo, async (ctx: ITelegramContext) => {
  const cart_item = createCartItem(ctx);

  const keyboard = new Keyboard()
    .add(ctx.i18n.t("navigation.addToCart"), ctx.i18n.t("navigation.pay"))
    .add(ctx.i18n.t("navigation.cancel"));

  await ctx.replyWithHTML(
    `${ctx.i18n.t("scenes.shop.youPicked")} - <b>${cart_item.product_name}</b>`
  );
  await ctx.replyWithHTML(
    `${ctx.i18n.t("scenes.shop.itCosts")} - <b>${currencyFormat(
      cart_item.unit_total,
      true
    )}</b> ${ctx.i18n.t("scenes.shop.for")} ${cart_item.amount} ${ctx.i18n.t(
      "scenes.shop.items"
    )}`
  );
  await ctx.reply(
    `${ctx.i18n.t("scenes.shop.questions.addOrPay")}`,
    keyboard.draw()
  );
});

finaltocart.leave((ctx: ITelegramContext) => {
  logger.debug("Shop: cleaning active and leaving shop");
  clearActive(ctx);
});

export default [grindQuestion, methodQuestion, amountQuestion, finaltocart];

finaltocart.hears(
  /(Cancel)|(Скасувати)|(Отметить)/i,
  getClientInfo,
  async (ctx: ITelegramContext) => {

    onCancel(ctx);

    ctx.session.cart.cart_item = null; //TODO: Implement order tracking with two states - cancelled and in cart but not bought.

    await ctx.reply(`${ctx.i18n.t("alerts.cancelled")}`);
    await ctx.scene.enter("shop");
  }
);

finaltocart.hears(
  /(Pay)|(Оплатити)|(Оплатить)/i,
  async (ctx: ITelegramContext) => {
    const item = ctx.session.cart.cart_item as ICartItem;

    await addCartItem(ctx, item);
    ctx.scene.enter("payment");
  }
);

finaltocart.hears(
  /(To cart)|(Добавить)|(Додати)/i,
  getClientInfo,
  fetchCartItems,
  async (ctx: ITelegramContext) => {
    const item = ctx.session.cart.cart_item as ICartItem;

    await addCartItem(ctx, item);

    await ctx.reply(ctx.i18n.t("alerts.putToCart"));
    ctx.scene.enter("shop");
  }
);
