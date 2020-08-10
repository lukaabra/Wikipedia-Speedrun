const wiki = require("./wikiapi.js");
const graph = require('./graph');
const perf_hooks = require('perf_hooks')

const Article = require('./models/articles.js');

exports.seedDb = async function (start) {

    const GRAPH_SIZE = 10

    let queue = new Set([start]);
    let g = new graph.Graph();

    Article.deleteMany({}, () => {});

    let t1 = perf_hooks.performance.now();
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

        console.log(queue.size)
        // Limit graph size to 1000 vertices
        if (queue.size > GRAPH_SIZE) break;
    }
    let t2 = perf_hooks.performance.now()

    console.log("FINISHED IN: " + ((t2 - t1) / 1000).toFixed(2) + " s");

    g.saveToJSON()
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