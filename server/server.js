//  Node packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const registerHousesRoute = require("./routes/items/api-register-houses");
const authRoute = require("./routes/auth/auth");
const userRoute = require("./routes/auth/user");
const articleRoute = require("./routes/items/articles");
const path = require("path");
const cors = require("cors");
//  =================================================
//  Connection with express modules
const app = express();
const PORT = process.env.PORT;
//  ========================================
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));

app.use(express.static("client/build"));
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Succesfuly Connected to MongoDB Atlas"))
  .catch((err) => console.log(err.message));

app.use("/api", registerHousesRoute);
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", articleRoute);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// PORT Listener
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
