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
            let cards = new Array(16);
            let promises = res.hits.map((image, i)=>{
                return new Promise((resolve =>{
                    let card = new Card();
                    card.id = image.id;
                    card.image = image.largeImageURL;
                    card.show = false;
                    cards[i*2] = card;
                    cards[i*2+1] = card;
                    resolve();
                }))
            })
            Promise.all(promises).then(()=>{
                this.startGame(cards);
            })
        });
        xhr.open('GET', 'https://pixabay.com/api/?key=' + this.apiKey + '&q=' + keyword + '&per_page=8');
        xhr.send();
    }

    resetGame() {
        let cards = new Array(16);
        let promises = this.state.cards.map((card)=>{
            return new Promise((resolve)=>{
                card.show = false;
                card.solved = false;
                cards.push(card);
                resolve();
            })
        })
        Promise.all(promises).then(()=>{
            this.startGame(this.state.cards);
        });
    }

    startGame(cards){
        let randomArr = randomArray(16)
        let shuffledCards = new Array(16);
        let promises = cards.map((card, i)=>{
            return new Promise((resolve)=>{
                shuffledCards[randomArr[i]] = card;
                resolve();
            })
        });
        Promise.all(promises).then(()=>{
            this.setState({cards: shuffledCards}, ()=>{
                setTimeout(()=>{
                    this.temporarilyShowCards();
                }, 1500);
            });
        })
    }

    temporarilyShowCards(){
        // Show cards
        let cards = [...this.state.cards];
        let promises = cards.map((card)=>{
            return new Promise((resolve)=>{
                card.show = true;
                resolve();
            })
        })
        Promise.all(promises).then(()=>{
            this.setState({cards: cards}, () => {
                // Hide cards
                setTimeout(()=>{
                    let cards = [...this.state.cards];
                    let promises = cards.map((card)=>{
                        return new Promise((resolve)=>{
                            card.show = false;
                            resolve();
                        })
                    })
                    Promise.all(promises).then(()=>{
                        this.setState({cards: cards});
                    })
                }, 2000);
            })
        })
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
                            if(window.confirm('You have won!, do you want to choose another keyword?'))
                                window.location.reload();
                            else
                                this.resetGame();
                        }, 500);
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
                }, 1500);
            }
            this.setState({selectedCardIndex: null})
        }
    }

    render() {
        if(this.state.gameStarted) {
            return (
                <div className="root-container">
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
