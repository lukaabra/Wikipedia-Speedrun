const got = require('got'); // Using Got since Node's http library doesn't support async functions (?)
const {
    response
} = require('express');

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


exports.queryArticle = async function (articleTitle) {

    let titleLinks = {}
    let url = constructURL(articleTitle);

    // Make request
    let responseBody = await getRequest(url);

    // Extract links from response and assign to titleLinks
    Object.assign(titleLinks, extractLinksFromResponse(responseBody))

    // Make additional requests until all the links for that title are exhausted
    while (responseBody.hasOwnProperty('continue')) {
        url = constructURL(articleTitle, responseBody.continue.plcontinue)
        responseBody = await getRequest(url);

        let links = extractLinksFromResponse(responseBody)
        titleLinks['links'].push(...links['links'])
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
};

function constructURL(articleTitle, plcontinue = false) {
    // Construct URL from page title
    let url;
    let urlString = "https://en.wikipedia.org/w/api.php?action=query&prop=links&pllimit=max&plnamespace=0&format=json&titles="

    url = urlString + articleTitle

    // If plcontinue argument is provided, construct a URL with it
    if (plcontinue != false) {
        let apiContinueParam = '&plcontinue=' + plcontinue
        url += apiContinueParam;
    }

    return url
};

// Given an object of objects containing titles of links, return only the titles
function extractLinksFromResponse(responseBody) {
    let linkTitles = {};
    let title;
    try {
        let a = responseBody.query.pages;
    } catch (err) {
        console.log(responseBody.query)
    }
    let pages = responseBody.query.pages;

    // Iterate through all pages in response
    for (key in pages) {
        let page = pages[key];
        title = page.title
        linkTitles['title'] = title
        linkTitles['links'] = []

        // If the current page has links, add them to linkTitles
        if (page.hasOwnProperty('links')) {
            for (var i = 0; i < page.links.length; i++) {
                linkTitles['links'].push(page.links[i].title)
            }
        }
    }

    return linkTitles
};