const fs = require('fs'),
    Article = require('./models/articles');

class Graph {
    // Undirected graph
    constructor() {
        this.nodes = new Map();
        this.distances = new Map();
        this.paths = new Map();
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

    saveToJSON() {
        let nodesObject = map_to_object(this.nodes)
        fs.writeFile('graph.json', JSON.stringify(nodesObject), (err) => {
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
        } else if (value instanceof Set) {
            out[key] = Array.from(value)
        } else {
            out[key] = value
        }
    })
    return out
}

/*
 * Flatten an array of arrays.
 *
 * @param {Array[Array[...]]} path to flatten
 * @return {Array[String]}
 */
function flattenNewPath(path) {
    let newPath = path;

    // By flattening the newPath array, it's length is increased
    for (let i = 0; i < newPath.length; i++) {
        newPath = newPath.flat();
    }

    return newPath
}

module.exports = {
    Graph
}