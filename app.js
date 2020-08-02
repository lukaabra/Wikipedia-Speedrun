const api = require("./api.js");
const graph = require("./graph");
const mongoose = require("mongoose");

const Article = require('./models/articles.js')


//====================================================
// MONGOOSE SETUP
//====================================================
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// HOW MANY STEPS DOES IT TAKE TO REACH DONALD TRUMP
(async () => {

    // graph.seedDb('Rijeka');

})();