import React, { Component } from 'react';
import {Link, Redirect} from "react-router-dom";

import './Park.css';
import caution from './caution.svg';
import danger from './danger.svg';
import info from './info.svg';
import checked from './checked.svg';

import utils from '../../utils/utils';
import Overview from './Overview';
import Weather from './Weather';
import Campsite from './Campsite';
import Gallery from './Gallery';

export default class Park extends Component{
	constructor(props){
		super(props);
		this.state = {
			initial: true,
			hasSession: false,
			watched: false,
			showLoginWarning: false,
			redirect: false,
			menu:0,
			notif_window: 0
		};

		this.addToWatch = this.addToWatch.bind(this);
		this.closeWarning = this.closeWarning.bind(this);
		this.selectMenu = this.selectMenu.bind(this);
	}

	componentDidMount(){
		const path = this.props.location.pathname;
		const code = path.substring(path.lastIndexOf("/") + 1);
		fetch('/parks/' + code).then((res) => {
	      return res.json();
	    })
	    .then((res) => {
	    	if(res.state == 1){
	    		console.log(res.hasSession);
	    		//[TODO]mock ranking
	    		let ranking = 1 + Math.floor(Math.random() * 59);
		    	this.setState({info:res.info, alerts:res.alerts, hasSession: res.hasSession, ranking});
		    	this.setState({weather: res.weather});
		    	let latLon = [utils.parseLatLon(this.state.info.latLong).lat, utils.parseLatLon(this.state.info.latLong).lon];				
				this.setState({latLon, campsites: res.campsites, watched: res.watched});
		    }
	    })
	    .catch((err) => {
	    	console.log(err);
	    })
	    .then(() => {
	    	this.setState({initial: false});
	    });
	}

	alertsMap = (e, i) => {
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
		
		return <div key={i} className="alert_line" style={bng_style}>
			<img src={src}/>
			<div className="alert_p">
				<p className="alert alert_title">{e.title + ":"}</p>
				<p className="alert alert_desc">{e.description}</p>
			</div>
		</div>
	}

	addToWatch = () => {
		if(!this.state.hasSession){
			if(!this.state.showLoginWarning){
				this.setState({showLoginWarning: true});
			}
		}
		else{
			console.log("here");
			this.setState({showLoginWarning: false});
			const path = this.props.location.pathname;
			const code = path.substring(path.lastIndexOf("/") + 1);
			fetch('/parks/' + code + "/watch", {
				method:'POST',
				headers:{'Content-Type': 'application/json'},  
			})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				if(res.state === 1){
					this.setState({watched: true});
					const temp = this.state.notif_window;
					if(temp == 0)
						this.setState({notif_window: 1});
					else if(temp == 1)
						this.setState({notif_window: 2});
					else
						this.setState({notif_window: 1});
				}
				else if(res.state === 2){
					this.setState({watched: false});
					const temp = this.state.notif_window;
					if(temp == 0)
						this.setState({notif_window: 1});
					else if(temp == 1)
						this.setState({notif_window: 2});
					else
						this.setState({notif_window: 1});
				}
				else if(res.state === -1){
					this.setState({hasSession: false});
				}
				else{
					this.setState({redirect:true});
				}
			})
			.catch((err) => {
				this.setState({redirect:true});
			});
		}
	}

	closeWarning = () => {
		if(this.state.showLoginWarning){
			this.setState({showLoginWarning: false});
		}
	}

	selectMenu = (e) => {
		this.setState({menu: e.target.id});
	}

	renderRedirect = () => {
		if(this.state.redirect){
			return <Redirect to={{pathname:'/notification', msg: utils.SERVER_ERR_MSG, state: 0}} />  
		}
	}


	render(){
		const images = utils.importAll(require.context('../../../public/img/parks', false));
		let banner_style, loginWarningStyle, watched;
		let watched_btn_content, notif_content;
		if(!this.state.initial){
			let arr = [this.state.info];
			let mapping = utils.match(arr, images);
			banner_style = {backgroundImage:"url(" + encodeURI(mapping[this.state.info.name]) + ")"};

			if(!this.state.showLoginWarning)
				loginWarningStyle = {display: "none"};
			else
				loginWarningStyle = {display: "flex"};

			if(this.state.hasSession && this.state.watched){
				watched = {background: "#ec5f5f", color: "white"};
				watched_btn_content = "WATCHED";
				notif_content = "Watched successfully";
			}
			else{
				watched = {background: "white", color: "#ec5f5f"};
				watched_btn_content = "ADD TO WATCH";
				notif_content = "Unwatched successfully";
			}

		}

		let menuNavColor=["#33ccff", "#8080ff", "#ff0066", "#009999"];
		let menuNavStyle = [
			{background: this.state.menu == 0 ? "#0d3752" : menuNavColor[0]},
			{background: this.state.menu == 1 ? "#0d3752" : menuNavColor[1]},
			{background: this.state.menu == 2 ? "#0d3752" : menuNavColor[2]},
			{background: this.state.menu == 3 ? "#0d3752" : menuNavColor[3]} 
		]

		let pointerStyle = [
			{display: this.state.menu == 0 ? "block" : "none"},
			{display: this.state.menu == 1 ? "block" : "none"},
			{display: this.state.menu == 2 ? "block" : "none"},
			{display: this.state.menu == 3 ? "block" : "none"}
		]

		return (
			<div>
				{!this.state.initial &&
					<div>
						{this.renderRedirect()}
						<div className={this.state.notif_window == 0 ? "notif_window notif_window0" : (this.state.notif_window == 1 ? "notif_window notif_window1" : "notif_window notif_window2")}>
							<img src={checked} className="notif_checked"/>{notif_content}
						</div>
						<div className="park_banner" style={banner_style}>
							<h1>{this.state.info.name}</h1>
						</div>
						<div className="park_wrapper">
							<div className="alerts_wrapper">
								{this.state.alerts.map(this.alertsMap)}
							</div>
							<div className="park_content">
								<div className="park_left">
									<div className="park_content_nav">
										<div className="content_option" id="0" onClick={this.selectMenu} style={menuNavStyle[0]}>
											Overview
											<div className="menu_pointer" style={pointerStyle[0]}>
											</div>
										</div>
										<div className="content_option" id="1" onClick={this.selectMenu} style={menuNavStyle[1]}>
											Weather
											<div className="menu_pointer" style={pointerStyle[1]}>
											</div>
										</div>
										<div className="content_option" id="2" onClick={this.selectMenu} style={menuNavStyle[2]}>
											Campsite
											<div className="menu_pointer" style={pointerStyle[2]}>
											</div>
										</div>
										<div className="content_option" id="3" onClick={this.selectMenu} style={menuNavStyle[3]}>
											Gallery
											<div className="menu_pointer" style={pointerStyle[3]}>
											</div>
										</div>
									</div>
									<div className="park_content_wrapper">
										{this.state.menu == 0 && <Overview info={this.state.info}/>}
										{this.state.menu == 1 && <Weather weather={this.state.weather}/>}
										{this.state.menu == 2 && <Campsite parkLatLon={this.state.latLon} campsites={this.state.campsites} code={this.state.info.parkCode}/>}
										{this.state.menu == 3 && <Gallery />}
									</div>
								</div>
								<div className="park_right">
									<div className="ranking_board">
										<h1>{this.state.ranking}</h1>
									</div>
									<div className="name_board">
									<div className="states_board">
										{
											this.state.info.states.split(",").map(function(e, i){
												return <Link key={i} to="/">{e}</Link>
											})
										}
									</div>
									<h4>{this.state.info.name}</h4>
									</div>
									<div className="park_user_area">
										<button className="park_fav_btn" onClick={this.addToWatch} style={watched}>
										{watched_btn_content}
										</button>
										<div style={loginWarningStyle} className="login_notif"><p>Please&ensp;<Link to="/login">login</Link>&ensp;first </p><b onClick={this.closeWarning}>&#10005;</b></div>
										<button className="park_review_btn">WRITE A REVIEW</button>
									</div>
									<div className="link_area">
										<a href={this.state.info.url}>Office Site(NPS)</a>
										<a href={this.state.info.directionsUrl}>More Direction Info</a>
									</div>
									<div className="tag_area">
									</div>
								</div>
							</div>
						</div>
					</div>
				}	
			</div>
		)
	}
}