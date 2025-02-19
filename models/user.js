import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

// eslint-disable-next-line no-useless-escape
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionList = ["starter", "pro", "business"];

export const authSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().messages({
    "string.pattern.base": "Ошибка от Joi или другой библиотеки валидации",
    // "any.required": "missing field email",
  }),
  password: Joi.string().min(6).required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().messages({
    "string.pattern.base": "Ошибка от Joi или другой библиотеки валидации",
    // "any.required": "missing field email",
  }),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

const userSchema = new Schema(
  {
    password: {
      type: String,
      minLength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegExp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      required: [true, "Subscription is required"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      // required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

userSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
