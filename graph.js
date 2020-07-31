const api = require("./api.js");
const fs = require("fs")
const {
    performance
} = require('perf_hooks');

const Article = require('./models/articles.js')

class Graph {
    constructor() {
        this.nodes = {};
        this.explored = new Set();
    }

    addNode(node, children = []) {
        if (!(node in this.nodes) && children instanceof Array) {
            this.nodes[node] = {
                title: node,
                articleObject: children
            };
        }
    }

    addChildren(parentNode, childNodes) {
        if (parentNode in this.nodes) {
            this.nodes[parentNode] = {
                title: parentNode,
                articleObject: childNodes
            }
        }
    }

    randomKey() {
        // Chooses a random key in the property nodes
        let keys = Object.keys(this.nodes)
        let randomlySelectedKey;
        do {
            randomlySelectedKey = keys[keys.length * Math.random() << 0];
        } while (this.explored.has(randomlySelectedKey))

        return randomlySelectedKey
    }

};

function createNodesFromChildren(articleObject, graph) {
    // For each link in the array, add it as a distinct node in the graph
    for (title in articleObject) {
        articleObject[title].forEach((link) => {
            if (!(link in graph.nodes)) {
                graph.addNode(link)
            }
        });
    };
}

exports.writeArticlesToDB = async function (start) {

    Article.deleteMany({}, () => {})

    //============================================
    // Variable declarations
    //============================================
    let lastArticleInLayer;
    let threshold = 0.05;
    let layer = 0;
    let articleObject = {}

    let explored = [];
    let unexplored = [];

    // Variables for logging purposes
    let articlesToNextLayer;
    let articlesPerLayer = []

    //============================================
    // Query starting article
    //============================================

    articleObject = await api.queryArticle(start);

    // Mark the title as explored, and all of its links as unexplored
    // Mark the last unexplored article as the end of the current layer of the imaginary graph
    explored.push(articleObject.title);
    articleObject.links.forEach((link) => {

        // Due to a large amount of links for each layer of the imaginary graph, there is only
        // a ~5% chance of the link being parsed reducing the link amount to 5% of the original size
        let chance = (Math.random()).toFixed(2)

        if (chance < threshold) {
            unexplored.push(link);
            lastArticleInLayer = link
        }
    });
    layer++;
    articlesToNextLayer = unexplored.length
    articlesPerLayer.push(articlesToNextLayer)

    // Reduce the original size of links to 5%
    articleObject.links = unexplored

    //============================================
    // Store to database
    //============================================

    Article.create(articleObject, (err, newlyCreated) => {
        if (err) console.log("CREATE: " + err)
    });

    logProgress(layer, articlesToNextLayer, explored, unexplored)

    //============================================
    // Query starting article's links
    //============================================

    for (let item of unexplored) {
        // Parse the article and store it with it's links to the db
        articleObject = await api.queryArticle(item)

        // Since unexplored contains the links from the previous articles a new list is needed to store
        // only 5% of the total links in articleObject
        let currentItemUnexplored = []

        if (item == lastArticleInLayer) {
            layer++;
            articlesToNextLayer = unexplored.length
            articlesPerLayer.push(articlesToNextLayer)
        }

        // Mark the title as explored, and all of its links as unexplored
        explored.push(item)
        articleObject.links.forEach((link) => {

            // Due to a large amount of links for each layer of the imaginary graph, there is only
            // a ~5% chance of the link being parsed reducing the link amount to 5% of the original size
            let chance = (Math.random()).toFixed(2)

            // Ensure that a new lastArticleInLayer is assigned
            if (item == lastArticleInLayer) chance = 0

            if (chance < threshold) {
                currentItemUnexplored.push(link)
                unexplored.push(link);
                // Mark the last unexplored article as the end of the current layer of the imaginary graph
                if (item == lastArticleInLayer) lastArticleInLayer = link
            }
        });

        // Reduce the original size of links to a tenth
        articleObject.links = currentItemUnexplored

        //============================================
        // Store to database
        //============================================

        Article.create(articleObject, (err, newlyCreated) => {
            if (err) console.log("CREATE: " + err)
        });

        logProgress(layer, articlesToNextLayer, explored, unexplored)

        if (layer == 6) break
    }

    articlesPerLayer.forEach((articles, index) => {
        console.log("LAYER " + (index + 1) + " HAS " + articles + " ARTICLES.")
    })
    console.log("\n")
    checkNumberOfArticles();

};

function logProgress(layer, articlesToNextLayer, explored, unexplored) {
    console.log("LAYER: " + layer)
    console.log("ARTICLES TO NEXT LAYER: " + articlesToNextLayer)
    console.log("EXPLORED SIZE: " + explored.length)
    console.log("UNEXPLORED SIZE: " + unexplored.length)
    console.log("==============================")
}

function checkNumberOfArticles() {
    Article.find({}, (err, allArticles) => {
        if (err) console.log("FINAL FIND: " + err)
        else console.log("NUMBER OF ARTICLES: " + allArticles.length)
    });

    Article.find({
        links: []
    }, (err, allArticles) => {
        if (err) console.log("FINAL FIND: " + err)
        else console.log("NUMBER OF ARTICLES WITH NO LINKS: " + allArticles.length)
    });
}