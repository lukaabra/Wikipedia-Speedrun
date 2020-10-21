import React from 'react';
import { Link } from 'react-router-dom';

const Article = (props) => (
    <div>
        <h4>{props.currentArticle.title}</h4>
        {
            props.currentArticleEdges.sort().map((edge) => (
                <div key={edge._id}>
                    <Link to={`/article/${edge._id}`} onClick={props.getClickedArticle}>{edge.title}</Link>
                         - {edge.edges.length} links
                </div>
            ))
        }
    </div>
);

export default Article;