const api = require("./api.js");

class Graph {
    constructor() {
        this.nodes = {};
        this.explored = new Set();
    }

    addNode(node, children = []) {
        if (!(node in this.nodes) && children instanceof Array) {
            this.nodes[node] = children;
        }
    }

    addChildren(parentNode, childNodes) {
        if (parentNode in this.nodes) {
            this.nodes[parentNode] = childNodes
        }
    }

};

exports.constructGraph = async function (start, finish) {
    let g = new Graph();
    let finishFound = false;
    g.addNode(start);

    console.log("\n==========================================================\n")
    console.log("STARTING ARTICLE: \t\t" + start)
    console.log("FINISHING ARTICLE: \t\t" + finish)
    console.log("\nCONSTRUCTING GRAPH...")
    console.log("\n==========================================================\n")

    var numOfSteps = 0;

    while (finishFound == false) {
        var {
            links,
            numOfRequests
        } = await api.parseArticle(start);
        g.addChildren(start, links);

        // Create a new node for each of the newly acquired links
        for (key in links) {
            links[key].forEach((elem) => {
                if (!(elem in g.nodes)) {
                    g.addNode(elem)
                }
            });
        }

        numOfSteps++;
        console.log("STEP: " + numOfSteps);
        console.log("REQUESTS: " + numOfRequests)
        console.log("\n==========================================================\n")

        for (key in links) {
            if (links[key].includes(finish)) {
                finishFound = true
                break
            } else {
                start = links[key];
            }
        }
    };

    console.log("====================================================")
    console.log("TOTAL NUM OF STEPS: " + numOfSteps)
};