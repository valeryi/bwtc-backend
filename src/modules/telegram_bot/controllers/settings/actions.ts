import { ITelegramContext } from "../start";
import { ClientModel, IClient } from "../../../../models/client.model";
import { logger } from "../../utils/winston";
import { getActionParams } from "../../utils/helpers/common";

export const changeLanguageAction = async (ctx: ITelegramContext) => {
  const i18n = ctx.i18n;
  const language_code = getActionParams(ctx)[0];
  const session: any = ctx.session;

  try {
    await ClientModel.findOneAndUpdate(
      { telegram_id: session.client.telegram_id },
      { language_code },
      { new: true }
    ) as unknown as IClient;

    session.client.language_code = language_code;
    i18n.locale(language_code);
    logger.debug('Client language updated');
  } catch (err) {
    logger.error(`Couln't not update language`);
    ctx.reply(ctx.i18n.t('system.error'))
  }

  await ctx.scene.reenter();
};
