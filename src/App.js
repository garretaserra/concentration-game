import React from 'react';
import './App.css';
import Card from "./card/card";
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

    keywordSubmit = (keyword) => {
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

    handleClick = (i) =>{
        console.log(i);
        // Reject clicking the same card twice
        if(this.state.selectedCardIndex === i){
            console.log('Same card');
        }
        // Selecting first card
        else if(this.state.selectedCardIndex == null){
            this.setState({selectedCardIndex: i})
            console.log('First card');
        }
        // Selecting second card
        else{
            // Correct
            if(this.state.cards[i].id === this.state.cards[this.state.selectedCardIndex].id){
                // Update cards to solved state
                let cards = [...this.state.cards];
                let card1 = {...cards[i]};
                let card2 = {...cards[this.state.selectedCardIndex]};
                card1.solved = true;
                card2.solved = true;
                cards[i] = card1;
                cards[this.state.selectedCardIndex] = card2;
                this.setState({cards: cards});
                console.log('Correct pair');
            }
            else{
                console.log('Incorrect pair');
            }
            this.setState({selectedCardIndex: null})
        }
    }

    render() {
        if(this.state.gameStarted) {
            return (
                <div>
                    <div className="grid-container">
                        {this.state.cards.map((card, i) => (
                            <Card card={card} key={i} i={i} selectedCard={this.state.selectedCardIndex} click={this.handleClick}/>
                        ))}
                    </div>
                </div>
            );
        }
        else{
            return (
                <LandingPage handleSubmit={this.keywordSubmit}/>
            )
        }
    }
}

export default App;
