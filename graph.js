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