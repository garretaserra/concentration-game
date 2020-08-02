import React from 'react';

class Card extends React.Component{
    id;
    image;
    solved;
    show;

    handleClick(){
        this.props.click(this.props.i);
    }

    triggerRotation(){
        let element = this.component;
        if(element.style.transform === "rotateY(180deg)") {
            element.style.transform = "rotateY(0deg)";
        }
        else {
            element.style.transform = "rotateY(180deg)";
        }
    }

    componentDidMount() {
        // Preload images
        const img = new Image()
        img.src = this.props.card.image;
    }

    isShown = false;
    render() {
        let shouldShow = this.props.card.show || this.props.card.solved || this.props.selectedCard === this.props.i;
        if(this.isShown !== shouldShow){
                this.triggerRotation();
                this.isShown = shouldShow;
            }
        return(
            <div ref={c => (this.component = c)} className="grid-item" onClick={this.handleClick.bind(this)}>
                <img className="back-side" src={this.props.card.image} alt=""/>
                <img className="front-side" src="https://cdn.pixabay.com/photo/2012/05/07/18/53/card-game-48983_960_720.png" alt=""/>
            </div>
        )
    }
}

export default Card;
