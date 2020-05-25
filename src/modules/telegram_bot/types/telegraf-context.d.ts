import { I18n } from 'telegraf-i18n';
import { IClient } from '../../../models/client.model';
import { ICart } from '../../../models/cart.model';
import { IProduct } from '../../../models/product.model';

declare module 'telegraf' {
  interface ContextMessageUpdate {
    i18n: I18n;
    scene: any;
    session: {
      products: IProduct[],
      client: IClient,
      cart: ICart,
      feedback: any
    };
    webhookReply: boolean;
  }
}
