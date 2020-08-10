const wiki = require("./wikiapi.js");
const graph = require('./graph');

const Article = require('./models/articles.js');

exports.seedDb = async function (start) {

    let queue = new Set([start]);
    let g = new graph.Graph();

    Article.deleteMany({}, () => {});

    for (let item of queue) {
        let queriedArticle = await wiki.queryArticle(item);
        let reducedArticle = reduceEdgeSize(queriedArticle);

        // Add new edges to the queue
        reducedArticle.edges.forEach(edge => {
            queue.add(edge)
        });

        // Add the title and its edges to the graph
        g.addVertex(reducedArticle.title);
        reducedArticle.edges.forEach((edge) => {
            g.addEdge(reducedArticle.title, edge);
        });

        // Limit graph size to 1000 vertices
        if (queue.size > 1000) break;
    }

    g.print();
};


function reduceEdgeSize(queriedArticle) {
    /*
    Reduces the amount of edges in an article object. Reduces it to the amount specified by the
    variable 'threshold'
    */
    const THRESHOLD = 0.01
    let reducedEdges = new Set()

    queriedArticle.edges.forEach((edge) => {
        let chance = (Math.random()).toFixed(2);

        if (chance < THRESHOLD) {
            reducedEdges.add(edge);
        }
    });

    // Return an object with reduced number of edges
    return {
        'title': queriedArticle.title,
        'edges': reducedEdges
    }
};