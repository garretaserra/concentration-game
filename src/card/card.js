import React from 'react';

class Card extends React.Component{
    id;
    image;
    solved;
    show;

    handleClick = () =>{
        this.props.click(this.props.i);
    }

    componentDidMount() {
        // Preload images
        const img = new Image()
        img.src = this.props.card.image;
    }

    render() {
        if(this.props.card.show || this.props.card.solved || this.props.selectedCard === this.props.i){
        return (
            <div className="grid-item">
                <img alt={"Loading"} className="front-side" src={this.props.card.image}/>
            </div>
        );
        }
        else{
            return(
                <div className="grid-item" onClick={this.handleClick}>
                    <img alt={"Loading"} className="back-side" src="https://cdn.pixabay.com/photo/2012/05/07/18/53/card-game-48983_960_720.png"/>
                </div>
            )
        }
    }
}

export default Card;
