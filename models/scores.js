const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    name: String,
    time: String,
    steps: Number,
    minPossibleSteps: Number,
    startingArticle: String,
    score: Number
});

// First argument is the singular name of the collection
// NOTE: Mongoose automatically looks for the plural version of the model name
module.exports = mongoose.model("Score", articleSchema);