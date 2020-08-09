const got = require('got'); // Using Got since Node's http library doesn't support async functions (?)


exports.queryArticle = async function (articleTitle) {
    /*
    Queries the Wikipedia API for the passed article title's (string) links. Maximum number of links per request is 500.
    If the provided article has more than 500 links than the response body is checked for a flag 'continue'. 
    In that case, make additional requests until all links are retrieved.

    Returns the passed article's links in a JS object format (example articleTitle = 'Javascript'):
        titleChildren = {
            title: 'Javascript',
            links: [
                'ECMAScript',
                'Programming language',
                ...
            ]
        }
    */

    let titleChildren = {};
    let url = constructURL(articleTitle);

    // Make request
    let responseBody = await getRequest(url);

    // Extract links from response and assign to titleChildren
    Object.assign(titleChildren, extractChildrenFromResponse(responseBody));

    // Make additional requests until all the links for that title are exhausted
    while (responseBody.hasOwnProperty('continue')) {
        url = constructURL(articleTitle, responseBody.continue.plcontinue);
        responseBody = await getRequest(url);

        let children = extractChildrenFromResponse(responseBody);
        titleChildren['children'].push(...children['children']);
    }

    titleChildren['children'] = new Set(titleChildren['children'])

    return titleChildren
};


async function getRequest(url) {
    /*
    Performs a GET request to the passed URL (string).

    Returns the parsed data as a JS object.
    */
    try {
        const response = await got(url);
        let parsedData = JSON.parse(response.body);

        return parsedData
    } catch (error) {
        console.log(error);
    }
};

function constructURL(articleTitle, plcontinue = false) {
    /*
    Constructs a URL from the passed article title. A hard coded string is used instead of URLSearchParams object to speed up the
    process, even if it is only slightly.
    If 'plcontinue' (any value other than false) is passed, then another variant of the Wiki API URL is constructed that retrieves the continuation of links of
    the article title.

    Returns the url (string)
    */

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

// 
function extractChildrenFromResponse(responseBody) {
    /*
    Given an object of objects containing links of a Wikipedia article, extract the links.

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
        linkTitles['children'] = [];

        // If the current page has children, add them to linkTitles
        if (page.hasOwnProperty('children')) {
            // Iterate through all children and add the title of children to 'linkTitles'
            page.links.map((child) => {
                linkTitles['children'].push(child.title)
            });
        }
    }

    return linkTitles
};