import React, {Component} from 'react';
import {Link} from "react-router-dom";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
//material ui import
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import Rating from 'react-rating';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; 

import utils from "../../utils/utils";

import './Profile.css';

import photo_icon from './photo.svg';
import review_icon from './review.svg';
import plus from './plus.svg';
import checked from '../Park/checked.svg';
import full from '../Park/star_readonly.svg';
import empty from '../Park/star_empty.svg';

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
	},
	gridList:{
		paddingBottom: 8,
	},
	star:{
	  	width: 20,
	  	height: 20
	},
  	vote:{
		borderRadius: '1000px',
		borderWidth: 2,
		borderStyle: 'solid',
		marginRight: 8
	},
	upvote:{
		borderColor: '#00cc66',
		color: '#00cc66 !important',
	},
	downvote:{
		borderColor: '#ff6666',
		color: '#ff6666 !important',
	},
	deleteBtn:{
		color: 'white',
		backgroundColor: '#ff8566'
	},
	formControl:{
		marginBottom: 8
	},
	snackbar:{
		background: '#00cc66'
	},
});

const theme = createMuiTheme({
  	typography: {
    	useNextVariants: true,
  	},
  	breakpoints: {
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
	      username_input: '',
	      email_input: '',
	      reenter_email_input: '',
	      uploadFile: null,
	      imagePreviewUrl: null,
	      redirect_path: '',
	      error_msg: '',
	      notif_window: 0,
	      infoDialogOpen: false,
	      reviews: [],
	      photos: [],
	      imageOpen: false,
	      emailChangeOpen: false,
	      snackBarOpen: false,
	      snackbarMsg: '',
	      invalidEmail: true,
	      invalidReenterEmail: false,
	      imgurl: "",
	      server_error_msg: utils.SERVER_ERR_MSG
	    };

	    this.renderRedirect = this.renderRedirect.bind(this);
	    this.editBoxToggle = this.editBoxToggle.bind(this);
	    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
	    this.fileChangeHandler = this.fileChangeHandler.bind(this);
	    this.submitInfoHandler = this.submitInfoHandler.bind(this);
	    this.unsubscribeHandler = this.unsubscribeHandler.bind(this);
	    this.infoDialogClose = this.infoDialogClose.bind(this);
	    this.enlargeImg = this.enlargeImg.bind(this);
	    this.deleteReview = this.deleteReview.bind(this);
	    this.emailChangeHandler = this.emailChangeHandler.bind(this);
	    this.submitEmailChangeHandler = this.submitEmailChangeHandler.bind(this);
	    this.emailChangeBoxOpen = this.emailChangeBoxOpen.bind(this);
	    this.resendVerification = this.resendVerification.bind(this);
	    this.snackBarClose = this.snackBarClose.bind(this);
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
			  console.log(res.reviews);
			  this.setState({redirect:false, 
			  				user:res.info, 
			  				subscribeList: res.subscribeList,
			  				reviews: res.reviews,
			  				username_input: res.info.username,
			  				imagePreviewUrl: res.info.profile_img});
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
				return <Redirect to={{pathname:this.state.redirect_path, msg: this.state.server_error_msg, state: 0}} />  
		}
	}

	enlargeImg(e){
		this.setState({imageOpen: true, imgurl: e.target.src});
	}

	editBoxToggle = () => {
		this.setState({infoDialogOpen: true});
	}

	infoDialogClose = () => {
	    this.setState({ infoDialogOpen: false});
	    this.setState({ username_input: this.state.user.username, imagePreviewUrl: this.state.user.profile_img});
		this.setState({ error_msg: ""});
	}

	usernameChangeHandler(e){
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

	submitInfoHandler(e){
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

	emailChangeBoxOpen = () => {
		this.setState({ emailChangeOpen: true});
	}

	emailChangeClose = () => {
		this.setState({ emailChangeOpen: false});
		this.setState({ email_input: '', reenter_email_input: ''});
	}

	emailChangeHandler = (e) => {
		this.setState({[e.target.id]: e.target.value}, () => {
			let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    // if(e.target.id == "email_input"){
			    if(re.test(String(this.state.email_input).toLowerCase())){
			        this.setState({invalidEmail: false});
				}
				else{
					this.setState({invalidEmail: true});
				}
			// }
			
			if(this.state.reenter_email_input == this.state.email_input){
				this.setState({invalidReenterEmail: false});
			}
			else{
				this.setState({invalidReenterEmail: true});
			}
		});
	}

	submitEmailChangeHandler = (e) => {
		e.preventDefault();

		if(!this.state.invalidEmail && !this.state.invalidReenterEmail){
			fetch("/user/change_email", {
				method:'POST',
		        headers:{'Content-Type': 'application/json'},  
		        body:JSON.stringify({
		          "email":this.state.email_input
		        })
		    }).then(res => {
	        	return res.json();
	      	}).then(res => {
		    	if(res.state == -1){
					this.setState({redirect: true, redirect_path: "/login"});
		    	}
		    	else if(res.state == 0){
		    		this.setState({redirect: true, redirect_path: "/notification"});
		    	}
		    	else if(res.state == 1){
		    		this.setState({redirect: true, redirect_path: "/notification", server_error_msg: res.msg});
		    	}
		    	else if(res.state == 2){
	            	window.location.reload();
		    	}
		    }).catch(err => {
	    		this.setState({redirect: true, redirect_path: "/notification"});
		    });
		}
	}

	resendVerification = () => {
		fetch('/user/email_verify',{
			method: 'POST',
			headers:{'Content-Type': 'application/json'},  
	        body:JSON.stringify({
	          "email":this.state.user.email
	        })
		})
		.then(res => {
	    	return res.json();
	    })
	    .then(res => {
	    	if(res.state == -1){
	    		this.setState({redirect: true, redirect_path: "/login"});
	    	}
	    	else if(res.state == 0){
	    		this.setState({redirect: true, redirect_path: "/notification", server_error_msg: res.msg});
	    	}
	    	else if(res.state == 1){
	    		this.setState({snackBarOpen: true, snackbarMsg: res.msg});
	    	}
	    }).catch(err => {
			this.setState({redirect: true, redirect_path: "/notification"});
	    });
	}

	snackBarClose = () => {
		this.setState({ snackBarOpen: false });
	}

	deleteReview(reviewId){
		console.log(reviewId);
		fetch('/user/profile/review/' + reviewId, {
				method:'DELETE',  
			}).then((res) => {
		    	return res.json();
		    })
		    .then((res) => {
		    	if(res.state == -2){
					this.setState({redirect: true, redirect_path: "/notification", server_error_msg: res.msg});
		    	}
		    	else if(res.state == -1){
	            	this.setState({redirect: true, redirect_path: "/login"});
		    	}
		    	else if(res.state == 0){
					this.setState({redirect: true, redirect_path: "/notification"});
		    	}
		    	else if(res.state == 1){
	            	window.location.reload();
		    	}
		    })
		    .catch((err) => {
				this.setState({redirect: true, redirect_path: "/notification"});
			});
	}

	unsubscribeHandler(e){
		let code = e.target.id;
		fetch('/parks/' + code + "/subscribe", {
				method:'POST',
				headers:{'Content-Type': 'application/json'},  
			})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				if(res.state === 2){
					this.setState({subscribeList: utils.findAndDelete(this.state.subscribeList, code)});
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

		const review_imgs = utils.importAll(require.context('../../../public/img/review', false));

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
							<img src={checked} className="notif_checked"/>Unsubscribe successfully
						</div>
						<MuiThemeProvider theme={theme}>
							<div className={classes.root}>
								<div className={classes.wrapper}>
									{this.state.user.verified == false && 
										<div className="verify_notif">
											Please verify the account by clicking the link sent to your email, if you don't receive the email please request to <p onClick={this.resendVerification}>resend</p> it, or if you want to change the email, please click <p onClick={this.emailChangeBoxOpen}>here</p> 
										</div>
									}
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
												<h3>Subscribe List</h3>
												{
													!this.state.subscribeList.length && 
													<h2>Your subscription list is empty</h2>
												}
												{
													
													this.state.subscribeList.map(function(park, i){
														return <div key={i} className="subscribelist_wrapper">
															<p><Link to={"park/" + park.code}>{park.name}</Link></p>
															{
																<div className="states_board">{
																	park.states.split(",").map(function(state, ii){
																		return <Link key={ii} to="/">{state}</Link>
																	})
																}
																</div>
															}
															<button className="btn subscribe_btn" id={park.code} onClick={this.unsubscribeHandler}>Unsubscribe</button>
														</div>
													}, this)
												}
											</div>
											{
												this.state.reviews.length > 0 && 
												<div className="box content_box">
												<h3>Your Reviews</h3>
												{
													this.state.reviews.map((review, i) => {
														return <div key={i} className="profile_review_wrapper">
															<Grid container justify="space-between" alignItems="center">
																<Grid item>
																	<h4><Link to={"park/" + review.parkCode}>{review.parkName}</Link></h4>
																</Grid>
																<Grid item>
																	<Button className={classes.deleteBtn} id={"d_" + review._id} onClick={() => this.deleteReview(review._id)}>DELETE</Button>
																</Grid>
															</Grid>
															<Grid container spacing={16} alignItems="center">
														  		<Grid item>
															  		<Rating 
															      		initialRating={review.rating}
															      		emptySymbol={<img src={empty} className={classes.star} />}
															      		fullSymbol={<img src={full} className={classes.star} />}
															      		readonly
															  		/>
														  		</Grid>
														  		<Grid item>
															  		<p className="caption">
														            	{utils.calcPostTime(review.post_time)}
															        </p>
														        </Grid>
													        </Grid>
													        <p className="p_content">{review.content}</p>
													        <GridList cellHeight={100} className={classes.gridList} cols={4}>
														        {review.related_images.map((e, i) => (
														          <GridListTile key={i} cols={1}>
														            <img src={review_imgs[e.name]} alt={"images-" + i} className="review_area_img" onClick={this.enlargeImg}/>
														          </GridListTile>
														        ))}
												      		</GridList>
												      		<Button disabled className={classnames(classes.vote, classes.upvote)}>
												        		Useful&ensp;
												        		<p className="vote_bubble vote_bubble_default_upvote">{review.upvotes}</p>
											        		</Button>
												        	<Button disabled className={classnames(classes.vote, classes.downvote)}>
												        		Inappropriate&ensp;
											        			<p className="vote_bubble vote_bubble_default_downvote">{review.downvotes}</p>
											        		</Button>
														</div>
													})
												}
												</div>
											}
								      	</Grid>
							      	</Grid>
						   		</div>
					   		</div>
						    <Dialog
					        	open={this.state.infoDialogOpen}
					        	onClose={this.infoDialogClose}
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
									          onChange={this.usernameChangeHandler}
									          margin="normal"
									          fullWidth
									          variant="outlined"
									        />
						        		</Grid>
						        	</Grid>
					          	</DialogContent>
					        	<DialogActions>
					        		<Button onClick={this.infoDialogClose} color="primary">Cancel</Button>
					            	<Button onClick={this.submitInfoHandler} color="primary">Confirm</Button>
					        	</DialogActions>
					        </Dialog>
					        <Dialog
					        	open={this.state.emailChangeOpen}
					        	onClose={this.emailChangeClose}
					        	aria-labelledby="form-dialog-title"
					        	className={classes.editbox_wrapper}
					        	fullWidth={true}
					        >
					        	<DialogTitle id="form-dialog-title" className="editbox_title">Email address change</DialogTitle>
					        	<DialogContent className={classes.editbox_content_wrapper}>
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
					        		<Button onClick={this.emailChangeClose} color="primary">Cancel</Button>
					            	<Button onClick={this.submitEmailChangeHandler} color="primary">Confirm</Button>
					        	</DialogActions>
					        </Dialog>
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
					        	message={<span id="message-id">{this.state.snackbarMsg}</span>}
					          	action={[
						            <IconButton
						            	key="close"
						              	aria-label="Close"
						              	color="inherit"
						              	className={classes.close}
						              	onClick={this.snackBarClose}
						            >
						              	<CloseIcon />
						            </IconButton>,
					          	]}
					          	className={classes.snackbar}
					          	>
					        </SnackbarContent>
					        </Snackbar>
						</MuiThemeProvider>
					</div>
				}
				{this.state.imageOpen && (
		        	<Lightbox
		            mainSrc={this.state.imgurl}
		            onCloseRequest={() => this.setState({ imageOpen: false })}
		          />
		        )}
			</div>
		)
	}
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
