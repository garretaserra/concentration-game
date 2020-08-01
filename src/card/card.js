import React from 'react';

class Card extends React.Component{
    id;
    image;
    solved;
    show;

    handleClick = () =>{
        this.props.click(this.props.i);
    }

    render() {
        if(this.props.card.show || this.props.card.solved || this.props.selectedCard === this.props.i){
        return (
            <div className="grid-item">
                <img className="defaultImage keywordImage" src={this.props.card.image}/>
            </div>
        );
        }
        else{
            return(
                <div className="grid-item" onClick={this.handleClick}>
                    <img className="defaultImage" src="https://cdn.pixabay.com/photo/2012/05/07/18/53/card-game-48983_960_720.png"/>
                </div>
            )
        }
    }
}

export default Card;
