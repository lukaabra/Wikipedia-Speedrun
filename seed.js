const wiki = require("./wikiapi.js");

const Article = require('./models/articles.js');

const graph = require('./graph');

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
    let threshold = 0.01;
    let layer = 0;
    let articleObject = {};

    let explored = new Set();
    let queue = new Set();

    let g = new graph.Graph();

    // Variables for logging purposes
    let articlesToNextLayer;
    let articlesPerLayer = [];

    Article.deleteMany({}, () => {});

    function reduceEdgeSize(articleObject) {
        /*
        Reduces the amount of edges in an article object. Reduces it to the amount specified by the
        variable 'threshold'
        */

        // Since queue contains the links from the previous articles a new set is needed to store
        // only 5% of the total links in articleObject
        let currentItemQueue = new Set();

        // Mark the title as explored, and all of its edges as queue
        // Mark the last queue article as the end of the current layer of the imaginary graph
        explored.add(articleObject.title);
        articleObject.edges.forEach((edge) => {

            // Due to a large amount of edges for each layer of the imaginary graph, there is only
            // a ~5% chance of the edge being parsed reducing the edge amount to 5% of the original size
            let chance = (Math.random()).toFixed(2);

            // Ensure that a new lastArticleInLayer is assigned
            if (articleObject.title == lastArticleInLayer) chance = 0;

            if (chance < threshold) {
                // If the article object is the starting article
                if (articleObject.title == 'Rijeka') {
                    queue.add(edge);
                    lastArticleInLayer = edge
                } else {
                    // If child is not in explored, add it to the queue (this is to avoid duplicates)
                    if (!(explored.has(edge))) {
                        currentItemQueue.add(edge);
                        queue.add(edge);
                        // Mark the last queue article as the end of the current layer of the imaginary graph
                        if (articleObject.title == lastArticleInLayer) lastArticleInLayer = edge;
                    }
                }
            }
        });

        articlesToNextLayer = queue.size;
        articlesPerLayer.push(articlesToNextLayer);

        // Reduce the original size of edges to 5%
        if (articleObject.title == 'Rijeka') articleObject.edges = queue;
        else articleObject.edges = currentItemQueue
    }

    function addToGraph(vertex, edges) {
        // Add the vertex and edges to the graph
        g.addVertex(vertex);
        edges.forEach((edge) => {
            g.addEdge(vertex, edge);
        });
    }

    //============================================
    // Query the starting article
    //============================================

    articleObject = await wiki.queryArticle(start);

    reduceEdgeSize(articleObject);

    addtoGraph(articleObject.title, articleObject.edges);

    logProgress(layer, articlesToNextLayer, explored, queue);

    layer++;

    //============================================
    // Store to database
    //============================================

    // Convert to array to be able to store to database
    // articleObject.edges = Array.from(articleObject.edges)

    // Article.create(articleObject, (err, newlyCreated) => {
    //     if (err) console.log("CREATE: " + err);
    // });

    //============================================
    // Query starting article's edges
    //============================================

    for (let item of queue) {
        // Parse the article and store it with it's links to the db
        articleObject = await wiki.queryArticle(item);

        if (item == lastArticleInLayer) {
            layer++;
            articlesToNextLayer = queue.size;
            articlesPerLayer.push(articlesToNextLayer);
        }

        reduceEdgeSize(articleObject)

        g.addVertex(articleObject.title);
        articleObject.edges.forEach((edge) => {
            g.addEdge(articleObject.title, edge);
        });
        g.print();

        //============================================
        // Store to database
        //============================================

        // Convert to array to be able to store to database
        articleObject.edges = Array.from(articleObject.edges)

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