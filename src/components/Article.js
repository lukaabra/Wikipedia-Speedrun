import React from 'react';
import { Link } from 'react-router-dom';

const Article = (props) => (
    <div className="article">
        <h4 className="article__title">{props.currentArticle.title}</h4>

        <table className="table">

            <thead className="table__head">
                <tr>
                    <th className="table__cell">Article title</th>
                    <th className="table__cell">No. of links</th>
                </tr>
            </thead>

            {
                props.currentArticleEdges.sort().map((edge) => (
                    <tbody>
                        <tr>
                            <td key={edge.title} className="table-item-cell">
                                <Link
                                    to={`/article/${edge._id}`}
                                    onClick={props.getClickedArticle}
                                    className="table-item-cell__link"
                                >
                                    {edge.title}
                                </Link>
                            </td>
                            <td key={edge.id} className="table-item-cell">{edge.edges.length}</td>
                        </tr>
                    </tbody>
                ))
            }

        </table>

    </div>
);

export default Article;