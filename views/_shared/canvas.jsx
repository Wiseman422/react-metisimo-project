import React from 'react';
import ReactDOM from 'react-dom';

export default React.createClass({
	playVideo(ctx, video, canvas){
		function draw(){
			ctx.drawImage(video, 0, 0, canvas.width, 1080); //full screen width and fixed heigh
			setTimeout(draw, 33.3); //30 FPS
		}
		draw();
	},
	componentDidMount : function(){

	},
	render(){
		var height = '300px';
		if (this.props.height)
			height = this.props.height;
		var stylecol = {paddingRight:'0px',paddingLeft:'0px', "max-height":height, overflow:'hidden'};
		var stylevideo = {width:'100%', height:'auto'};
		return (<div className="col-md-12" style={stylecol}>
			<video preload autoPlay loop ref="video" src={this.props.src} style={stylevideo}></video>
		</div>);
	}
});
