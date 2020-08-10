const fs = require('fs'),
    Article = require('./models/articles');

class Graph {
    // Undirected graph
    constructor() {
        this.nodes = new Map();
    }

    addVertex(v) {
        // Check if the vertex is already inside the graph
        if (!(this.nodes.has(v))) this.nodes.set(v, new Set());
    }

    addEdge(v, w) {
        this.nodes.get(v).add(w);

        // Check if there is an entry for w in the graph. If not, add it
        if (this.nodes.has(w)) {
            this.nodes.get(w).add(v);
        } else {
            this.addVertex(w)
            this.nodes.get(w).add(v);
        }
    }

    bfs(start) {
        // TODO
    }

    saveToJSON() {
        let nodesObject = map_to_object(this.nodes)
        fs.writeFile('graph.json', JSON.stringify(nodesObject), (err) => {
            if (err) throw err;
        })
    }

    saveToDB() {
        // TODO
    }

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
        } else {
            out[key] = Array.from(value)
        }
    })
    return out
}

module.exports = {
    Graph
}