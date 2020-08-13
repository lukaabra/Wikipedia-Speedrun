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
 *  Perform BFS from the starting article.
 *  Save the graph to JSON.
 *  
 *  @param {string} start - Starting article from which to construct the graph.
 *  @returns {Graph} Constructed Graph
 */
async function constructGraphToJSON(start) {

    const GRAPH_SIZE = 50000

    let queue = new Set([start]);
    let g = new graph.Graph();

    for (let item of queue) {
        let queriedArticle = await wiki.queryArticle(item);
        let reducedArticle = reduceEdgeSize(queriedArticle);

        queue = addNewEdgesToQueue(reducedArticle, queue);
        addTitleAndEdgesToGraph(reducedArticle, g);

        // Progress logging
        console.log(queue.size + " / " + GRAPH_SIZE);
        if (queue.size > GRAPH_SIZE) break;
    }

    g.bfs(start)
    g.saveToJSON()
};

//====================================================
// CONSTRUCTGRAPH HELPER FUNCTIONS
//====================================================

/*
 *  Given a JS object of a Wikipedia article (with title and links), add all the edges (links) to the queue.
 *  
 *  @param {Object} article - Wikipedia article object with title and it's links.
 *  @param {Set} queue - Queue of articles to be iterated over
 *  @returns {Set} newQueue - Copied values from queue but with newly added edges.
 */
function addNewEdgesToQueue(article, queue) {
    let newQueue = queue
    article.edges.forEach(edge => {
        newQueue.add(edge)
    });

    return newQueue
};

/*
 *  Add titles and edges (links) of a provided JS object of a Wikipedia article to a Graph object.
 *  
 *  TODO: MAYBE NEED TO IMPLEMENT A RETURN PARAMETER AS TO NOT MUTATE graph INSIDE THE FUNCTION.
 * 
 *  @param {Object} article - Wikipedia article object with title and it's links.
 *  @param {Graph} graph - Graph object containing a representation of Wikipedia article connectedness
 */
function addTitleAndEdgesToGraph(article, graph) {
    graph.addVertex(article.title);
    article.edges.forEach((edge) => {
        graph.addEdge(article.title, edge);
    });
};

/*
 *  Reduces the amount of edges in an article object. Reduces it to the amount specified by the constant THRESHOLD
 *  
 *  @param {Object} queriedArticle - Wikipedia article object with title and it's links.
 *  @returns {Object}  - Newly constructed JS object containing the queriedArticle title, and a reduced number of edges (links)
 */
function reduceEdgeSize(queriedArticle) {
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

//====================================================
// SAVEGRAPHTODB HELPER FUNCTIONS
//====================================================

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