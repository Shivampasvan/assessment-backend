const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { auth } = require("../Middleware/auth.middleware");

//**************************************************************************************
//**************************************************************************************

userRouter.post("/signup", async (req, res) => {
  const { email } = req.body;
  const useremailfound = await UserModel.find({ email });

  if (useremailfound.length === 0) {
    try {
      const { email, password } = req.body;
      bcrypt.hash(password, 5, async (err, hash) => {
        const user = new UserModel({
          email,
          password: hash,
        });
        await user.save();
        res.status(200).send("SignUp Successful !!");
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  } else if (useremailfound.length >= 1) {
    res
      .status(400)
      .send("An account has already been registered with same emailId !!");
  }
});

//**************************************************************************************
//**************************************************************************************

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    user.length > 0
      ? bcrypt.compare(password, user[0].password, (err, result) => {
          result === true
            ? res.status(200).send({
                msg: "Login Successful!",
                token: jwt.sign(
                  {
                    foo: "Auth",
                  },
                  "password"
                ),
                user: user,
              })
            : res.status(400).send("Wrong Password");
        })
      : res.status(400).send("No User Found With Such Credentials");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//**************************************************************************************
//**************************************************************************************

userRouter.get("/list", auth, async (req, res) => {
  try {
    const user = await UserModel.find();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//**************************************************************************************
//**************************************************************************************

userRouter.post("/employees", async (req, res) => {
  try {
    const new_user = new UserModel(req.body);
    await new_user.save();
    res.status(200).send({ msg: "New User Added" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//**************************************************************************************
//**************************************************************************************

userRouter.patch("/update/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UserModel.findByIdAndUpdate(_id, req.body);
    res.status(200).send({ msg: "User Details Updated" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//**************************************************************************************
//**************************************************************************************

userRouter.delete("/delete/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UserModel.findByIdAndDelete(_id);
    res.status(200).send({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = {
  userRouter,
};
