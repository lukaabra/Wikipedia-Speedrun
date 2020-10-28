import React from 'react';
import { Link } from 'react-router-dom';

const Article = (props) => (
    <div className="article">
        <h4 className="article__title">{props.currentArticle.title}</h4>
        {
            props.currentArticleEdges.sort().map((edge) => (
                <div key={edge._id} className="article__edge">
                    <Link to={`/article/${edge._id}`} onClick={props.getClickedArticle}>{edge.title}</Link>
                         - {edge.edges.length} links
                </div>
            ))
        }
    </div>
);

export default Article;