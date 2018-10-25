import React, {Component} from 'react';
import {Link} from "react-router-dom";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
//material ui import
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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
  editbox_content_wrapper: {
  	padding: '20px'
  }
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
	      user:'',
	      username:'',
	      username_input: '',
	      uploadFile: null,
	      imagePreviewUrl: null,
	      redirect_path: '',
	      error_msg: '',
	      notif_window: 0,
	      open: false
	    };

	    this.renderRedirect = this.renderRedirect.bind(this);
	    this.editBoxToggle = this.editBoxToggle.bind(this);
	    this.onChangeHandler = this.onChangeHandler.bind(this);
	    this.fileChangeHandler = this.fileChangeHandler.bind(this);
	    this.submitHandler = this.submitHandler.bind(this);
	    this.unwatchHandler = this.unwatchHandler.bind(this);
	    this.handleClose = this.handleClose.bind(this);
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
		this.setState({open: true});
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

	handleClose = () => {
	    this.setState({ open: false});
	    this.setState({ username_input: this.state.username, imagePreviewUrl: this.state.user.profile_img});
		this.setState({ error_msg: ""});
	};

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

		var avatar, preview_avatar;
		var images;
		var username;
		if(!this.state.redirect){
			images = utils.importAll(require.context('../../../public/img/avatar', false));
			if(this.state.user.profile_img != ''){
				avatar = images[this.state.user.profile_img];
			}
			else{
				avatar = images["default.svg"];
			}
			if(this.state.imagePreviewUrl == null || this.state.imagePreviewUrl == '')
				preview_avatar = images["default.svg"];
			else if(this.state.imagePreviewUrl == this.state.user.profile_img)
				preview_avatar = images[this.state.imagePreviewUrl];
			else
				preview_avatar = this.state.imagePreviewUrl;
			if(this.state.user.username != ''){
				username = this.state.user.username;
			}
			else{
				username = "Anonymous User";
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
												<div className="avatar_box">
													<img src={avatar} className="avatar"></img>
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
														<p><Link to={"park/" + park.code}>{park.name}</Link></p>
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
						    <Dialog
					        	open={this.state.open}
					        	onClose={this.handleClose}
					        	aria-labelledby="form-dialog-title"
					        	className={classes.editbox_wrapper}
					        	fullWidth={true}
					        	maxWidth={'sm'}
					        >
					        	<DialogTitle id="form-dialog-title" className="editbox_title">Personal Info</DialogTitle>
					        	<DialogContent className={classes.editbox_content_wrapper}>
					          		<Grid container spacing={8}>
					          			<Grid item xs={12} sm={7}>
								          	<div className="flex_box avatar_area">
												<img src={preview_avatar} className="preview_avatar"></img>
												<label htmlFor="upload" className="mask upload_mask"><img src={plus}></img></label>
												<input type="file" id="upload" accept=".jpg, .png, .jpeg, .svg, .bmp|images/*" onChange={this.fileChangeHandler}/>
												<p className="warning">{this.state.error_msg}</p>
												<p className="note" dangerouslySetInnerHTML={{__html: accept_note}}></p>
											</div>
										</Grid>
										<Grid item xs={12} sm={5}>
								          	<TextField
									          id="standard-name"
									          label="Username"
									          value={this.state.username_input}
									          onChange={this.onChangeHandler}
									          margin="normal"
									          fullWidth
									          variant="outlined"
									        />
						        		</Grid>
						        	</Grid>
					          	</DialogContent>
					        	<DialogActions>
					        		<Button onClick={this.handleClose} color="primary">Cancel</Button>
					            	<Button onClick={this.submitHandler} color="primary">Confirm</Button>
					        	</DialogActions>
					        </Dialog>
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
