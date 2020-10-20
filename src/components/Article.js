import React from 'react';
import { Link } from 'react-router-dom';

class Article extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div>
                <h4>{this.props.currentArticle.title}</h4>
                {
                    this.props.currentArticleEdges.map((edge) => (
                        <div key={edge._id}>
                            <Link to={`/article/${edge._id}`} onClick={this.props.getClickedArticle}>{edge.title}</Link>
                         - {edge.edges.length} links
                        </div>
                    ))
                }
            </div>
        );
    };
};

export default Article;