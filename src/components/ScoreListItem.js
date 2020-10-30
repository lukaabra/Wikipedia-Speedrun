import React from 'react';

class ScoreListItem extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        if (window.innerWidth > 569) {
            return (
                <tr>
                    <td key={this.props.score.rank} className="table-item-cell">{this.props.score.rank}.</td>
                    <td key={this.props.score.name} className="table-item-cell">{this.props.score.name}</td>
                    <td key={this.props.score.time} className="table-item-cell">{this.props.score.time}</td>
                    <td key={this.props.score.steps * this.props.score.score} className="table-item-cell">{this.props.score.steps}</td>
                    <td key={this.props.score.minPossibleSteps + this.props.score.score} className="table-item-cell">{this.props.score.minPossibleSteps}</td>
                    <td key={this.props.score.startingArticle} className="table-item-cell">{this.props.score.startingArticle}</td>
                    <td key={this.props.score.score} className="table-item-cell">{this.props.score.score}</td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td key={this.props.score.rank} className="table-item-cell">{this.props.score.rank}.</td>
                    <td key={this.props.score.name} className="table-item-cell">{this.props.score.name}</td>
                    <td key={this.props.score.steps * this.props.score.score} className="table-item-cell">{this.props.score.steps}</td>
                    <td key={this.props.score.score} className="table-item-cell">{this.props.score.score}</td>
                </tr>
            )
        };
    };
};

export default ScoreListItem;