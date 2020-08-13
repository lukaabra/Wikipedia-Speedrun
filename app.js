var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Article = require('./models/articles');

const seed = require('./seed/seed') // Database seeding

const graph = require('./seed/graph')

// REQUIRING ROUTES
var indexRoutes = require('./routes/index'),
    playRoutes = require('./routes/play');

//====================================================
// MONGOOSE SETUP
//====================================================
await mongoose.connect('mongodb://localhost:27017/wiki_articles', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");

app.use(indexRoutes);
app.use(playRoutes);

app.listen(3000, () => {
    console.log("Server starting at port 3000 ...");
});