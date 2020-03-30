import React from 'react';
import _ from 'lodash';
import Modal from './Modal.jsx';

var Dots = React.createClass({
	render() {
		if(!this.props.show) {
			return null;
		}
		return <ul className="component-carousel-dots">
			{_.times(this.props.count, function(index){
				return <li key={index} onClick={_.partial(this.props.onClickDot,index)}></li>;
			})}
		</ul>;
	}
});

export default React.createClass({
	getInitialState : function(){
		return {
			currentIndex : 0,
			modalOpen : false
		};
	},
	getDefaultProps : function(){
		return {
			showDots : true,
			showThumbs : true,
			showArrows : true
		};
	},
	toggleModal (modalOpen){
		this.setState({modalOpen});
	},
	moveToSlide(currentIndex) {
		this.setState({currentIndex});
	},
	render() {
		var slides = this.props.slides;
		var moveToSlide = this.moveToSlide;
		return <div className="component-carousel">
			<div
				title="Click to zoom in"
				className="component-carousel-viewport"
				onClick={_.partial(this.toggleModal, true)}
				style={{backgroundImage : 'url(' + slides[this.state.currentIndex].original + ')'}}>
				<Dots
					count={slides.count}
					show={this.props.showDots}
					onClickDot={moveToSlide}/>
			</div>
			<div className="component-carousel-thumbs">
				<ul className="component-carousel-shuttle list-inline">
					{_.map(slides,function(slide,index){
						return <li
							key={index}
							style={{backgroundImage : 'url(' + slide.thumbnail + ')'}}
							onClick={_.partial(moveToSlide,index)}
						></li>;
					})}
				</ul>
			</div>
			<Modal open={this.state.modalOpen} onOverlayClick={_.partial(this.toggleModal, false)}>
				<div className="component-carousel-modal">
					<div className="component-carousel-modal-viewport">
						<img src={slides[this.state.currentIndex].original}/>
					</div>
					<button onClick={_.partial(this.toggleModal, false)}>close</button>
				</div>
			</Modal>
		</div>;
	}
});