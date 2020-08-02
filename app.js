var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Article = require('./models/articles.js');

// const seed = require('./seed.js')    // Database seeding


//====================================================
// MONGOOSE SETUP
//====================================================

// mongoose.connect('mongodb://localhost:27017/test', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// Database seeding
// (async () => {
//     seed.seedDb('Rijeka');
// })();

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("landing");
});

app.listen(3000, () => {
    console.log("Server starting at port 3000 ...");
});