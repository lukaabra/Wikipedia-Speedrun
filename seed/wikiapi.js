const got = require('got'); // Using Got since Node's http library doesn't support async functions (?)


/**
 * Queries the Wikipedia API for the passed article title's links. Maximum number of links per request is 500.
 * If the provided article has more than 500 links than the response body is checked for a flag 'continue'. 
 * In that case, make additional requests until all links are retrieved.
 * 
 * @param {String} articleTitle - Title of the article for which to query the Wikipedia API
 */
async function queryArticle(articleTitle) {

    let titleedges = {};
    let url = constructURL(articleTitle);

    // Make request
    let responseBody = await getRequest(url);

    // Extract links from response and assign to titleedges
    Object.assign(titleedges, extractEdgesFromResponse(responseBody));

    // Make additional requests until all the links for that title are exhausted
    while (responseBody.hasOwnProperty('continue')) {
        url = constructURL(articleTitle, responseBody.continue.plcontinue);
        responseBody = await getRequest(url);

        let edges = extractEdgesFromResponse(responseBody);
        titleedges['edges'].push(...edges['edges']);
    }

    titleedges['edges'] = new Set(titleedges['edges'])

    return titleedges
};

/**
 * Constructs a URL from the passed article title. A hard coded string is used instead of URLSearchParams object to speed up the
 * process, even if it is only slightly.
 * If 'plcontinue' (any value other than false) is passed, then another variant of the Wiki API URL is
 * constructed that retrieves the continuation of links of the article title.
 * 
 * @param {String} articleTitle - Title of the article which to incorporate into the URL.
 * @param {Boolean} plcontinue Default value is false
 * @returns {String} Constructed URL
 */
function constructURL(articleTitle, plcontinue = false) {

    let url;
    let urlString = "https://en.wikipedia.org/w/api.php?action=query&prop=links&pllimit=max&plnamespace=0&format=json&titles=";

    url = urlString + articleTitle;

    // If plcontinue argument is provided, construct a URL with it
    if (plcontinue != false) {
        let apiContinueParam = '&plcontinue=' + plcontinue;
        url += apiContinueParam;
    }

    return url
};


/**
 * Performs a GET request to the passed URL (string).
 * 
 * @param {String} url - URL for which to make a GET request.
 * @returns {Object} Parsed data from the Wikipedia API.    https://www.mediawiki.org/wiki/API:Query
 */
async function getRequest(url) {
    try {
        const response = await got(url);
        let parsedData = JSON.parse(response.body);

        return parsedData
    } catch (error) {
        console.log(error);
    }
};


/**
 * Given an object of objects containing links of a Wikipedia article, extract the links.
 * 
 * @param {Object} responseBody - Body of the response from the Wikipedia API containing a lot of unnecessary information
 * @returns {Object} - Object containing only the necessary information, i.e. article title, and its edges (links)
 */
function extractEdgesFromResponse(responseBody) {
    /*
    

    Returns the extracted links(object).
    */

    let linkTitles = {};
    let title;

    // There was an error occuring where responseBody.query.pages was undefined. This is for logging purposes only.
    try {
        let a = responseBody.query.pages;
    } catch (err) {
        console.log(responseBody.query);
    }
    let pages = responseBody.query.pages;

    // Iterate through all pages in response
    for (key in pages) {
        let page = pages[key];
        title = page.title;
        linkTitles['title'] = title;
        linkTitles['edges'] = [];

        // If the current page has edges, add them to linkTitles
        if (page.hasOwnProperty('links')) {
            // Iterate through all edges and add the title of edges to 'linkTitles'
            page.links.map((child) => {
                linkTitles['edges'].push(child.title)
            });
        }
    }

    return linkTitles
};

module.exports = {
    queryArticle
}