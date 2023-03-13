const express = require("express");

const connectToMongoDB = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("Connected to MongoDB");
});

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res, next) => {
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

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
