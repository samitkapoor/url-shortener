const express = require("express");
const path = require("path");

const connectToMongoDB = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("Connected to MongoDB");
});

app.use("/url", urlRoute);

app.use("/id/:shortId", async (req, res, next) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );

  res.redirect(entry.redirectUrl);
});

app.use("/", (req, res, next) => {
  res.render("form");
  // res.render("result", { link: "http://localhost:3000/=g00taL7S6" });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
