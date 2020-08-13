const fs = require('fs'),
    Article = require('../models/articles');

/* Class representing an undirected Graph */
class Graph {
    /**
     * Create 3 maps representing the graphs nodes (edges), distances, and paths. The structure is as follows:
     * 
     * nodes = {'WikipediaArticleTitle': ['ArticleLink1', 'ArticleLink2', ...]}
     * nodes = {'WikipediaArticleTitle': 5}
     * nodes = {'WikipediaArticleTitle': ['WikipediaArticleTitle1', 'WikipediaArticleTitle2', ...]}
     */
    constructor() {
        this.nodes = new Map();
        this.distances = new Map();
        this.paths = new Map();
    }

    /**
     * Adds a vertex to the map nodes.
     * 
     * @param {String} v - Vertex to be added to the graph
     */
    addVertex(v) {
        // Check if the vertex is already inside the graph
        if (!(this.nodes.has(v))) this.nodes.set(v, new Set());
    }

    /**
     * Add vertex w as an edge to v. Also checks if w is already a node in the map nodes. If not, adds it to nodes and
     * v as its edge.
     * 
     * @param {String} v - Vertex to which to add w
     * @param {String} w - Vertex which to add to v
     */
    addEdge(v, w) {
        this.nodes.get(v).add(w);

        // Check if there is an entry for w in the graph. If not, add it
        if (!(this.nodes.has(w))) this.addVertex(w)
        this.nodes.get(w).add(v);
    }

    /**
     * Implementation of Breadth-First Search on this implementation of the graph. Calculates the shortest distance of all 
     * edges from the starting edge. Also marks the path for that shortest distance.
     * 
     * @param {String} start - Article title from which to start the search.
     */
    bfs(start) {
        let explored = new Set([start]);
        let queue = [
            [start]
        ];

        this.distances.set(start, 0);
        this.paths.set(start, [start])

        // BFS Path question:
        // https://stackoverflow.com/questions/8922060/how-to-trace-the-path-in-a-breadth-first-search
        while (queue.length > 0) {
            let path = queue.shift();
            let v = path[path.length - 1];

            for (let w of this.nodes.get(v)) {
                if (!(explored.has(w))) {
                    explored.add(w);
                    let newPath = Array(path);
                    newPath.push(w);
                    queue.push(newPath)

                    newPath = flattenNewPath(newPath);

                    // Set the distance of w as 1 more than the distance of v from the start
                    let currentDistance = this.distances.get(v) + 1;

                    this.distances.set(w, currentDistance);
                    this.paths.set(w, newPath);
                }
            }
        }
    }

    /**
     * Writes all the instance properties (nodes, distances, and paths) as JSON files.
     */
    saveToJSON() {
        let nodesObject = map_to_object(this.nodes)
        fs.writeFile('edges.json', JSON.stringify(nodesObject), (err) => {
            if (err) throw err;
        });

        let distancesObject = map_to_object(this.distances)
        fs.writeFile('distances.json', JSON.stringify(distancesObject), (err) => {
            if (err) throw err;
        });

        let pathObject = map_to_object(this.paths)
        fs.writeFile('paths.json', JSON.stringify(pathObject), (err) => {
            if (err) throw err;
        });
    }

    /**
     * Print out the graph
     */
    print() {
        for (let [key, value] of this.nodes.entries()) {
            console.log("Node: " + key);
            console.log("Edges: ");
            console.log(Array.from(value))
            console.log("==============================")
        }
    }
}

/**
 * Convert a `Map` to a standard
 * JS object recursively.
 * 
 * @param {Map} map to convert.
 * @returns {Object} converted object.
 */
function map_to_object(map) {
    const out = Object.create(null)
    map.forEach((value, key) => {
        if (value instanceof Map) {
            out[key] = map_to_object(value)
        } else if (value instanceof Set) {
            out[key] = Array.from(value)
        } else {
            out[key] = value
        }
    })
    return out
}

/**
 * Flatten an array of arrays. Depth of the arrays is proportional to its length.
 * TODO: MAYBE IMPLEMENT AS A METHOD OF GRAPH ?
 * 
 * @param {[[[[String]]], String]} array - Array of arrays to be flattened
 * @returns {[String]} - Completely flattened array
 */
function flattenNewPath(array) {
    let flattenedArray = array;

    // By flattening the flattenedArray array, it's length is increased
    for (let i = 0; i < flattenedArray.length; i++) {
        flattenedArray = flattenedArray.flat();
    }

    return flattenedArray
}

module.exports = {
    Graph
}