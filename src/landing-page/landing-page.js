import React from 'react';
import './landing-page.css'

class LandingPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
        }
    }

    onChange = (event) => {
        this.setState({keyword: event.target.value})
    }

    onSubmit = () =>{
        this.props.handleSubmit(this.state.keyword);
    }

    render() {
        return (
            <div>
                <input type="text" placeholder="Keyword" value={this.state.keyword} onChange={this.onChange}/>
                <button disabled={!this.state.keyword} onClick={this.onSubmit}>Start Game!</button>
            </div>
        )}
}

export default LandingPage;
