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

    print() {
        for (let [key, value] of this.nodes.entries()) {
            console.log("Node: " + key);
            console.log("Edges: ");
            console.log(Array.from(value))
            console.log("==============================")
        }
    }
}

module.exports = {
    Graph
}