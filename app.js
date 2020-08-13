var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Article = require('./models/articles');

const seed = require('./seed') // Database seeding

const graph = require('./graph')

// REQUIRING ROUTES
var indexRoutes = require('./routes/index'),
    playRoutes = require('./routes/play');

//====================================================
// MONGOOSE SETUP
//====================================================

(async () => {
    try {
        // Mongoose connection is being awaited before the database seeding function is called because of a
        // connection timeout error if the connection is not omitted. I suspect the reason is because not enough time
        // passes from the mongoose.connection call to the first database create call inside saveGraphToDb.
        await mongoose.connect('mongodb://localhost:27017/wiki_articles', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (err) {
        console.log(err);
    }

    // Database seeding
    await seed.saveGraphToDb();

    await Article.find({}, (err, found) => {
        console.log(found)
    })
})()

// app.set("view engine", "ejs");

// app.use(indexRoutes);
// app.use(playRoutes);

// app.listen(3000, () => {
//     console.log("Server starting at port 3000 ...");
// });