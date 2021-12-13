const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function (user) {
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    config.get("jwtPrivateKey"),
    { expiresIn: "1d" }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
