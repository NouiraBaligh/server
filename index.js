const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const auth = require("./routes/auth.route");
const articles = require("./routes/articles.route");
const cookieParser = require("cookie-parser");
//DB config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
const connect = mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo DB connected"))
  .catch((err) => console.log(err));
// Cors enable
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:19006",
      "http://localhost:3005",
    ],
    credentials: true,
  })
);

app.use("/public", express.static(path.join(__dirname, "public")));
// Body parser middlware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport middlware
app.use(cookieParser());
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

// Use routes
app.use("/", auth);
app.use("/articles", articles);

// const port = process.env.PORT || 5000;
const port = 5000;

// Swagger documentation
server.listen(port, () => console.log(`server running on port ${port}`));
