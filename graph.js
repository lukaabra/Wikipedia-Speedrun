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
                articleLinks: children
            };
        }
    }

    addChildren(parentNode, childNodes) {
        if (parentNode in this.nodes) {
            this.nodes[parentNode] = {
                title: parentNode,
                articleLinks: childNodes
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

function createNodesFromChildren(articleLinks, graph) {
    // For each link in the array, add it as a distinct node in the graph
    for (title in articleLinks) {
        articleLinks[title].forEach((link) => {
            if (!(link in graph.nodes)) {
                graph.addNode(link)
            }
        });
    };
}

exports.writeArticlesToDB = async function (start) {

    Article.deleteMany({}, () => {})

    let lastArticleInLayer;
    let layer = 0;
    let articleLinks = {}
    let explored = [];
    let unexplored = [];

    // Parse the article and store it with it's links to the db
    articleLinks = await api.parseArticle(start);

    // Mark the title as explored, and all of its links as unexplored
    // Mark the last unexplored article as the end of the current layer of the imaginary graph
    explored.push(articleLinks.title);
    articleLinks.links.forEach((link) => {
        // Due to a large amount of links for each layer of the imaginary graph, there is only
        // a ~33% chance of the link being parsed reducing the link amount to a third
        let chance = (Math.random() * 10).toFixed(0)
        if (chance < 3) {
            unexplored.push(link);
            lastArticleInLayer = link
        }
    });
    layer++;

    // Reduce the original size of links to a third
    articleLinks.links = unexplored

    Article.create(articleLinks, (err, newlyCreated) => {
        if (err) console.log("CREATE: " + err)
    });

    console.log("LAYER: " + layer)
    console.log("EXPLORED SIZE: " + explored.length)
    console.log("UNEXPLORED SIZE: " + unexplored.length)
    console.log("==============================")

    for (let item of unexplored) {
        // Parse the article and store it with it's links to the db
        articleLinks = await api.parseArticle(item)

        // Since unexplored contains the links from the previous articles a new list is needed to store
        // only a third of the total links in articleLinks
        let currentItemUnexplored = []

        // Mark the title as explored, and all of its links as unexplored
        explored.push(item)
        articleLinks.links.forEach((link) => {
            // Due to a large amount of links for each layer of the imaginary graph, there is only
            // a ~33% chance of the link being parsed reducing the link amount to a third
            let chance = (Math.random() * 10).toFixed(0)
            if (chance < 3) {
                currentItemUnexplored.push(link)
                unexplored.push(link);
                // Mark the last unexplored article as the end of the current layer of the imaginary graph
                if (item == lastArticleInLayer) lastArticleInLayer = link
            }
        });
        if (item == lastArticleInLayer) layer++;

        articleLinks.links = currentItemUnexplored

        Article.create(articleLinks, (err, newlyCreated) => {
            if (err) console.log("CREATE: " + err)
        });

        console.log("LAYER: " + layer)
        console.log("EXPLORED SIZE: " + explored.length)
        console.log("UNEXPLORED SIZE: " + unexplored.length)
        console.log("==============================")

        if (layer == 10) break
    }

    Article.find({}, (err, allArticles) => {
        if (err) console.log("FINAL FIND: " + err)
        else console.log(allArticles.length)
    })

    Article.deleteMany({}, () => {})

};