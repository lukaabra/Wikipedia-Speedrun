const seed = require('./seed.js')

const Article = require('./models/articles.js')


//====================================================
// MONGOOSE SETUP
//====================================================

mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// (async () => {
//     seed.seedDb('Rijeka');
// })();