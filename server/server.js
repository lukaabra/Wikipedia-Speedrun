const express = require('express'),
    app = express(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    path = require('path'),
    port = process.env.PORT || 3001,
    publicPath = path.join(__dirname, '..', 'public');

// DATABASE SEEDING
// const seed = require('../seed/seed');

// REQUIRING ROUTES
const scoresRouter = require('./api/scores');
const randomArticleRouter = require('./api/generateRandom');
const articleRouter = require('./api/article');

const uri = 'mongodb+srv://Wiki:speedrun@wikicluster.vll3i.mongodb.net/wiki_articles?retryWrites=true&w=majority';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// (async () => {
//     //====================================================
//     // MONGOOSE SETUP
//     // Connection is awaited to prevent database actions rushing before the connection is established.
//     //====================================================
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

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

app.use(scoresRouter);
app.use(randomArticleRouter);
app.use(articleRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log("Server started at port 3001.");
});