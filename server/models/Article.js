const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  titleID: String,
  titleEN: String,
  descriptionID: String,
  descriptionEN: String,
  articleDate: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
  imageCover: String,
});

const ArticleModel = mongoose.model("articles", ArticleSchema);
module.exports = ArticleModel;
