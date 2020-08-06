var Article = require('./models/articles');

class Node {
    constructor(title, id = "", edges = [], explored = false) {
        this.title = title;
        this.id = id;
        this.edges = []
        this.explored = explored
        this.isLeaf = false

        this.addEdges(edges)
    }

    addEdges(edges) {
        if (edges instanceof Array) {
            this.edges.push(...edges)
        } else {
            this.edges.push(edges)
        }
    }
}

class Graph {
    constructor(article) {
        this.nodes = {}
        this.size = Object.keys(this.nodes).length
        this.center = new Node(article.title, article.id, article.links, true)

        this.addNode(article.title, article.id, article.links)
    }

    async addNode(title, id = null, links) {
        let nodeToAdd;

        // Adding the initial node
        if (id != null) {
            nodeToAdd = new Node(title, id, links)
        } else {
            // Look up db to get id and links of the node to add
            let nodeRecord = await Article.findOne({
                'title': title
            });

            // If nodeRecord is null, that means that the link (node) that is being looked up is a leaf node
            // which means that it is not even stored in the database.
            if (nodeRecord != null) nodeToAdd = new Node(nodeRecord.title, nodeRecord.id, nodeRecord.links)
            else {
                nodeToAdd = new Node(title)
                nodeToAdd.isLeaf = true
            }
        }

        this.nodes[title] = nodeToAdd
    }

    constructGraph(article) {
        this.center.edges.forEach((edge) => {
            this.addNode(edge)
        }, this)
    }
}

module.exports = {
    Graph
}