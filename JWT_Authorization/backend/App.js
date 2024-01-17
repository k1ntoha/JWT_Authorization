const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");

const port = process.env.PORT || 4567;
const app = express();

app.use(express.json());
app.use(cookieParser({ verify: false }));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use("/api/v1", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(port, () => {
      console.log(`Сервер зпущен и подключён к базе данных...`);
    });
  } catch (e) {
    console.log(e);
  }
};
start();
