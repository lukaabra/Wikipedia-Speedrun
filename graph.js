const api = require("./api.js");
const {
    performance
} = require('perf_hooks');

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

    // Log starting construction of Graph
    console.log("\n==========================================================\n")
    console.log("STARTING ARTICLE: \t\t" + start)
    console.log("FINISHING ARTICLE: \t\t" + finish)
    console.log("\nCONSTRUCTING GRAPH...")
    console.log("\n==========================================================\n")

    var numOfSteps = 0;

    while (finishFound == false) {
        var t0 = performance.now();
        var {
            links,
            numOfRequests
        } = await api.parseArticle(start);
        var t1 = performance.now();

        var t2 = performance.now();
        g.addChildren(start, links);
        var t3 = performance.now();

        var t4 = performance.now();
        // Create a new node for each of the newly acquired links
        for (key in links) {
            links[key].forEach((elem) => {
                if (!(elem in g.nodes)) {
                    g.addNode(elem)
                }
            });
        };
        var t5 = performance.now();

        // Log progress
        numOfSteps++;
        console.log("STEP: " + numOfSteps);
        console.log("REQUESTS: " + numOfRequests);
        console.log("TIME REQUIRED FOR REQUESTS: \t\t\t\t\t" + (t1 - t0).toFixed(2) + "\t miliseconds");
        console.log("TIME REQUIRED FOR ADDING CHILDREN: \t\t\t\t" + (t3 - t2).toFixed(5) + "\t miliseconds");
        console.log("TIME REQUIRED FOR CREATING NEW NODES FOR EACH CHILDREN: \t" + (t5 - t4).toFixed(5) + "\t miliseconds");

        var t6 = performance.now();
        for (key in links) {
            if (links[key].includes(finish)) {
                finishFound = true
                break
            } else {
                start = links[key];
            }
        }
        var t7 = performance.now();
        console.log("TIME REQUIRED FOR ASSIGNING NEW LINKS TO THE NEXT REQUEST: \t" + (t7 - t6).toFixed(5) + "\t miliseconds");
        console.log("\n==========================================================\n")
    };

    console.log("====================================================")
    console.log("TOTAL NUM OF STEPS: " + numOfSteps)
};