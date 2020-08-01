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
        let selectedCardIndex = this.state.selectedCardIndex;
        // Reject clicking the same card twice or on solved card
        if(selectedCardIndex === i || this.state.cards[i].solved){}
        // Selecting first card
        else if(selectedCardIndex == null){
            this.setState({selectedCardIndex: i})
        }
        // Selecting second card
        else{
            // Correct
            if(this.state.cards[i].id === this.state.cards[selectedCardIndex].id){
                // Update cards to solved state
                let cards = [...this.state.cards];
                let card1 = {...cards[i]};
                let card2 = {...cards[selectedCardIndex]};
                card1.solved = true;
                card2.solved = true;
                cards[i] = card1;
                cards[selectedCardIndex] = card2;
                this.setState({cards: cards}, () =>{
                    // Check if game has been won
                    let correctCards = this.state.cards.reduce((carry, card)=>{return carry + (card.solved ? 1 : 0)}, 0);
                    if(correctCards === 16){
                        setTimeout(()=>{
                            alert('You have won!');
                        }, 1000);
                    }
                });
            }
            // Incorrect (show cards briefly)
            else{
                let cards = [...this.state.cards];
                let card = {...this.state.cards[i]};
                card.show = true;
                cards[i] = card;
                card = {...this.state.cards[selectedCardIndex]};
                card.show = true;
                cards[selectedCardIndex] = card;
                this.setState({cards: cards});
                setTimeout(()=>{
                    let cards = [...this.state.cards];
                    let card = {...this.state.cards[i]};
                    card.show = false;
                    cards[i] = card;
                    card = {...this.state.cards[selectedCardIndex]};
                    card.show = false;
                    cards[selectedCardIndex] = card;
                    this.setState({cards: cards});
                }, 1000);
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
