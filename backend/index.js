require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const { connection } = require("./db");
const { userRouter } = require("./Routes/user.routes");

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req, res) =>
  res.send(
    `<h1 style="text-align:center; color:purple">Welcome To Backend</h1>`
  )
);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected To Database");
    console.log(`Server is UP & Running on ${process.env.port}`);
  } catch (error) {
    console.log("Error", error.message);
  }
});
