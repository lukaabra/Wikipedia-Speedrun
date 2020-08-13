const wiki = require("./wikiapi.js");
const graph = require('./graph');
const perf_hooks = require('perf_hooks');
const fs = require('fs');

const Article = require('../models/articles.js');

/*
 *  Queries the Wikipedia API for the article's links. Reduces the size of links to percentage specified by const THRESHOLD
 *  in helper function 'reduceEdgeSize'.
 *  Adds the article's title and edges to the graph.
 *  Repeat until graph is size GRAPH_SIZE.
 *  
 *  @param {string} start - Starting article from which to construct the graph.
 *  @returns {Graph} Constructed Graph
 */
async function constructGraph(start) {

    const GRAPH_SIZE = 50000

    let queue = new Set([start]);
    let g = new graph.Graph();

    for (let item of queue) {
        let queriedArticle = await wiki.queryArticle(item);
        let reducedArticle = reduceEdgeSize(queriedArticle);

        addNewEdgesToQueue(reducedArticle, queue);
        addTitleAndEdgesToGraph(reducedArticle, g);

        // Progress logging
        console.log(queue.size + " / " + GRAPH_SIZE);
        if (queue.size > GRAPH_SIZE) break;
    }

    g.bfs(start)
    g.saveToJSON()
};


function addNewEdgesToQueue(article, queue) {
    article.edges.forEach(edge => {
        queue.add(edge)
    });
};


function addTitleAndEdgesToGraph(article, graph) {
    graph.addVertex(article.title);
    article.edges.forEach((edge) => {
        graph.addEdge(article.title, edge);
    });
};


function reduceEdgeSize(queriedArticle) {
    /*
    Reduces the amount of edges in an article object. Reduces it to the amount specified by the
    variable 'threshold'
    */
    const THRESHOLD = 0.03
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

exports.saveGraphToDb = async function () {
    let graph = mergeToNewObject();

    for (let title in graph) {
        // Create object that is same as the database schema
        let articleToSave = {
            'title': title,
            'edges': graph[title].edges,
            'distance': graph[title].distance,
            'path': graph[title].path
        };

        // Add to database
        await Article.create(articleToSave, (err, createdGraph) => {
            if (err) console.log(err)
            else console.log(createdGraph)
        });
    }
};

function mergeToNewObject() {
    // Read JSON files
    let graph = readJSON('json/graph.json');
    let distance = readJSON('json/distances.json');
    let path = readJSON('json/paths.json');

    let newObj = {};

    // Merge 3 objects from 3 different JSON files to 1 new object
    for (let key in graph) {
        newObj[key] = {
            'edges': graph[key],
            'distance': distance[key],
            'path': path[key]
        }
    }

    return newObj
};


function readJSON(file) {
    let obj = JSON.parse(fs.readFileSync(file, 'utf8'));
    return obj
};