import { ITelegramContext } from "../../controllers/start";
import { ClientModel, IClient } from "../../../../models/client.model";
import { logger } from "../../utils/winston";
import { initCart } from "../../utils/helpers/cart";

export const getClientInfo = async (ctx: ITelegramContext, next: Function) => {
  const session = ctx.session;
  const i18n = ctx.i18n;

  
  if (ctx.session.cart === undefined) {
    initCart(ctx);
  }

  console.log(ctx.session.cart);

  if (ctx.session.feedback === undefined) {
    ctx.session.feedback = {
      item: {},
      active: false,
    };
  }

  if (session.client) {
    i18n.locale(session.client.language_code);
    logger.debug("Locale set");

    return next();
  }

  let client: IClient;
  const telegram_id =
    ctx.update.message?.from?.id || ctx.update.message?.chat.id;

  try {
    client = ((
      await ClientModel.find({
        telegram_id,
      })
    )[0] as unknown) as IClient;
  } catch (err) {
    logger.error(`getClientInfo: Some problems with DB - ${err.message}`);
    throw new Error(`getClientInfo: Some problems with DB - ${err.message}`);
  }

  if (!client) {
    const newClient = {
      telegram_id: ctx.update.message?.from?.id || ctx.update.message?.chat.id,
      first_name:
        ctx.update.message?.from?.first_name ||
        ctx.update.message?.chat.first_name,
      last_name:
        ctx.update.message?.from?.last_name ||
        ctx.update.message?.chat.last_name,
      username:
        ctx.update.message?.from?.username || ctx.update.message?.chat.username,
      language_code: ctx.update.message?.from?.language_code,
      last_activity: Date.now(),
    };

    try {
      client = ((await new ClientModel(
        newClient
      ).save()) as unknown) as IClient;
      logger.debug("New client created");
    } catch (err) {
      logger.error(
        `getClientInfo: Couldn't save new client to DB - ` + err.message
      );
    }

    session.client = client;
    logger.debug("Client put to session");

    i18n.locale(client.language_code);
    logger.debug("Locale set");

    // TODO: Add avatar support for keeping avatars of all the users
    // TODO: Add Error Handlers on saving and others for DB
  } else {
    session.client = client;
    logger.debug("Client put to session");

    i18n.locale(client.language_code);
    logger.debug("Locale set");
  }

  return next();
};
