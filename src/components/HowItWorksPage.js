import React from 'react';

import Footer from './Footer';
import Header from './Header';

const HowItWorksPage = () => (
    <div>
        <Header />
        <h2 className="how-it-works__title">Goal of the game?</h2>
        <p className="how-it-works__text">
            The goal of the game is to reach the finishing article for <span><a href="https://en.wikipedia.org/wiki/Rijeka" target="_blank" className="instructions__link">Rijeka, Croatia</a></span> in as little steps (clicks), and as little time as possible.
            Depending on the difficulty you have a certain amount of hints.
            If you manage to reach the finishing article, you can choose to submit your score. The top 100 scores are displayed in the ranking table.
            Currently, scores on each difficulty can be submitted.
        </p>
        <h2 className="how-it-works__title">How it works?</h2>
        <p className="how-it-works__text">
            This application does not make requests to the WikiMedia API in real time. Due to poor performance in such a case, all the article data has been prefetched and stored in a database.
            Due to the overwhelming amount of links on most articles, I have decided to reduce the amount of links stored to only 3% of the total links for each article.
            I have also put a limit to 20 000 articles to be fetched. The plan is in the future to expand these articles, and maybe to implement real time WikiMedia API requesting.
        </p>
        <Footer />
    </div>
);

export default HowItWorksPage;