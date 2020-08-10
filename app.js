var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Article = require('./models/articles');

const seed = require('./seed') // Database seeding

const graph = require('./graph')

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

// let g = new graph.Graph();
// g.addVertex("Rijeka");
// g.addEdge("Rijeka", "Čakovec");
// g.addEdge("Rijeka", "Zagreb");

// g.addVertex("Čakovec");
// g.addEdge("Čakovec", "Rijeka");
// g.addEdge("Čakovec", "Međimurje");

// g.addVertex("Zagreb");
// g.addEdge("Zagreb", "Rijeka");
// g.addEdge("Zagreb", "Dinamo");

// g.addVertex("Međimurje");
// g.addEdge("Međimurje", "Čakovec");

// g.addVertex("Dinamo");
// g.addEdge("Dinamo", "Zagreb");

// g.print();

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