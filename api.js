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

    let cleanedUpInput = cleanUpInput(pageTitle);
    let titleLinks = cleanedUpInput.titleLinks
    pageTitle = cleanedUpInput.pageTitle

    let url = constructURL(pageTitle);
    var numOfRequests = 0;

    // Make request
    let responseBody = await getRequest(url);
    numOfRequests++;

    // Extract links from response and assign to titleLinks
    Object.assign(titleLinks, extractLinksFromResponse(responseBody))

    // Make additional requests until all the links for that title are exhausted
    while (responseBody.hasOwnProperty('continue')) {
        let apiContinueParam = '&plcontinue=' + responseBody.continue.plcontinue
        let continueUrl = url + apiContinueParam;

        responseBody = await getRequest(continueUrl);
        numOfRequests++;

        // TODO: Optimize dictionary 'links' so not to iterate unnecessarily through keys with empty arrays as values
        let links = extractLinksFromResponse(responseBody)
        for (key in links) {
            titleLinks[key].push.apply(titleLinks[key], links[key])
        }
    }

    return {
        links: titleLinks,
        numOfRequests: numOfRequests
    }
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
};

function constructURL(pageTitle) {
    let url;
    let urlString = "https://en.wikipedia.org/w/api.php?action=query&prop=links&pllimit=max&plnamespace=0&format=json&titles="

    // If the pageTitle is an array of 50 links in each array, construct an array of URLs fo each array of titles
    if (pageTitle instanceof Array) {
        url = [];

        pageTitle.forEach((elem) => {
            url.push(urlString + elem)
        });

        // Else, just construct the URL from the title
    } else {
        url = urlString + pageTitle
    }

    return url
}

function cleanUpInput(pageTitle) {
    let titleLinks = {}

    // Create an empty array for each pageTitle provided which will store links for each article in the future
    if (pageTitle instanceof Array) {
        pageTitle.forEach((elem) => {
            titleLinks[elem] = []
        });

        // If the passed argument array has more than 50 elements, break it off into multiple arrays of max length 50
        if (pageTitle.length > 50) {
            let multipleArrayPageTitles = []

            while (pageTitle.length > 0) {
                multipleArrayPageTitles.push(pageTitle.splice(0, 50))
            }

            // Assign the array of length 50 titles to pageTitle
            pageTitle = multipleArrayPageTitles

            // Else just create a single string from the array of strings
        } else {
            pageTitle = pageTitle.join('|')
        }

        // If the provided pageTitle is a single title and not an array of titles, create an empty array for it
    } else {
        titleLinks[pageTitle] = []
    }

    return {
        titleLinks: titleLinks,
        pageTitle: pageTitle
    }
};

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