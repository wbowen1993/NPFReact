import React, {Component} from 'react';
import user_img from "./user.png";
import pwd_img from "./pwd.png";

export default class Login extends Component{
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
              <p>FORGET PASSOWORD?</p>
            </div>
            <div className="submit-div">
              <input type="submit" className="btn submit-btn" onMouseEnter={this.toggleHover1} onMouseLeave={this.toggleHover1} onClick={this.props.handlers.loginSubmitHandler} style={width1} id="login-btn" value="LOG IN" />
              <button className="btn submit-btn" onMouseEnter={this.toggleHover2} onMouseLeave={this.toggleHover2} onClick={this.props.handlers.showHandler} style={width2} id="signup-btn">SIGN UP</button>
            </div>
        </form>
      </div>
    );
  }
}