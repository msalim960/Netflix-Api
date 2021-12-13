const express = require("express");
const config = require("config");
const _ = require("lodash");
const CryptoJS = require("crypto-js");
const User = require("../models/User");

const router = express.Router();
//Logging in a user
router.post("/me", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("invalid email or password");

  //Decrypting the password
  const bytes = CryptoJS.AES.decrypt(user.password, config.get("cryptojsKey"));
  const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

  if (decryptedPassword !== req.body.password)
    return res.status(400).send("invalid email or password");
  const token = user.generateAuthToken(user);

  res
    .header("auth-token", token)
    .status(200)
    .send(_.pick(user, ["_id", "email", "username", "profilePicture"]));
});

module.exports = router;
