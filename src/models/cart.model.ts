import mongoose, { Schema } from "mongoose";
import { IOrder } from "./order.model";
import { IProduct } from "./product.model";

export type IProductDetailQuestion = {
  question: string;
  answer: string;
};

export type ICart = {
  items: ICartItem[];
  active: {
    product: IProduct;
    details: IProductDetailQuestion[];
  };
  cart_item: ICartItem | null;
  orders?: IOrder[];
  correction?: any;
};

export type ICartItem = {
  id?: string;
  client_id: string;
  product_id: string;
  product_name: string;
  pack: string;
  amount: number;
  unit_price: number;
  unit_total: number;
  details: IProductDetailQuestion[];
};

const cartSchema: Schema = new mongoose.Schema(
  {
    client_id: {
      type: String,
    },
    product_id: {
      type: String,
    },
    product_name: {
      type: String,
    },
    pack: {
      type: String,
    },
    amount: {
      type: Number,
    },
    unit_price: {
      type: Number,
    },
    unit_total: {
      type: Number,
    },
    details: {
      type: Array,
    },
  },

  {
    timestamps: true,
  }
);

export const CartModel = mongoose.model("Cart", cartSchema, "cart");
