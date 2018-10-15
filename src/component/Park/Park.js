import React, { Component } from 'react';
import './Park.css';
import caution from './caution.svg';
import danger from './danger.svg';
import info from './info.svg';
import utils from '../../utils/utils';

export default class Park extends Component{
	constructor(props){
		super(props);
		this.state = {
			initial: true
		};
	}

	componentDidMount(){
		const path = this.props.location.pathname;
		const code = path.substring(path.lastIndexOf("/") + 1);
		fetch('/parks/' + code).then((res) => {
	      return res.json();
	    })
	    .then((res) => {
	    	if(res.state == 1){
		    	this.setState({info:res.info, alerts:res.alerts});
		    }
	    })
	    .catch((err) => {
	    	console.log(err);
	    })
	    .then(() => {
	    	this.setState({initial: false});
	    });
	}

	alertsMap = (e) => {
		let bng_style = [
			{background: "#ffebe6", borderColor: "#ffad99"},
			{background: "#ffffe6", borderColor: "#e6e600"},
			{background: "#e6f7ff", borderColor: "#99ddff"}
		];
		let icon_style = [
			danger, caution, info
		];
		let type;
		if(e.category == "Danger"){
			type = 0;
		}
		else if(e.category == "Caution"){
			type = 1;
		}
		else{
			type = 2;
		}

		bng_style = bng_style[type];
		let src = icon_style[type];
		
		return <div className="alert_line" style={bng_style}>
			<img src={src}/>
			<div className="alert_p">
				<p className="alert alert_title">{e.title + ":"}</p>
				<p className="alert alert_desc">{e.description}</p>
			</div>
		</div>
	}


	render(){
		const images = utils.importAll(require.context('../../../public/img/parks', false));
		let style;
		if(!this.state.initial){
			let arr = [this.state.info];
			let mapping = utils.match(arr, images);
			console.log(encodeURI(mapping[this.state.info.name]));
			style = {backgroundImage:"url(" + encodeURI(mapping[this.state.info.name]) + ")"};
		}
		return (
			<div>
				{!this.state.initial &&
					<div>
						<div className="park_banner" style={style}>
							<h1>{this.state.info.name}</h1>
						</div>
						<div className="park_wrapper">
							<div className="alerts_wrapper">
								{this.state.alerts.map(this.alertsMap)}
							</div>
						</div>
					</div>
				}	
			</div>
		)
	}
}