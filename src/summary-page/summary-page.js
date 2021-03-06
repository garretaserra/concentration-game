import React from 'react';
import './summary-page.css'

class SummaryPage extends React.Component{
    render() {
        return(
            <div className="container">
                <h2>Your time was {this.props.time} seconds</h2>
                <button onClick={this.props.sameKeyword}>Go Again!</button>
                <button onClick={this.props.newKeyword}>New Keyword</button>
            </div>
        )
    }
}

export  default SummaryPage;
