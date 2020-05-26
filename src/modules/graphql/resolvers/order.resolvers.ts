import { orderService } from "../../../services/order.service";
import { IOrder } from "../../../models/order.model";

export const resolvers = {
  Query: {
    allOrders: async (_obj: any, _args: any, _context: any, _info: any) => {
      return await orderService.allOrders();
    },
    fetchOrder: async (
      _obj: any,
      { id }: { id: string },
      _context: any,
      _info: any
    ) => {
      return await orderService.fetchOrder(id);
    },
  },

  Mutation: {
    createOrder: async (
      _obj: any,
      { data }: { data: IOrder },
      _context: any,
      _info: any
    ) => {
      return await orderService.createOrder(data);
    },

    deleteOrder: async (_obj: any, { id }: any, _context: any, _info: any) => {
      return await orderService.deleteOrder(id);
    },

    updateOrder: async (
      _obj: any,
      { id, data }: { id: string; data: IOrder },
      _context: any,
      _info: any
    ) => {
      return await orderService.updateOrder(id, data);
    },
  },
};
