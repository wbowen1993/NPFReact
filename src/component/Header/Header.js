import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './Header.css';
import logo from './logo.png';
import utils from '../../utils/utils';

export default class Header extends Component{
	constructor(props){
		super(props);
		this.state = {
			initial: true,
			hasSession: false,
			profile_img: "default.svg",
			toggle: false
		};
		this.checkSession = this.checkSession.bind(this);
		this.importAll = this.importAll.bind(this);
		this.toggleAvantar = this.toggleAvantar.bind(this);
	};

	componentDidMount(){
		this.checkSession();
		this.setState({initial: false});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.checkSession();
	}

	checkSession = () => {
		const token = utils.getCookie("cookie");
		// console.log(token);
		if(token){
			fetch("/user/verify").
			then((res) => {
		        return res.json();
		    }).then((res) => {
		        if(res.success == 1){
		        	if(res.profile_img != '' && this.state.profile_img != res.profile_img){
		        		console.log("Change");
		        		this.setState({profile_img: res.profile_img});
		        	}
		        	if(!this.state.hasSession)
			        	this.setState({hasSession: true});
		        }
		        else {
		        	if(res.success == 0){
		        		utils.setCookie("cookie", "");
		        	}
		        	if(this.state.hasSession)
						this.setState({hasSession: false});
		        }
		    })
		    .catch((err) => {
		    	if(this.state.hasSession)
			        this.setState({hasSession: false});
		    });
		}
		else{
			if(this.state.hasSession)
				this.setState({hasSession: false});
		}
	}

	importAll = (r) => {
	    let images = {};
	    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
	    return images;
	}

	toggleAvantar = () => {
		this.setState({toggle: !this.state.toggle});
	}

	render(){
		var login_style, avantar_style, dropdown_style;

		const images = this.importAll(require.context('../../../public/img/avantar', false));

		if(this.state.profile_img ){
			console.log(this.state.profile_img);
		}
		if(this.state.hasSession){
			login_style = {display: "none"}
			avantar_style = {display: "inline-block"}
		}
		else{
			avantar_style = {display: "none"}
			login_style = {display: "inline-block"}
		}

		if(this.state.toggle && this.state.hasSession){
			dropdown_style = {display: "block"};
		}
		else{
			dropdown_style = {display: "none"};
		}

		return (
			<div>
				{!this.state.initial && 
					<div className="nav">
						<div className="logo">
							<Link to="/"><img src={logo} alt="logo"/></Link>
						</div>
						<h3>NATIONAL PARK FINDER</h3>
						<button className="btn" style={login_style}><Link to="/login">Sign In</Link></button>
						<span className="avantar_wrapper" style={avantar_style}>
							<img src={images[this.state.profile_img]} alt="avantar" className="avantar" onClick={this.toggleAvantar}/>
						</span>
						<div className="dropdown_div" style={dropdown_style}>
							<div className="dropdown_wrapper">
								<div className="dropdown_box"><Link to="/profile" onClick={this.toggleAvantar}>My Profile</Link></div>
								<div className="dropdown_box"><Link to="/logout" onClick={this.toggleAvantar}>Log out</Link></div>
							</div>
						</div>
					</div>
				}
				{this.props.children}
			</div>
		);
	}
}
