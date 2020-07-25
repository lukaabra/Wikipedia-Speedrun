const api = require("./api.js");
const graph = require("./graph");

// Await only works inside of an async function
(async () => {
    // 1 step
    let start1 = 'Emsetal';
    let finish1 = 'Germany';

    // 1 step
    let start2 = 'The Holocaust';
    let finish2 = 'Soviet Union';

    // Provided incorrect starting title
    let start2_bug = 'Holocaust';
    let finish2_bug = 'Soviet Union';

    // 4 STEPS
    let start3 = 'Lake Solitude Trail';
    let finish3 = 'Stage (theatre)';

    // Test massive amount of links on 1 page
    let start4 = 'Barcelona'
    let finish4 = 'Port of Barcelona'

    // Test massive amounts of links on multiple pages
    let start5 = ['Barcelona', 'London', 'Berlin']

    // Test small amount of links on multiple pages
    let start6 = ['Emsetal', 'Ptoseulia oxyropa', 'Gusen (river)']

    graph.constructGraph(start4, finish4);

})();