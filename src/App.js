import React from "react";
import "./App.css";
import Card from "./card/card";
import "./landing-page/landing-page";
import LandingPage from "./landing-page/landing-page";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: Card[16] = new Array(20),
            gameStarted: false, // Used to detect if player has submitted a keyword.
            selectedCardIndex: null,    // Used to save first selection of the user when trying to select pairs
        };
    }

    apiKey = "5707439-576ba9bbcdefa781f30c1cc40";
    keywordSubmit = keyword => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("error", () => {
            window.alert("An error occurred while making a request to Pixabay");
        });
        xhr.addEventListener("load", ()=>{
            let res = JSON.parse(xhr.response);
            //Check that there are enough images
            if(res.hits.length < 10){
                window.alert("Keyword with only " + res.hits.length + " images, 10 are needed.");
                return;
            }

            let cards = new Array(20);
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
            this.setState({cards: cards}, () => {this.startGame(cards)});

        });
    }

    updateCards = (properties, value, indexes, callback) => {
        if(indexes.length === 0){
            indexes = [...(Array(20)).keys()];
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
        this.setState({gameStarted: true});
        let randomArr = randomArray(20);
        let shuffledCards = new Array(20);
        let promises = cards.map((card, i) => {
            return new Promise((resolve) => {
                shuffledCards[randomArr[i]] = card;
                resolve();
            });
        });
        Promise.all(promises).then(()=>{
            this.setState({cards: shuffledCards}, () => {
                setTimeout(()=>{
                    this.temporarilyShowCards();
                }, 1500);
            });
        });
    }

    temporarilyShowCards(){
        // Show cards
        this.updateCards(['show'], true, [], () => {
            // Hide cards
            setTimeout(()=>{
                this.updateCards(['show'], false, []);
            }, 1500);
        });
    }

    handleClick = (i) =>{
        let selectedCardIndex = this.state.selectedCardIndex;
        // Reject clicking the on the same card twice or on solved card
        if(selectedCardIndex === i || this.state.cards[i].solved){}
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
                    if(correctCards === 20){
                        setTimeout(()=>{
                            if(window.confirm('You have won!, do you want to choose another keyword?'))
                                window.location.reload();
                            else
                                this.resetGame();
                        }, 500);
                    }
                });
            }
            // Incorrect: selected different cards
            else{
                //Show cards briefly
                this.updateCards(['show'], true, [i, selectedCardIndex],
                    setTimeout(()=>{
                        this.updateCards(['show', false, [i, selectedCardIndex]])
                    }, 1500)
                );
            }
            this.setState({selectedCardIndex: null});
        }
    }

    render() {
        if(this.state.gameStarted) {
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
