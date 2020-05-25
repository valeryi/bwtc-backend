import mongoose, { Schema } from "mongoose";

export interface InputUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  role: ROLE;
  avatar: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: ROLE;
  password: string;
  avatar: object;
  confirmed: boolean;
}

export type ROLE = "ADMIN" | "USER";

const userSchema: Schema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String
    },

    confirmed: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        default: "USER"
    }

}, {
    timestamps: true,
});

export const User = mongoose.model('User', userSchema, 'users');
