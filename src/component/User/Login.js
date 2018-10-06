import React, {Component} from 'react';
import "./login.css";
import user_img from "./user.png";
import pwd_img from "./pwd.png";
import logo from '../Header/logo.png';

class Signup extends Component{
  constructor(props) {
    super(props);
    this.state = {login_disp: false,
      hover1: false, 
      hover2: false,
      email: '',
      password: '',
      reenter: ''
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
              <img className = 'input_icon' src = {user_img}/>
              <input type = 'text' className="form_input" value={this.state.email} placeholder="email address" onChange={this.handleChange} />
            </div>
            <div className ='input_div pwd'>
              <img className = 'input_icon' src = {pwd_img}/>
              <input type = 'password' className="form_input" value={this.state.password} placeholder="password(min. 8 characters)" onChange={this.handleChange} />
            </div>
            <div className ='input_div pwd'>
              <img className = 'input_icon' src = {pwd_img}/>
              <input type = 'password' className="form_input" value={this.state.reenter} placeholder="reenter the password" onChange={this.handleChange} />
            </div>
            <div className="submit-div">
              <button className="btn submit-btn" onMouseEnter={this.toggleHover1} onMouseLeave={this.toggleHover1} onClick={this.props.handlers.showHandler} style={width1} id="signup-btn">LOG IN</button>
              <input type="submit" className="btn submit-btn" onMouseEnter={this.toggleHover2} onMouseLeave={this.toggleHover2} style={width2} id="login-btn" value="SIGN UP" />
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
      hover2: false,
      email: '',
      password: ''
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
              <img className = 'input_icon' src = {user_img}/>
              <input type = 'text' className="form_input" value={this.state.email} placeholder="email address" onChange={this.handleChange} />
            </div>
            <div className ='input_div pwd'>
              <img className = 'input_icon' src = {pwd_img}/>
              <input type = 'password' className="form_input" value={this.state.password} placeholder="password(min. 8 characters)" onChange={this.handleChange} />
            </div>
            <div className="submit-div">
              <input type="submit" className="btn submit-btn" onMouseEnter={this.toggleHover1} onMouseLeave={this.toggleHover1} style={width1} id="login-btn" value="LOG IN" />
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
    this.state = {username: '', 
      password: '', 
      error_email_info: '',
      error_pwd_info: '',
      login_disp: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.boxShow = this.boxShow.bind(this);
  }

  handleChange(event) {
    console.log(event.target);
    this.setState({username: event.target.username, password: event.target.password});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.username);
    event.preventDefault();
  }

  boxShow(){
    this.setState({login_disp: !this.state.login_disp});
  }

  render() {

    var handlers = {
      showHandler: this.boxShow,
      changeHandler: this.handleChange
    }

    return (
      <div className="login-bng">
        {this.state.login_disp && <Login handlers={handlers}/>}
        {!this.state.login_disp && <Signup handlers={handlers}/>}
      </div>
    );
  }
}
