const express = require('express');
const router = express.Router();
const got = require('got');

router.get('/healthEndpoint', async (req, res) => {
    const testResponse = await got('https://wiki-speedrun.herokuapp.com/api/Rijeka');
    const article = await testResponse.json();

    if (article.hasOwnProperty('title'))
        res.status(200).send('Server working properly.');
    else
        res.status(500).send('Something is wrong.')
});

module.exports = router;