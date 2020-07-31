import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
    }

  }

  handleChange = (event) => {
      this.setState({keyword: event.target.value});
  }

  render() {
    return(
        <div>
            <input type="text" value={this.state.keyword} onChange={this.handleChange}/>
            <button disabled={!this.state} onClick={()=> {console.log(this.state)}}>Start Game!</button>

            <div className="grid-container">
                <div></div>
            </div>
        </div>
    );
  }
}

export default App;
