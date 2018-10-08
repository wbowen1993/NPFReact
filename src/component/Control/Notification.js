import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './Notification.css';


export default class Notification extends Component{
	constructor(props){
		super(props);

		this.state = {
			error_code: 0
		}

		this.getErrorCode = this.getErrorCode.bind(this);
	}

	componentDidMount(){
		this.getErrorCode();
	}

	getErrorCode(){
		if(this.props.location.state != null && this.props.location.state != undefined){
			this.setState({error_code: this.props.location.state});
		}
	}

	render(){
		return(
			<div className="bng" id="notif_bng">
				<div id="wrapper">
					<p className="notif">{this.props.location.msg}</p>
					<div className="btn" id="back_to_main">
						{this.state.error_code == 0 && <Link to="/" className="links">BACK TO MAIN PAGE</Link>}
						{this.state.error_code == 1 && <Link to="/login" className="links">LOG IN</Link>}
						{this.state.error_code == 2 && <Link to="/logout" className="links">LOG OUT</Link>}
					</div>
				</div>
			</div>
		);
	}

}