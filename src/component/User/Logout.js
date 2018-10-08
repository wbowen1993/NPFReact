import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

export default class Logout extends Component {
  	constructor(props) {
	    super(props);
	    this.state = {
	    	redirect:true,
	    	hasSession:false,
	    	notif_msg:'',
	    	initial:true
		}
		this.renderRedirect = this.renderRedirect.bind(this);
	};
	componentDidMount(){
		const SERVER_ERR_MSG = "Oops, it seems that we have some troubles for our server";
		fetch('/user/logout').then((res) => {
	      return res.json();
	    }).then((res) => {
	      // console.log(res);
	    	if(res.state){
	    		console.log("hasSession");
	    		this.setState({hasSession: true, notif_msg:"Successfully logout", initial:false});
	    	}
		  	else
				this.setState({hasSession: false, initial:false});
	    })
	    .catch((err) => {
	    	//
	    	console.log("went wrong");
			this.setState({hasSession: true, notif_msg: SERVER_ERR_MSG, initial:false});
	    });
	}
	componentWillMount(){
		this.isCancelled = true;
	}

	renderRedirect = () => {
		console.log(this.state.hasSession);
		if(this.state.hasSession)
			return <Redirect to={{pathname:'/notification', msg: this.state.notif_msg, state: 0}} />
		else
			return <Redirect to={{pathname:'/'}} />
	}

	render(){
		return(
			<div>
				{!this.state.initial && this.renderRedirect()}
			</div>
		)
	}
}