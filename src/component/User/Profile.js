import React, {Component} from 'react';
import {Link} from "react-router-dom";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
//material ui import
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import utils from "../../utils/utils";

import './Profile.css';

import photo_icon from './photo.svg';
import review_icon from './review.svg';
import plus from './plus.svg';
import checked from '../Park/checked.svg';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '40px 20px'
  },
  wrapper: {
    maxWidth: 1200,
    margin: 'auto',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

const theme = createMuiTheme({
  breakpoints: {
    // Define custom breakpoint values.
    // These will apply to Material-UI components that use responsive
    // breakpoints, such as `Grid` and `Hidden`. You can also use the
    // theme breakpoint functions `up`, `down`, and `between` to create
    // media queries for these breakpoints
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600
    }
  }
});


class Profile extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	      initial: true,
	      redirect: false,
	      edit_box_show: false,
	      user:'',
	      username:'',
	      username_input: '',
	      uploadFile: null,
	      imagePreviewUrl: null,
	      redirect_path: '',
	      error_msg: '',
	      notif_window: 0
	    };

	    this.renderRedirect = this.renderRedirect.bind(this);
	    this.editBoxToggle = this.editBoxToggle.bind(this);
	    this.onChangeHandler = this.onChangeHandler.bind(this);
	    this.fileChangeHandler = this.fileChangeHandler.bind(this);
	    this.submitHandler = this.submitHandler.bind(this);
	    this.unwatchHandler = this.unwatchHandler.bind(this);
	}

	componentDidMount(){
		
		fetch("/user/profile").then((res) => {
	        return res.json();
		}).then((res) => {
			if(res.state === 1){
			  this.setState({redirect:true, redirect_path: '/login'});
			}
			else if(res.state === 0){
			  //2 for sucess and 0 for server error(database)
			  this.setState({redirect:true, notif_msg: res.msg, state:1, redirect_path: '/notification'});
			}
			else if(res.state === 2){
			  //3 for session issue
			  // console.log(res.watchList);
			  this.setState({redirect:false, user:res.info, username:res.info.username, watchList: res.watchList, username_input: res.info.username, imagePreviewUrl: res.info.profile_img});
			}
			this.setState({initial:false});
		})
		.catch((err) => {
			this.setState({redirect:true, notif_msg: utils.SERVER_ERR_MSG, state:0, redirect_path: '/notification'});
			this.setState({initial:false});
		});
	}

	renderRedirect = () => {

		if(this.state.redirect){
			if(this.state.redirect_path == "/login")
				return <Redirect to={{pathname:"/login"}} />
			else
				return <Redirect to={{pathname:this.state.redirect_path, msg: utils.SERVER_ERR_MSG, state: 0}} />  
		}
	}

	editBoxToggle = () => {
		this.setState({edit_box_show: !this.state.edit_box_show});
		this.setState({username_input: this.state.username, imagePreviewUrl: this.state.user.profile_img});
		this.setState({error_msg: ""});
	}

	onChangeHandler(e){
		this.setState({[e.target.name]:e.target.value});
	}

	fileChangeHandler(e){
		let reader = new FileReader();
	    let file = e.target.files[0];

	    reader.onloadend = () => {
	      this.setState({
	        uploadFile: file,
	        imagePreviewUrl: reader.result,
	        error_msg: ''
	      });
	    }

	    if(file && file != undefined)
		    reader.readAsDataURL(file)
	}

	submitHandler(e){
        e.preventDefault();

		const formData = new FormData();
		formData.append('profile_img', this.state.uploadFile);
		formData.append('email', this.state.user.email);
		formData.append('username', this.state.username_input);
		const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

		axios.post('/user/profile/info', formData, config)
        .then((res) => {
            if(res.data.state == 1){
            	// console.log("Refresh");
            	window.location.reload();
            }
            else if(res.data.state == 0){
            	console.log(res.data.msg);
            	this.setState({error_msg: res.data.msg});
            }
            else if(res.data.state == -1){

            	// console.log(res.state);
            	this.setState({redirect: true, redirect_path: "/login"})
            }
            else if(res.data.state == -2){
            	
            	console.log(res.data.state);
            	this.setState({redirect: true, redirect_path: "/notification"});
            }
        }).catch((error) => {
    		// console.err(error);
    		this.setState({redirect: true, redirect_path: "/notification"});
    	});
	}

	unwatchHandler(e){
		let code = e.target.id;
		fetch('/parks/' + code + "/watch", {
				method:'POST',
				headers:{'Content-Type': 'application/json'},  
			})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				if(res.state === 2){
					this.setState({watchList: utils.findAndDelete(this.state.watchList, code)});
					const temp = this.state.notif_window;
					if(temp == 0)
						this.setState({notif_window: 1});
					else if(temp == 1)
						this.setState({notif_window: 2});
					else
						this.setState({notif_window: 1});
				}
				else if(res.state === -1){
					this.setState({redirect:true, redirect_path: "/login"});
				}
				else{
					this.setState({redirect:true});
				}
			})
			.catch((err) => {
				this.setState({redirect:true});
			});
	}

	render(){
		const accept_note = "<b>Accept:</b><br/>1. Only images with name of extension as following: .jpg, .jpeg, .bmp, .svg, .png;<br/>2. Less than 2 MB";

		const { classes } = this.props;

		var avantar, preview_avantar;
		var images;
		var username;
		var edit_box_show, bng_style;
		if(!this.state.redirect){
			images = utils.importAll(require.context('../../../public/img/avantar', false));
			if(this.state.user.profile_img != ''){
				avantar = images[this.state.user.profile_img];
			}
			else{
				avantar = images["default.svg"];
			}
			if(this.state.imagePreviewUrl == null || this.state.imagePreviewUrl == '')
				preview_avantar = images["default.svg"];
			else if(this.state.imagePreviewUrl == this.state.user.profile_img)
				preview_avantar = images[this.state.imagePreviewUrl];
			else
				preview_avantar = this.state.imagePreviewUrl;
			if(this.state.user.username != ''){
				username = this.state.user.username;
			}
			else{
				username = "Anonymous User";
			}
			if(this.state.edit_box_show){
				edit_box_show = {"display": "block"};
				bng_style = {
					display:"block"
				}
			}
			else{
				edit_box_show = {"display": "none"};
				bng_style = {
					display:"none"
				}
			}
		}
		return (
			<div>
				{!this.state.initial && this.renderRedirect()}
				{!this.state.initial && !this.state.redirect &&
					<div className="profile_page_wrapper">
						<div className={this.state.notif_window == 0 ? "notif_window notif_window0" : (this.state.notif_window == 1 ? "notif_window notif_window1" : "notif_window notif_window2")}>
							<img src={checked} className="notif_checked"/>Unwatch successfully
						</div>
						<MuiThemeProvider theme={theme}>
							<div className={classes.root}>
								<div className={classes.wrapper}>
							      <Grid container spacing={16}>
							        <Grid item xs={12} md={4} lg={3}>
							        	<div className="side_box">
											<div className="box personal_info_box">
												<h3>Personal Info</h3>
												<div className="avantar_box">
													<img src={avantar} className="avantar"></img>
												</div>
												<div className="row"><h4>{this.state.user.email}</h4></div>
												<div className="row"><h4>{username}</h4></div>
												<div className="edit_btn_container"><h4 onClick={this.editBoxToggle}>Edit Profile</h4></div>
											</div>
											<div className="box contribution_box">
												<h3>Contribution</h3>
												<div className="row"><img src={photo_icon}/><h4 className="contribution_num">{this.state.user.contribution_img}</h4></div>
												<div className="row"><img src={review_icon}/><h4 className="contribution_num">{this.state.user.contribution_review}</h4></div>
											</div>
										</div>
							        </Grid>
							        <Grid item xs={12} md={8} lg={9}>
							          <div className="box content_box">
											<h3>Watch List</h3>
											{
												!this.state.watchList.length && 
												<h2>Your watch list is empty</h2>
											}
											{
												
												this.state.watchList.map(function(park, i){
													return <div key={i} className="watchlist_wrapper">
														<p>{park.name}</p>
														{
															<div className="states_board">{
																park.states.split(",").map(function(state, ii){
																	return <Link key={ii} to="/">{state}</Link>
																})
															}
															</div>
														}
														<button className="btn watch_btn" id={park.code} onClick={this.unwatchHandler}>Unwatch</button>
													</div>
												}, this)
											}
										</div>
							        </Grid>
							      </Grid>
							    </div>
						    </div>
						    <div className="mask bng_mask" style={bng_style}>
							</div>
							<div className="edit_box_wrapper">
								<div className="edit_box" style={edit_box_show}>
									<div className="edit_area">
										<Grid container spacing={8}>
								        	<Grid item xs={12} md={6}>
								        	<div className="flex_box avantar_area">
												<img src={preview_avantar} className="preview_avantar"></img>
												<label htmlFor="upload" className="mask upload_mask"><img src={plus}></img></label>
												<input type="file" id="upload" accept=".jpg, .png, .jpeg, .svg, .bmp|images/*" onChange={this.fileChangeHandler}/>
												<p className="warning">{this.state.error_msg}</p>
												<p className="note" dangerouslySetInnerHTML={{__html: accept_note}}></p>
											</div>
											</Grid>
								        	<Grid item xs={12} md={6}>
											<div className="flex_box info_area">
												<label>Username</label>
												<input type="text" value={this.state.username_input} className="input_box" name="username_input" onChange={this.onChangeHandler}/>
												<label>Username</label>
												<input type="text" value={this.state.username_input} className="input_box" name="username_input" onChange={this.onChangeHandler}/>
												<label>Username</label>
												<input type="text" value={this.state.username_input} className="input_box" name="username_input" onChange={this.onChangeHandler}/>
											</div>
											</Grid>
										</Grid>
									</div>
									<div className="console_area">
										<button className="btn cancel" onClick={this.editBoxToggle}>Cancel</button>
										<button className="btn save" onClick={this.submitHandler}>Save</button>
									</div>
								</div>
							</div>
						</MuiThemeProvider>
					</div>
				}
			</div>
		)
	}
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
