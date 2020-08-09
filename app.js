var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Article = require('./models/articles');

const seed = require('./seed.js') // Database seeding

// REQUIRING ROUTES
var indexRoutes = require('./routes/index'),
    playRoutes = require('./routes/play');

const ARTICLE_COUNT = 47163;

//====================================================
// MONGOOSE SETUP
//====================================================

mongoose.connect('mongodb://localhost:27017/wiki_articles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Database seeding
(async () => {
    seed.seedDb('Rijeka');
})();

// app.set("view engine", "ejs");

// app.use(indexRoutes);
// app.use(playRoutes);

app.listen(3000, () => {
    console.log("Server starting at port 3000 ...");
});