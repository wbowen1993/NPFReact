import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import queryString from 'query-string';

import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import "./login.css";
import Login from "./Login";
import Signup from "./Signup";
import ResetPsd from './ResetPsd';
import utils from "../../utils/utils";

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
      server_err: '',
      page_disp: 0,   //0 for login, 1 for signup, 2 for reset
      redirect: false,
      notif_msg:'',
      redirect_path: '/notification',
      initial:true,
      isRest: false,
      snackBarOpen: false,
      snackBarMsg: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.showValidation = this.showValidation.bind(this);
    this.clearValidation = this.clearValidation.bind(this);
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleResetSumbit = this.handleResetSumbit.bind(this);
    this.boxShow = this.boxShow.bind(this);
    this.validate = this.validate.bind(this);
    this.verify = this.verify.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
    this.error_msg_reset = this.error_msg_reset.bind(this);
    this.snackBarClose = this.snackBarClose.bind(this);
  }

  componentDidMount(){
    const isRest = window.location.href.indexOf("reset") != -1;
    this.setState({initial: false, isRest});
  }

  handleChange(event) {
    let field = event.target.name;
    let val = event.target.value;
    this.setState({[event.target.name]: event.target.value}, () => {
      if(this.state.page_disp || this.state.isRest || (!this.state.page_disp && field != "password")){
        this.validate(field, val);
      }
    });
    
  }

  //state code as property to pass to the notification page: 0 for server error, 1 for mail server error/info
  handleSignUpSubmit(event) {
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
          this.showValidation("server_err", res.msg);
        else if(res.state === 0 || res.state === 2){
          //2 for sucess and 0 for server error(database)
          this.setState({redirect:true, notif_msg: res.msg, state:1, redirect_path: '/notification'});
        }
        else if(res.state === 3){
          //3 for session issue
          this.setState({redirect:true, notif_msg: res.msg, state:2, redirect_path: '/notification'});
        }

      })
      .catch((err) => {
        console.log(err);
        this.setState({redirect:true, notif_msg: utils.SERVER_ERR_MSG, state:0, redirect_path: '/notification'});
      });
    }

    event.preventDefault();
  }

  handleLoginSubmit(event) {
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
          this.showValidation("server_err", res.msg);
        else if(res.state === 0){
          this.setState({redirect:true, notif_msg: res.msg, state: 0, redirect_path: '/notification'});
        }
        else if(res.state === 2){
          //TODO redirect profile page
          // this.boxShow();
          utils.setCookie("cookie", res.session);
          this.setState({redirect:true, redirect_path: '/profile' });

        }
        else if(res.state === 3){
          this.setState({redirect:true, notif_msg: res.msg, state: 2, redirect_path: '/notification'});
        }

      })
      .catch((err) => {
        console.log(err);
        this.setState({redirect:true, notif_msg: utils.SERVER_ERR_MSG, state: 0, redirect_path: '/notification'});
      });
    }
    event.preventDefault();
  }

  handleResetSumbit(event) {
    event.preventDefault();
    let obj = queryString.parse(this.props.location.search);
    if(this.verify()){
      fetch("/user/reset_password", {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},  
        body:JSON.stringify({
          "uid":obj.uid ? obj.uid : '',
          "sessionid":obj.sessionid ? obj.sessionid : '',
          "password": this.state.password 
        })
      })
      .then(res => {
        return res.json();
      })
      .then(res => {
        if(res.state == 0){
          this.setState({redirect:true, notif_msg: res.msg, redirect_path: '/notification'});
        }
        else if(res.state == 1){
          // this.setState({redirect:true, redirect_path: '/login'});
          this.setState({redirect: true, redirect_path: '/login', page_disp: 0, isRest: false, snackBarOpen: true, snackBarMsg: 'Password Rest Successfully'});
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({redirect:true, redirect_path: '/notification'});
      });
    }
  }

  snackBarClose(){
    this.setState({snackBarOpen: false});
  }


  boxShow(){
    this.setState({page_disp: !this.state.page_disp});
    this.error_msg_reset();
  }

  showValidation(elm, msg){
    this.setState({[elm]: msg});
  }

  clearValidation(elm){
    this.setState({[elm]: ''});
  }

  error_msg_reset(){
    this.setState({email_err:'', password_err:'', reenter_err:'', server_err:''})
  }

  renderRedirect(){
    if(this.state.redirect){
      if(this.state.redirect_path == "/profile"){
        return <Redirect to={{pathname:"/profile"}} />
      }
      else{
        return <Redirect to={{pathname:this.state.redirect_path, msg: this.state.notif_msg, state: this.state.state}} />  
      }
    }
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
      console.log(value);
      let validPassword = false;
      if(value.length >= 8 && /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value))
        validPassword = true;
      // console.log(value);
      if(value != '' && !validPassword){
        this.showValidation("password_err", "Password must contain\n1. 8 characters at least;\n2. digit, uppercase and lowercase");
      }
      else{
        console.log("passed");
        this.clearValidation("password_err");
      }
    }

    if(type == 'reenter'){
      if((this.state.page_disp || this.state.isRest) && value != '' && value != this.state.password){
        this.showValidation("reenter_err", "Different with your password");
      }
      else{
        this.clearValidation("reenter_err");
      }
    }

    if(this.state.password != this.state.reenter){
      this.showValidation("reenter_err", "Different with your password");
    }
    else{
      this.clearValidation("reenter_err");
    }
  }

  verify(){
    if(!(this.state.email == '' && this.state.password == '' && this.state.reenter == '') && this.state.email_err == '' && this.state.password_err.length == '' && this.state.reenter_err == '')
      return true;
    return false;
  }

  render() {

    var handlers = {
      showHandler: this.boxShow,
      changeHandler: this.handleChange,
      loginSubmitHandler: this.handleLoginSubmit,
      signupSubmitHandler: this.handleSignUpSubmit,
      resetHandler: this.handleResetSumbit,
      verifyHandler: this.verify
    }

    var errorMsg = {
      email_err: this.state.email_err,
      password_err: this.state.password_err,
      reenter_err:this.state.reenter_err,
      server_err:this.state.server_err
    }

    return (
      <div>
        {this.renderRedirect()}
        <div className="bng" id="user_bng">
          <ReactCSSTransitionGroup
            transitionName="drop"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}>
            <Grid container justify="center">
              <Grid item xs={11} sm={8} md={6} lg={4}>
              <div className="login-board">
              {this.state.isRest && <ResetPsd params={this.props.location.search} handlers={handlers} error={errorMsg}/>}
              {!this.state.isRest && !this.state.page_disp && <Login handlers={handlers} error={errorMsg}/>}
              {!this.state.isRest && this.state.page_disp == 1 && <Signup handlers={handlers} error={errorMsg}/>}
              </div>
            </Grid>
            </Grid>
          </ReactCSSTransitionGroup>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={this.state.snackBarOpen}
            autoHideDuration={5000}
            onClose={this.snackBarClose}
              >
              <SnackbarContent
                message={<span id="message-id">{this.state.snackBarMsg}</span>}
                  action={[
                    <IconButton
                      key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.snackBarClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                  ]}
                  className="snackBar-green"
                  >
              </SnackbarContent>
              </Snackbar>
        </div>
      </div>
    );
  }
}
