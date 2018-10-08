import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import "./login.css";
import Notification from "../Control/Notification";
import user_img from "./user.png";
import pwd_img from "./pwd.png";

class Signup extends Component{
  constructor(props) {
    super(props);
    this.state = {
      hover1: false, 
      hover2: false
    }

    this.toggleHover1 = this.toggleHover1.bind(this);
    this.toggleHover2 = this.toggleHover2.bind(this);
  };

  toggleHover1(){
    this.setState({hover1: !this.state.hover1})
  }

  toggleHover2(){
    this.setState({hover2: !this.state.hover2})
  }

  render(){

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
      <div className="login-board">
        <div className="login-wrapper">
        <h2 className="formHeader">Sign Up</h2>
        <form onSubmit={this.handleSubmit}>
            <div className = 'input_div user'>
              <img className = 'input_icon' src = {user_img} alt='user'/>
              <input type = 'text' className="form_input" name="email" placeholder="email address" onChange={this.props.handlers.changeHandler} />
              <p className="warning">{this.props.error.email_err ? this.props.error.email_err : ""}</p>
            </div>
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
              <button className="btn submit-btn" onMouseEnter={this.toggleHover1} onMouseLeave={this.toggleHover1} onClick={this.props.handlers.showHandler} style={width1} id="signup-btn">LOG IN</button>
              <input type="submit" className="btn submit-btn" onMouseEnter={this.toggleHover2} onMouseLeave={this.toggleHover2} onClick={this.props.handlers.signupSubmitHandler} style={width2} id="login-btn" value="SIGN UP" />
            </div>
        </form>
        </div>
      </div>
    );
  }
}

class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      hover1: false, 
      hover2: false
    }


    this.toggleHover1 = this.toggleHover1.bind(this);
    this.toggleHover2 = this.toggleHover2.bind(this);
  };



  toggleHover1(){
    this.setState({hover1: !this.state.hover1})
  }

  toggleHover2(){
    this.setState({hover2: !this.state.hover2})
  }

  render(){

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
      <div className="login-board">
        <div className="login-wrapper">
        <h2 className="formHeader">Welcome</h2>
        <form onSubmit={this.handleSubmit}>
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
              <p>FORGET PASSOWORD?</p>
            </div>
            <div className="submit-div">
              <input type="submit" className="btn submit-btn" onMouseEnter={this.toggleHover1} onMouseLeave={this.toggleHover1} onClick={this.props.handlers.loginSubmitHandler} style={width1} id="login-btn" value="LOG IN" />
              <button className="btn submit-btn" onMouseEnter={this.toggleHover2} onMouseLeave={this.toggleHover2} onClick={this.props.handlers.showHandler} style={width2} id="signup-btn">SIGN UP</button>
            </div>
        </form>
        </div>
      </div>
    );
  }
}

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '', 
      reenter: '',
      email_err:'', 
      password_err: '', 
      reenter_err: '',
      login_disp: true,
      redirect: false,
      notif_msg:'',
      redirect_path: '/notification'
    };

    this.handleChange = this.handleChange.bind(this);
    this.showValidation = this.showValidation.bind(this);
    this.clearValidation = this.clearValidation.bind(this);
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.boxShow = this.boxShow.bind(this);
    this.validate = this.validate.bind(this);
    this.verify = this.verify.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
    this.error_msg_reset = this.error_msg_reset.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
    if(this.state.login_disp == false || (this.state.login_disp && event.target.name != "password"))
      this.validate([event.target.name], event.target.value);
  }

  //state code as property to pass to the notification page: 0 for server error, 1 for mail server error/info
  handleSignUpSubmit(event) {
    const SERVER_ERR_MSG = "Oops, it seems that we have some troubles for our server";
    if(this.verify()){
      fetch("/user/signup", {
        method:'POST',
        headers:{'Content-Type': 'application/json'},  
        body:JSON.stringify({
          "email":this.state.email,
          "password":this.state.password  
        })
      }).then((res) => {
        return res.json();
      }).then((res) => {
        if(res.state === 1)
          this.showValidation("email_err", res.msg);
        else if(res.state === 0){
          //TODO redict notification page
          this.setState({redirect:true, notif_msg: res.msg, state:1, redirect_path: '/notification'});
        }
        else{
          this.setState({redirect:true, notif_msg: res.msg, state:1, redirect_path: '/notification'});
        }

      })
      .catch((err) => {
        console.log(err);
        this.setState({redirect:true, notif_msg: SERVER_ERR_MSG, state:0, redirect_path: '/notification'});
      });
    }

    event.preventDefault();
  }

  handleLoginSubmit(event) {
    const SERVER_ERR_MSG = "Oops, it seems that we have some troubles for our server";
    console.log(this.state.password);
    if(this.verify()){
      fetch("/user/login", {
        method:'POST',
        headers:{'Content-Type': 'application/json'},  
        body:JSON.stringify({
          "email":this.state.email,
          "password":this.state.password  
        })
      }).then((res) => {
        return res.json();
      }).then((res) => {
        if(res.state === 1)
          this.showValidation("email_err", res.msg);
        else if(res.state === 0){
          //TODO redict notification page
          this.setState({redirect:true, notif_msg: res.msg, state: 0, redirect_path: '/notification'});
        }
        else{
          //TODO redirect profile page
          // this.boxShow();
          this.setState({redirect:true, redirect_path: '/'});
        }

      })
      .catch((err) => {
        console.log(err);
        this.setState({redirect:true, notif_msg: SERVER_ERR_MSG, state: 0, redirect_path: '/notification'});
      });
    }
    event.preventDefault();
  }

  boxShow(){
    this.setState({login_disp: !this.state.login_disp});
    this.error_msg_reset();
  }

  showValidation(elm, msg){
    this.setState({[elm]: msg});
  }

  clearValidation(elm){
    this.setState({[elm]: ''});
  }

  error_msg_reset(){
    this.setState({email_err:'', password_err:'', reenter_err:'',})
  }

  renderRedirect = () => {
    if(this.state.redirect)
      return <Redirect to={{pathname:this.state.redirect_path, msg: this.state.notif_msg, state: this.state.state}} />
  }


  validate(type, value){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(type == 'email'){
      if(!re.test(String(value).toLowerCase())){
        this.showValidation("email_err", "Please type valid email");
      }
      else{
        this.clearValidation("email_err");
      }
    }

    if(type == 'password'){
      let validPassword = false;
      if(value.length >= 8 && /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value))
        validPassword = true;
      // console.log(value);
      if(this.state.password != '' && !validPassword){
        this.showValidation("password_err", "Password must contain\n1. 8 characters at least;\n2. digit, uppercase and lowercase");
      }
      else{
        console.log("passed");
        this.clearValidation("password_err");
      }
    }

    if(type == 'reenter'){
      if(!this.state.login_disp && value != '' && value != this.state.password){
        this.showValidation("reenter_err", "Different with your password");
      }
      else{
        this.clearValidation("reenter_err");
      }
    }
    // this.verify();
  }

  verify(){
    if(this.state.email_err == '' && this.state.password_err.length == '' && this.state.reenter_err == '')
      return true;
    return false;
  }

  render() {

    var handlers = {
      showHandler: this.boxShow,
      changeHandler: this.handleChange,
      loginSubmitHandler: this.handleLoginSubmit,
      signupSubmitHandler: this.handleSignUpSubmit,
      verifyHandler: this.verify
    }

    var errorMsg = {
      email_err: this.state.email_err,
      password_err: this.state.password_err,
      reenter_err:this.state.reenter_err
    }

    return (
      
      <div>
        {this.renderRedirect()}
        <div className="bng" id="user_bng">
          {this.state.login_disp && <Login handlers={handlers} error={errorMsg}/>}
          {!this.state.login_disp && <Signup handlers={handlers} error={errorMsg}/>}
        </div>
      </div>
    );
  }
}
