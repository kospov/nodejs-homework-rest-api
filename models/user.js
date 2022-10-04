const { Schema, model } = require("mongoose");
const { passwordRegEx, emailRegEx } = require("../constants");

const userSchema = new Schema(
  {
    password: {
      type: String,
      match: [passwordRegEx, "Not valid password"],
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: [emailRegEx, "Not valid email"],
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
  },
  { versionKey: false }
);

const User = model("User", userSchema);

module.exports = User;
