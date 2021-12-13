const express = require("express");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const config = require("config");
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

//Registring a User
router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      config.get("cryptojsKey")
    ).toString(),
  });

  user = await user.save();
  res.status(200).send(user);
});

//Updating a User
router.put("/:id", auth, async (req, res) => {
  if (req.body.password)
      req.body.password = CryptoJS.AES.encrypt( req.body.password, config.get("cryptojsKey").toString());

  const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!user) return res.status(404).send("Could not update");

  res.status(200).send(user)
})

//Deleting a User 
router.delete('/:id', [auth, admin], async(req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("No Such User")

  res.status(200).send('User deleted successfully..')
})

//Getting a user 
router.get('/:id', [auth, admin], async(req, res) => {
  const user = await User.findById(req.params.id)
  if(!user) return res.status(404).send('User not found')

  res.status(200).send(user)
})

//Getting all users
router.get('/', [auth, admin], async(req, res) => {
  const user = await User.find()
  if(!users) return res.status(404).send('No user found')

  res.status(200).send(users)
})

module.exports = router;