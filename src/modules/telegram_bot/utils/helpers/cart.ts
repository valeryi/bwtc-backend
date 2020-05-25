import { ITelegramContext } from "../../controllers/start";
import { logger } from "../winston";
import {
  CartModel,
  IProductDetailQuestion,
} from "../../../../models/cart.model";
import { ICartItem } from "../../../../models/cart.model";
import { IProduct } from "../../../../models/product.model";
import { ICart } from "../../../../models/cart.model";
import { IOrder } from "../../../../models/order.model";

export function addActive(
  ctx: ITelegramContext,
  question?: string,
  answer?: string
) {
  if (!question || !answer) {
    logger.error(`Cart: No data provided to put to cart`);
    return;
  }

  if (
    !ctx.session.cart ||
    ctx.session.cart === null ||
    ctx.session.cart === undefined
  )
    initCart(ctx);

  ctx.session.cart.active.details.push({ question, answer });

  logger.debug(
    `Cart: adding details to active products : ${question} - ${answer}`
  );
}

export async function deleteCartItem(ctx: ITelegramContext, id: string) {
  const cart_items = ctx.session.cart.items;

  try {
    await CartModel.findByIdAndDelete(id);
    logger.debug("Cart: item has been deleted");
    const newItems = cart_items.filter((item: ICartItem) => item.id !== id);
    ctx.session.cart.items = newItems;
  } catch (err) {
    logger.error("Cart: something went wrong deleting cart item");
  }
}

export async function updateCartItem(
  ctx: ITelegramContext,
  id: string,
  update: object
) {
  try {
    const updated = ((await CartModel.findByIdAndUpdate(id, update, {
      new: true,
    })) as unknown) as ICartItem;

    const items = ctx.session.cart.items.filter(
      (item: ICartItem) => item.id !== id
    );

    updated ? items.push(updated) : items;
    ctx.session.cart.items = items;
    logger.debug("Cart: item updated");
  } catch (err) {
    logger.error(
      `Cart: something went wrong updating cart item - ${err.message}`
    );
  }
}

export function clearActive(ctx: ITelegramContext) {
  if (
    !ctx.session.cart.active ||
    ctx.session.cart.active === null ||
    ctx.session.cart.active === undefined
  )
    logger.debug("Cart: cart doesn't exist");

  ctx.session.cart.active = {
    product: {} as IProduct,
    details: [] as IProductDetailQuestion[],
  };
  logger.debug(`Cart: active section in cart cleared out`);
}

export function clearCartItem(ctx: ITelegramContext) {
  if (
    !ctx.session.cart.cart_item ||
    ctx.session.cart.cart_item === null ||
    ctx.session.cart.cart_item === undefined
  )
    logger.debug("Cart: cart doesn't exist");

  ctx.session.cart.cart_item = null;
  logger.debug(`Cart: cart item cleared out`);
}

export async function provideCartProduct(
  ctx: ITelegramContext,
  product: IProduct
) {
  if (
    ctx.session.cart.active.product ||
    ctx.session.cart.active.product === "" ||
    ctx.session.cart.active.product === null ||
    ctx.session.cart.active.product === undefined
  ) {
    ctx.session.cart.active.product = product; // TODO: Here Imporve this cart flow with temporary data, espacially product details and order information
  }
}

export function createCartItem(ctx: ITelegramContext) {
  // const products = ctx.session.products;
  const activeProduct = ctx.session.cart.active;

  const pack = activeProduct.details?.filter(
    (n: any) => n.question === "pack"
  )[0].answer as string;

  const amount = activeProduct.details?.filter(
    (n: any) => n.question === "amount"
  )[0].answer as string;

  const unit_price = activeProduct.product?.prices.filter(
    (p: any) => p.name === pack
  )[0].price as string;

  const cart_item: ICartItem = {
    client_id: ctx.session.client.id,
    product_id: activeProduct.product.id,
    product_name: (activeProduct.product as IProduct).name,
    pack,
    amount: parseInt(amount),
    unit_price: parseFloat(unit_price),
    unit_total: +unit_price * +amount,
    details: activeProduct.details.filter(
      (q: any) => q.question !== "amount" && q.question !== "pack"
    ),
  };

  ctx.session.cart.cart_item = cart_item;

  clearActive(ctx);

  return cart_item;
}

export function initCart(ctx: ITelegramContext) {
  const cart: ICart = {
    items: [],
    active: {
      details: [] as IProductDetailQuestion[],
      product: {} as IProduct,
    },
    cart_item: {} as ICartItem,
    orders: [] as IOrder[],
  };

  if (
    !ctx.session.cart ||
    ctx.session.cart == null ||
    ctx.session.cart == undefined
  ) {
    ctx.session.cart = cart;
    logger.debug("Cart: initializing cart in session");
  }
}

export async function addCartItem(ctx: ITelegramContext, item: ICartItem) {
  try {
    const newItem = ((await new CartModel(
      item
    ).save()) as unknown) as ICartItem;
    // const result = await CartModel.find({ client_id }) as unknown as ICartItem[];

    ctx.session.cart.items.push(newItem);
    ctx.session.cart.cart_item = null;
    logger.debug("Cart: new cart item added");
  } catch (err) {
    logger.error("Cart: Something went wrong with adding new cart item");
  }
}
