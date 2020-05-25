import mongoose, { Schema } from "mongoose";

export interface IClient {
  id: string;
  telegram_id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  email?: string;
  password?: string;
  phone_number: string
}

const clientSchema: Schema = new mongoose.Schema(
  {
    telegram_id: {
      type: Number,
      unique: true,
      required: true,
      trim: true,
    },
    first_name: {
      type: String,
      default: null,
      trim: true,
    },
    last_name: {
      type: String,
      default: null,
      trim: true,
    },
    username: {
      type: String,
      default: "ukr",
      trim: true,
    },
    language_code: {
      type: String,
      trim: true,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: Schema.Types.ObjectId,
    },
    last_activity: {
      type: Schema.Types.Date,
    },
    password: {
      type: String,
    },
    role: {
        type: String, 
        default: "CLIENT"
    }
  },
  {
    timestamps: true,
  }
);

export const ClientModel = mongoose.model("Client", clientSchema, "clients");
