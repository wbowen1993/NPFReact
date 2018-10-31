import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import utils from "../../utils/utils";

import user_img from "./user.png";
import pwd_img from "./pwd.png";

const styles = theme => ({
  root: {
	  flexGrow: 1,
	  padding: '40px 20px'
  },
  editbox_content_wrapper: {
	  padding: '20px'
  },
  formControl:{
	marginBottom: 8
  },
});

class Login extends Component{
  	constructor(props) {
		super(props);
		this.state = {
			hover1: false, 
			hover2: false,
			email_input: '',
			reenter_email_input: '',
			invalidEmail: true,
			invalidReenterEmail: false,
			snackbarMsg: '',
			redirect: false,
			dialogOpen: false,
			reset_err: false,
			reset_err_msg: '',
			server_error_msg: utils.SERVER_ERR_MSG
		}

		this.renderRedirect = this.renderRedirect.bind(this);
		this.toggleHover1 = this.toggleHover1.bind(this);
		this.toggleHover2 = this.toggleHover2.bind(this);
		this.resetHandler = this.resetHandler.bind(this);
		this.emailChangeHandler = this.emailChangeHandler.bind(this);
		this.dialogOpenHandler = this.dialogOpenHandler.bind(this);
		this.dialogCloseHandler = this.dialogCloseHandler.bind(this);
  	};

	toggleHover1(){
		this.setState({hover1: !this.state.hover1})
	}

  	toggleHover2(){
		this.setState({hover2: !this.state.hover2})
  	}

  	dialogOpenHandler(){
		this.setState({ dialogOpen: true});
  	}

  	dialogCloseHandler(){
		this.setState({ dialogOpen: false, reset_err: false, reset_err_msg: ''});
		this.setState({ email_input: '', reenter_email_input: ''});
  	}

  	emailChangeHandler(e){
		this.setState({[e.target.id]: e.target.value}, () => {
		  	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(re.test(String(this.state.email_input).toLowerCase())){
				this.setState({invalidEmail: false});
			}
			else{
			  	this.setState({invalidEmail: true});
			}
		  
		  	if(this.state.reenter_email_input == this.state.email_input){
				this.setState({invalidReenterEmail: false});
		  	}
		  	else{
				this.setState({invalidReenterEmail: true});
		  	}
		});
  	}

  	renderRedirect(){
		if(this.state.redirect){
			return <Redirect to={{pathname:this.state.redirect_path, msg: this.state.server_error_msg, state: 0}} />  
		}
  	}

  	resetHandler(){
		if(!this.state.invalidEmail && !this.state.invalidReenterEmail){
		  	fetch('/user/reset', {
			  	method:'POST',
			  	headers:{'Content-Type': 'application/json'},  
			  	body:JSON.stringify({
					"email":this.state.email_input
			  	})
		  	}).then(res => {
				return res.json();
		  	}).then(res => {
				if(res.state == -2){
				  this.setState({redirect: true, redirect_path: "/notification", server_error_msg: res.msg});
				}
				else if(res.state == -1){
				  this.setState({reset_err: true, reset_err_msg: res.msg});
				}
				else if(res.state == 0){
				  this.setState({redirect: true, redirect_path: "/notification"});
				}
				else if(res.state == 1){
				  window.location.reload();
				}
		  	}).catch(err => {
				this.setState({redirect: true, redirect_path: "/notification"});
		  	});
		}
  	}


  render(){

	const { classes } = this.props;

	var width1, width2;
	if (this.state.hover1) {
	  width2 = {width: '40%'}
	  width1 = {width: '60%'}
	} else {
	  width2 = {width: '50%'}
	}

	if (this.state.hover2) {
	  width1 = {width: '40%'}
	  width2 = {width: '60%'}
	} else {
	  if(this.state.hover1){
		width1 = {width: '60%'}
	  }
	  else{
		width1 = {width: '50%'}
	  }
	}

	return (
	  <div>
		{
		  this.state.redirect && this.renderRedirect()
		}
		{
		  !this.state.redirect &&
		  <div className="login-wrapper">
			<h2 className="formHeader">Welcome</h2>
			<form onSubmit={this.handleSubmit}>
				<p className="warning">{this.props.error.server_err ? this.props.error.server_err : ""}</p>
				<div className = 'input_div user'>
				  <img className = 'input_icon' src = {user_img} alt='user'/>
				  <input type = 'text' className="form_input" name="email" placeholder="email address" onChange={this.props.handlers.changeHandler} />
				  <p className="warning">{this.props.error.email_err ? this.props.error.email_err : ""}</p>
				</div>
				<div className ='input_div pwd'>
				  <img className = 'input_icon' src = {pwd_img} alt='pwd'/>
				  <input type = 'password' className="form_input" name="password" placeholder="password(min. 8 characters)" onChange={this.props.handlers.changeHandler}/>
				  <p className="warning">{this.props.error.password_err ? this.props.error.password_err : ""}</p>
				</div>
				<div className="forget">
				  <p onClick={this.dialogOpenHandler}>FORGET PASSOWORD?</p>
				</div>
				<div className="submit-div">
				  <input type="submit" className="btn submit-btn" onMouseEnter={this.toggleHover1} onMouseLeave={this.toggleHover1} onClick={this.props.handlers.loginSubmitHandler} style={width1} id="login-btn" value="LOG IN" />
				  <button className="btn submit-btn" onMouseEnter={this.toggleHover2} onMouseLeave={this.toggleHover2} onClick={this.props.handlers.showHandler} style={width2} id="signup-btn">SIGN UP</button>
				</div>
			</form>
			<Dialog
			  open={this.state.dialogOpen}
			  onClose={this.dialogCloseHandler}
			  aria-labelledby="form-dialog-title"
			  className={classes.editbox_wrapper}
			  fullWidth={true}
			>
			  <DialogTitle id="form-dialog-title" className="editbox_title">Reset password</DialogTitle>
			  <DialogContent className={classes.editbox_content_wrapper}>
				{
				  this.state.reset_err &&
				  <p className="reset_warning">{this.state.reset_err_msg}</p>
				}
				<FormControl className={classes.formControl} fullWidth aria-describedby="component-error-text">
				  <InputLabel htmlFor="component-error">Email</InputLabel>
				  <Input id="email_input" value={this.state.email_input} onChange={this.emailChangeHandler} />
				  {
					this.state.invalidEmail && <FormHelperText error id="component-error-text">Invalid email address</FormHelperText>
				  }
				</FormControl>
				<FormControl className={classes.formControl} fullWidth aria-describedby="component-error-text">
				  <InputLabel htmlFor="component-error">Reenter email</InputLabel>
				  <Input id="reenter_email_input" value={this.state.reenter_email_input} onChange={this.emailChangeHandler} />
				  {
					this.state.invalidReenterEmail && <FormHelperText error id="component-error-text">Different email address</FormHelperText>
				  }
				</FormControl>
			  </DialogContent>
			  <DialogActions>
				<Button onClick={this.dialogCloseHandler} color="primary">Cancel</Button>
				<Button onClick={this.resetHandler} color="primary">Confirm</Button>
			  </DialogActions>
			</Dialog>
		  </div>
		}
	  </div>
	);
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
