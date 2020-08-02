import React from 'react';
import './clock.css'

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: Date.now(),
        }
    }

    componentDidMount() {
        this.ticker = setInterval(()=>this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.ticker);
    }

    tick(){
        this.setState({currentTime: Date.now()})
    }

    render() {
        let timeElapsed;
        if(this.props.startTime)
            timeElapsed = Math.max(Math.floor((this.state.currentTime - this.props.startTime) / 1000), 0);
        else
            timeElapsed = 0;
        return(
            <div className="clock">
                Time elapsed {timeElapsed}s
            </div>
        );
    }
}

export default Clock;
