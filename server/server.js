const express = require('express'),
    app = express(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    port = process.env.PORT || 3001,
    publicPath = path.join(__dirname, '..', 'public'),
    dotenv = require('dotenv');

// DATABASE SEEDING
// const seed = require('../seed/seed');

// Routers
const scoresRouter = require('./api/scores');
const randomArticleRouter = require('./api/generateRandom');
const articleRouter = require('./api/article');
const healthRouter = require('./api/healthEndpoint');

const pingHealthEndpoint = require('./test/healthEndpoint');

// Retrieve environment variable
dotenv.config();
const uri = process.env.MONGO_ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// UNCOMMENT THE CODE BELOW IF YOU WANT TO SEED THE DATABASE

// (async () => {
//====================================================
// MONGOOSE SETUP
// Connection is awaited to prevent database actions rushing before the connection is established.
//====================================================
//     mongoose.connect('mongodb://localhost:27017/wiki_articles', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false
//     });

//====================================================
// CREATE GRAPH AND SEED DATABASE
// ! WARNING !
// COMMENT OUT ONLY IF YOU WANT TO WRITE JSON FILES AND DB FROM SCRATCH
//====================================================
// const STARTING_ARTICLE = 'Rijeka'
// await seed.constructGraphToJSON(STARTING_ARTICLE);
// await seed.saveGraphToDb();
// })();

app.use(express.static(publicPath));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Session
app.use(session({
    secret: 'Speedrunning is my passion',
    maxAge: 3600000,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        secure: false
    }
}));

// Routers
app.use(scoresRouter);
app.use(randomArticleRouter);
app.use(articleRouter);
app.use(healthRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

pingHealthEndpoint();

app.listen(port, () => {
    console.log(`Server started at port ${port}.`);
});