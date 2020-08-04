const wiki = require("./wikiapi.js");

const Article = require('./models/articles.js');

exports.seedDb = async function (start) {
    /*
    Function that seeds the database with Wikipedia articles and their links. Starts at the starting article 'start',
    and finishes after 5 layers of Wikipedia articles and their links have been passed.
    In other words -> 

                        Starting article                    LAYER 0
                       /       |        \               ---------------
                Article #1  Article #2  Article #3          LAYER 1
               /     \          \         /     \       ---------------
      Article #4  Article #5    ...     ...     ...         LAYER 2
          |           |          |       |       |            ...
    */

    //============================================
    // Variable declarations
    //============================================
    let lastArticleInLayer;
    let threshold = 0.05;
    let layer = 0;
    let articleObject = {};

    let explored = new Set();
    let queue = new Set();

    // Variables for logging purposes
    let articlesToNextLayer;
    let articlesPerLayer = [];

    Article.deleteMany({}, () => {})

    //============================================
    // Query the starting article
    //============================================

    articleObject = await wiki.queryArticle(start);

    // Mark the title as explored, and all of its links as queue
    // Mark the last queue article as the end of the current layer of the imaginary graph
    explored.add(articleObject.title);
    articleObject.links.forEach((link) => {

        // Due to a large amount of links for each layer of the imaginary graph, there is only
        // a ~5% chance of the link being parsed reducing the link amount to 5% of the original size
        let chance = (Math.random()).toFixed(2);

        if (chance < threshold) {
            queue.add(link);
            lastArticleInLayer = link
        }
    });

    layer++;
    articlesToNextLayer = queue.size;
    articlesPerLayer.push(articlesToNextLayer);

    // Reduce the original size of links to 5%
    articleObject.links = queue;

    //============================================
    // Store to database
    //============================================

    // Convert to array to be able to store to database
    articleObject.links = Array.from(articleObject.links)

    Article.create(articleObject, (err, newlyCreated) => {
        if (err) console.log("CREATE: " + err);
    });

    logProgress(layer, articlesToNextLayer, explored, queue);

    //============================================
    // Query starting article's links
    //============================================

    for (let item of queue) {
        // Parse the article and store it with it's links to the db
        articleObject = await wiki.queryArticle(item);

        // Since queue contains the links from the previous articles a new list is needed to store
        // only 5% of the total links in articleObject
        let currentItemqueue = new Set();

        if (item == lastArticleInLayer) {
            layer++;
            articlesToNextLayer = queue.size;
            articlesPerLayer.push(articlesToNextLayer);
        }

        // Mark the title as explored, and all of its links as queue
        explored.add(item);
        articleObject.links.forEach((link) => {

            // Due to a large amount of links for each layer of the imaginary graph, there is only
            // a ~5% chance of the link being parsed reducing the link amount to 5% of the original size
            let chance = (Math.random()).toFixed(2);

            // Ensure that a new lastArticleInLayer is assigned
            if (item == lastArticleInLayer) chance = 0;

            if (chance < threshold) {
                // If link is not in explored, add it to the queue (this is to avoid duplicates)
                if (!(explored.has(link))) {
                    currentItemqueue.add(link);
                    queue.add(link);
                    // Mark the last queue article as the end of the current layer of the imaginary graph
                    if (item == lastArticleInLayer) lastArticleInLayer = link;
                }
            }
        });

        // Reduce the original size of links to a tenth
        articleObject.links = currentItemqueue;

        //============================================
        // Store to database
        //============================================

        // Convert to array to be able to store to database
        articleObject.links = Array.from(articleObject.links)

        Article.create(articleObject, (err, newlyCreated) => {
            if (err) console.log("CREATE: " + err);
        });

        logProgress(layer, articlesToNextLayer, explored, queue);

        if (layer == 5) break;
    }

    articlesPerLayer.forEach((articles, index) => {
        console.log("LAYER " + (index + 1) + " HAS " + articles + " ARTICLES.");
    });
    console.log("\n");
    checkNumberOfArticles();

};

function logProgress(layer, articlesToNextLayer, explored, queue) {
    console.log("LAYER: " + layer);
    console.log("ARTICLES TO NEXT LAYER: " + articlesToNextLayer);
    console.log("EXPLORED SIZE: " + explored.size);
    console.log("QUEUE SIZE: " + queue.size);
    console.log("==============================");
};

function checkNumberOfArticles() {
    Article.find({}, (err, allArticles) => {
        if (err) console.log("FINAL FIND: " + err);
        else console.log("NUMBER OF ARTICLES: " + allArticles.length);
    });

    Article.find({
        links: []
    }, (err, allArticles) => {
        if (err) console.log("FINAL FIND: " + err);
        else console.log("NUMBER OF ARTICLES WITH NO LINKS: " + allArticles.length);
    });
};