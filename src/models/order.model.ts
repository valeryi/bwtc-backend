import mongoose, { Schema } from "mongoose";

export type IOrder = {
  id?: string;
  client_id: string;
  client_name: string;
  client_phone_number: string;
  item_number: number;
  order_total: number;
  items: object[];
  payment_method: string;
  status?: string;
  payment_status?: string
};

const orderSchema: Schema = new mongoose.Schema(
  {
    client_id: {
      type: String,
    },
    client_name: {
      type: String,
    },
    client_phone_number: {
      type: String,
    },
    product_id: {
      type: String,
    },
    product_name: {
      type: String,
    },
    item_number: {
      type: Number,
    },
    order_total: {
      type: Number,
    },
    items: {
        type: Array
    },
    payment_method: {
      type: String
    },
    status: {
      type: String,
      default: 'OPEN'
    },
    payment_status: {
      type: String,
      default: 'NOT PAID'
    }
  },

  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model("Order", orderSchema, "order");
