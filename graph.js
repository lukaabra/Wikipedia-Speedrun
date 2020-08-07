var Article = require('./models/articles');

class Node {
    constructor(title, id = "", links = [], explored = false) {
        this.title = title;
        this.id = id;
        this.links = []
        this.explored = explored
        this.isLeaf = false

        this.addLinks(links)
    }

    addLinks(links) {
        if (links instanceof Array) {
            this.links.push(...links)
        } else {
            this.links.push(links)
        }
    }
}

class Graph {
    constructor(article) {
        this.nodes = {}
        this.size = Object.keys(this.nodes).length
        // Center is not included in nodes
        this.center = new Node(article.title, article.id, article.links, true)
    }

    async addNode(title, id = null, links) {
        let nodeToAdd;

        // Adding the initial node
        if (id != null) {
            nodeToAdd = new Node(title, id, links)
            this.nodes[title] = nodeToAdd
        } else {
            // Look up db to get id and links of the node to add
            let newNode = await Article.findOne({
                'title': title
            });

            // If newNode is null, that means that the link (node) that is being looked up is a leaf node
            // which means that it is not even stored in the database.
            if (newNode != null) {
                this.nodes[title] = new Node(newNode.title, newNode.id, newNode.links);
            } else {
                this.nodes[title] = new Node(title);
                this.nodes[title].isLeaf = true;
            }
        }
    }

    async constructGraphToShow() {

        for (let link of this.center.links) {
            await this.addNode(link)
        }

    }
}

module.exports = {
    Graph
}