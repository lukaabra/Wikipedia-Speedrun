const got = require('got'); // Using Got since Node's http library doesn't support async functions (?)

// Returns a promise even if getRandomStartFinish is sync
exports.getRandomStartFinish = async function () {
    // Parameters to be passed to the GET request
    let params = new URLSearchParams({
        action: 'query',
        format: 'json',
        prop: 'info',
        list: 'random',
        rnlimit: '2',
        rnnamespace: '0' // If the namespace is 0, then the random result is an Article
    });

    let url = 'https://en.wikipedia.org/w/api.php?' + params.toString();

    // GET request 2 random Wikipedia articles
    try {
        const response = await got(url);
        var parsedData = JSON.parse(response.body)
    } catch (error) {
        console.log(error);
    }

    return parsedData.query.random
};


exports.parseArticle = async function (pageTitle) {
    // Object that will be returned containing links for each title
    let titleLinks = {}

    // If the passeg argument is an array of titles, join them so one request is made in total instead of one for each title
    if (pageTitle instanceof Array) {
        pageTitle.forEach((elem) => {
            titleLinks[elem] = []
        });
        pageTitle = pageTitle.join('|')
    } else {
        titleLinks[pageTitle] = []
    }

    let url = "https://en.wikipedia.org/w/api.php?action=query&prop=links&pllimit=max&plnamespace=0&format=json&titles=" + pageTitle

    // Make request
    let responseBody = await getRequest(url);

    // Extract links from response
    let links = extractLinksFromResponse(responseBody)
    // Add the newly extracted links to titleLinks
    for (key in links) {
        titleLinks[key].push.apply(titleLinks[key], links[key])
    }

    // Make additional requests until all the links for that title are exhausted
    while (responseBody.hasOwnProperty('continue')) {
        let apiContinueParam = '&plcontinue=' + responseBody.continue.plcontinue
        let continueUrl = url + apiContinueParam;

        responseBody = await getRequest(continueUrl)

        // TODO: Optimize dictionary 'links' so not to iterate unnecessarily through keys with empty arrays as values
        links = extractLinksFromResponse(responseBody)
        for (key in links) {
            titleLinks[key].push.apply(titleLinks[key], links[key])
        }
    }

    return titleLinks
};

// Make a GET request
async function getRequest(url) {
    try {
        const response = await got(url);
        let parsedData = JSON.parse(response.body);

        return parsedData
    } catch (error) {
        console.log(error);
    }
}

// Given an object of objects containing titles of links, return only the titles
function extractLinksFromResponse(responseBody) {
    let linkTitles = {};
    let title;
    let pages = responseBody.query.pages;

    // Iterate through all pages in response
    for (key in pages) {
        let page = pages[key];
        title = page.title
        linkTitles[title] = []

        // If the current page has links, add them to linkTitles
        if (page.hasOwnProperty('links')) {
            for (var i = 0; i < page.links.length; i++) {
                linkTitles[title].push(page.links[i].title)
            }
        }
    }

    return linkTitles
};