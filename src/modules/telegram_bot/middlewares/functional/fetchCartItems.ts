import { ITelegramContext } from "../../controllers/start";
import { logger } from "../../utils/winston";
import { CartModel, ICartItem } from "../../../../models/cart.model";

export const fetchCartItems = async (ctx: ITelegramContext, next: Function) => {
  const client_id = ctx.session.client.id;
  let cart_items: ICartItem[] = [];

  if (
    (ctx.session.cart.items !== undefined || ctx.session.cart.items !== null) &&
    ctx.session.cart.items.length
  ) {
    return next();
  }

  try {
    const result = ((await CartModel.find({
      client_id,
    })) as unknown) as ICartItem[];
    result && result.length ? (cart_items = [...result]) : (cart_items = []);
    logger.debug("Cart items fetched");
  } catch (err) {
    logger.error(`fetchCartItems: Some problems with DB - ${err.message}`);
    throw new Error(`fetchCartItems: Some problems with DB - ${err.message}`);
  }

  ctx.session.cart.items = cart_items;
  logger.debug("Cart items refreshed in session");

  return next();
};
