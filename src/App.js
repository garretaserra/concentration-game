import React from "react";
import "./App.css";
import Card from "./card/card";
import LandingPage from "./landing-page/landing-page";
import Clock from "./clock/clock";
import SummaryPage from './summary-page/summary-page'

class App extends React.Component {
    cardNumber = 20;    // Total number of cards the game is payed with
    constructor(props) {
        super(props);
        this.state = {
            cards: new Array(this.cardNumber),
            gameStarted: false,         // Used to detect if player has submitted a keyword.
            gameFinished: false,        // True when on summary screen
            elapsedTime: 0,             // Time taken by the player to finish game (seconds)
            selectedCardIndex: null,    // Used to save first selection of the user when trying to select pairs
            startTime: null,
        };
    }

    // Timings (ms)
    startGameDelay = 1500;      // Delay before cards are revealed briefly to allow images to be loaded
    endGameDelay = 500;         // Delay after finishing game and before player is redirected to end game screen
    showCardsAtStart = 1500;    // Time cards will be revealed at the start of the game
    incorrectShowCards = 1500;  // Time cards will be shown when wrong pair has been selected

    apiKey = "5707439-576ba9bbcdefa781f30c1cc40";
    keywordSubmit = keyword => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("error", () => {
            window.alert("An error occurred while making a request to Pixabay");
        });
        xhr.addEventListener("load", ()=>{
            let res = JSON.parse(xhr.response);
            //Check that there are enough images
            if(res.hits.length < (this.cardNumber/2)){
                window.alert("Keyword with only " + res.hits.length + " images, " + (this.cardNumber/2) + " are needed.");
                return;
            }

            let cards = new Array(this.cardNumber);
            let promises = res.hits.map((image, i) => {
                return new Promise(resolve => {
                    let card = new Card();
                    card.id = image.id;
                    card.image = image.largeImageURL;
                    card.show = false;
                    cards[i*2] = card;
                    cards[i*2+1] = card;
                    resolve();
                });
            });
            Promise.all(promises).then(()=>{
                this.startGame(cards);
            });
        });
        xhr.open('GET', 'https://pixabay.com/api/?key=' + this.apiKey
            + '&q=' + keyword + '&per_page=10');
        xhr.send();
    }

    resetGame() {
        let cards = [];
        let promises = [...this.state.cards].map((card) => {
            return new Promise((resolve) => {
                let newCard = new Card();
                newCard.show = false;
                newCard.solved = false;
                newCard.id = card.id;
                newCard.image = card.image;
                cards.push(newCard);
                resolve();
            })
        });
        Promise.all(promises).then(() => {
            this.setState({cards: cards, gameFinished: false, startTime: null}, () => {this.startGame(cards)});

        });
    }

    updateCards = (properties, value, indexes, callback) => {
        if(indexes.length === 0){
            indexes = [...(Array(this.cardNumber)).keys()];
        }
        let cards = [...this.state.cards];
        let promises = indexes.map((i) => {
            return new Promise((resolve)=>{
                properties.forEach(property=>{
                    cards[i][property] = value;
                });
                resolve();
            });
        });
        Promise.all(promises).then(() => {
            this.setState({cards: cards}, () => {if(callback)callback()});
        });
    }

    startGame(cards){
        this.preventClick = true;
        this.setState({gameStarted: true});
        let randomArr = randomArray(this.cardNumber);
        let shuffledCards = new Array(this.cardNumber);
        let promises = cards.map((card, i) => {
            return new Promise((resolve) => {
                shuffledCards[randomArr[i]] = JSON.parse(JSON.stringify(card));
                resolve();
            });
        });
        Promise.all(promises).then(()=>{
            this.setState({cards: shuffledCards}, () => {
                setTimeout(()=>{
                    this.temporarilyShowCards();
                }, this.startGameDelay);
            });
        });
    }

    preventClick = true;
    temporarilyShowCards(){
        // Show cards
        this.updateCards(['show'], true, [], () => {
            // Hide cards
            setTimeout(()=>{
                this.updateCards(['show'], false, []);
                this.preventClick = false;
            }, this.showCardsAtStart);
        });
    }

    handleClick = (i) =>{
        // If first click of the game, start time
        if(this.state.startTime === null)
            this.setState({startTime: Date.now()});

        let selectedCardIndex = this.state.selectedCardIndex;
        // Reject clicking the on the same card twice or on solved card
        if(selectedCardIndex === i || this.state.cards[i].solved || this.preventClick){}
        // Selecting first card
        else if(selectedCardIndex == null){
            this.setState({selectedCardIndex: i});
        }
        // Selecting second card
        else{
            // Correct: selected a pair of cards
            if(this.state.cards[i].id === this.state.cards[selectedCardIndex].id){
                // Update cards to solved state
                this.updateCards(['solved'],true, [i, selectedCardIndex], () => {
                    // Check if game has been won
                    let correctCards = this.state.cards.reduce((carry, card) => {
                        return carry + (card.solved ? 1 : 0)
                    }, 0);
                    if(correctCards === this.cardNumber){
                        let elapsedTime = Math.floor((Date.now() - this.state.startTime)/1000);
                        setTimeout(()=>{
                            this.setState({elapsedTime: elapsedTime, gameFinished: true});
                        }, this.endGameDelay);
                    }
                });
            }
            // Incorrect: selected different cards
            else{
                this.preventClick = true;
                //Show cards briefly
                this.updateCards(['show'], true, [i, selectedCardIndex], () => {
                        setTimeout(() => {
                            this.updateCards(['show'], false, [i, selectedCardIndex])
                            this.preventClick = false;
                        }, this.incorrectShowCards);
                    }
                );
            }
            this.setState({selectedCardIndex: null});
        }
    }

    render() {
        if(this.state.gameFinished){
            return (
                <SummaryPage newKeyword={()=>window.location.reload()} sameKeyword={()=>this.resetGame()} time={this.state.elapsedTime}/>
            )
        }
        else if(this.state.gameStarted) {
            return (
                <div className="root-container">
                    <div className="grid-container">
                        {this.state.cards.map((card, i) => (
                            <Card card={card} key={i} i={i}
                                  selectedCard={this.state.selectedCardIndex}
                                  click={this.handleClick}
                            />
                        ))}
                    </div>
                    <Clock gameState={this.state.gameStarted} startTime={this.state.startTime}/>
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

// Return array of length 'len' filled with [0-len]
function randomArray(len) {
    let arr0 = [...Array(len).keys()];
    let result = [];
    while (arr0.length){
        let index = Math.floor(Math.random()*arr0.length);
        result.push(arr0[index]);
        arr0.splice(index,1);
    }
    return result;
}
