import React from 'react';
import './App.css';
import Card from "./card";
import './landing-page/landing-page'
import LandingPage from "./landing-page/landing-page";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: Card[16] = new Array(16),
            gameStarted: false, // Used to detect if player has submitted a keyword.
            selectedCardIndex: null,    // Used to save first selection of the user when trying to select pairs
        }

    }

    apiKey = "5707439-576ba9bbcdefa781f30c1cc40";

    submit = (keyword) => {
        this.setState({gameStarted: true});
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', ()=>{
            let res = JSON.parse(xhr.response);
            res.hits.forEach((image)=>{

                // 2 Cards per image
                this.assignRandomSlot(image);
                this.assignRandomSlot(image);

            })
        });
        xhr.open('GET', 'https://pixabay.com/api/?key=' + this.apiKey + '&q=' + keyword + '&per_page=8');
        xhr.send();
    }

    assignRandomSlot(image){
        // Find random empty card to fill with image
        let random = Math.floor(Math.random()*16);
        while(this.state.cards[random] !== undefined){
            random = Math.floor(Math.random()*16);
        }
        let card = new Card();
        card.id = image.id;
        card.image = image.largeImageURL;

        let cards =this.state.cards.slice();
        cards[random] = card;
        this.setState({keyword: this.state.keyword, cards: cards});
    }

    render() {
        if(this.state.gameStarted) {
            return (
                <div>
                    <div className="grid-container">
                        {this.state.cards.map((card, i) => (
                            <div className="grid-item" key={i}>
                                <img className="image" src={card.image}/>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        else{
            return (
                <LandingPage handleSubmit={this.submit}/>
            )
        }
    }
}

export default App;
