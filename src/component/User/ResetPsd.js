import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

import utils from "../../utils/utils";
import './ResetPsd.css';

import pwd_img from "./pwd.png";

class ResetPsd extends Component{
	constructor(props){
		super(props);
		this.state = {
			initial: true,
			redirect: false, 
			redirect_msg: utils.SERVER_ERR_MSG,
			input_error: '',
		}

		this.renderRedirect = this.renderRedirect.bind(this);
	}

	componentDidMount(){

		const obj = queryString.parse(this.props.params);

		fetch("/user/reset_request", {
			method: 'POST',
			headers:{'Content-Type': 'application/json'},  
	        body:JSON.stringify({
	          "uid":obj.uid ? obj.uid : '',
	          "sessionid":obj.sessionid ? obj.sessionid : ''  
	        })
	    })
        .then(res => {
	        return res.json();
		})
		.then(res => {
			if(res.state == 0){
				this.setState({initial: false, redirect:true, redirect_msg: res.msg});
			}
			else if(res.state == 1){
				this.setState({initial: false, redirect:false});
			}
		})
		.catch(err => {
			this.setState({initial: false, redirect:true});
		});
	}

	renderRedirect(){
        return <Redirect to={{pathname:"/notification", msg: this.state.redirect_msg}} />
	}

	render(){

		return (
			<div>
				{
				  	!this.state.initial && this.state.redirect && this.renderRedirect()
				}
				{
					!this.state.initial && !this.state.redirect && 
					<div className="login-wrapper">
						<h2 className="formHeader">Reset Password</h2>
						<form>
							<div className ='input_div pwd'>
								<img className = 'input_icon' src = {pwd_img} alt='pwd'/>
				            	<input type = 'password' className="form_input" name="password" placeholder="password(min. 8 characters)" onChange={this.props.handlers.changeHandler} />
								<p className="warning">{this.props.error.password_err ? this.props.error.password_err : ""}</p>
				            </div>
				            <div className ='input_div pwd'>
								<img className = 'input_icon' src = {pwd_img} alt='pwd'/>
              					<input type = 'password' className="form_input" name="reenter" placeholder="reenter the password" onChange={this.props.handlers.changeHandler} />
								<p className="warning">{this.props.error.reenter_err ? this.props.error.reenter_err : ""}</p>
				            </div>
							<div className="submit-div">
							  	<button className="btn submit-btn reset-btn" onClick={this.props.handlers.resetHandler} id="signup-btn">Confirm Reset</button>
							</div>
						</form>
					</div>
				}
			</div>

		)
	}
}

export default ResetPsd;