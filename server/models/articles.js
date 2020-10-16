const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    edges: [String],
    distance: Number, // Distance in steps to starting article 'Rijeka'
    path: [String]
});

// First argument is the singular name of the collection
// NOTE: Mongoose automatically looks for the plural version of the model name
module.exports = mongoose.model("Article", articleSchema);