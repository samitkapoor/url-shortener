var shortid = require("shortid");

const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res, next) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const shortId = shortid();
  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
  });

  res.render("result", { link: `http://localhost:3000/id/${shortId}` });
}

async function handleGetAnalytics(req, res, next) {
  const shortId = req.params.shortId;

  const result = await URL.findOne({ shortId });

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
