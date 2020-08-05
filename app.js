var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Article = require('./models/articles.js');

const seed = require('./seed.js')


//====================================================
// MONGOOSE SETUP
//====================================================

mongoose.connect('mongodb://localhost:27017/wiki_articles', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// (async () => {
//     seed.seedDb('Rijeka');
// })();

// app.listen(3000, (req, res) => {
//     console.log("Serving on port 3000 ...");
// })