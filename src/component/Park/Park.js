import React, { Component } from 'react';
import {Link, Redirect} from "react-router-dom";
import axios from 'axios';
import ImageCompressor from 'image-compressor.js';

import Rating from 'react-rating';

//material ui import
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import './Park.css';
import caution from './caution.svg';
import danger from './danger.svg';
import info from './info.svg';
import checked from './checked.svg';
import full from './star_full.svg';
import empty from './star_empty.svg';
import readonly from './star_readonly.svg';
import upload_placeholder from './upload.svg';
import cancel from './cancel.svg';
import review from './review.svg';
// import imgPlaceholder from './placeholder.jpg';

import utils from '../../utils/utils';
import Overview from './Overview';
import Weather from './Weather';
import Campsite from './Campsite';
import Gallery from './Gallery';

const styles = theme => ({
	review_pop_content_wrapper:{
		padding: '20px'
	},
	review_content_text:{
		color: '#0d3752'
	},
	review_content_text_warning:{
		color: 'red'
	},
	titleBar: {
		color: 'white',
		height: 'initial',
	    background:
	      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
	      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
	},
	icon:{
		width: 10
	}
});

class Park extends Component{
	constructor(props){
		super(props);
		this.state = {
			initial: true,
			hasSession: false,
			watched: false,
			showLoginWarning: false,
			redirect: false,
			menu:0,
			notif_window: 0,
			open: false,
			user_review: {},
			editing_review: {},
			all_reviews: [],
			uploadFiles: null,
			error_msg: [],
			validate_notif:false,
			imagePreviewUrl: []
		};

		this.addToWatch = this.addToWatch.bind(this);
		this.closeWarning = this.closeWarning.bind(this);
		this.selectMenu = this.selectMenu.bind(this);
		this.reviewPop = this.reviewPop.bind(this);
		this.postReview = this.postReview.bind(this);
		this.ratingChange = this.ratingChange.bind(this);
		this.reviewChange = this.reviewChange.bind(this);
		this.validate = this.validate.bind(this);
		this.fileChangeHandler = this.fileChangeHandler.bind(this);
		this.deleteImg = this.deleteImg.bind(this);
	}

	componentDidMount(){
		const code = utils.getParkCode(this.props);

		fetch('/parks/' + code).then((res) => {
	      return res.json();
	    })
	    .then((res) => {
	    	if(res.state == 1){
	    		console.log(res.hasSession);
	    		//[TODO]mock ranking
	    		let ranking = 1 + Math.floor(Math.random() * 59);
		    	this.setState({info:res.info, alerts:res.alerts, hasSession: res.hasSession, ranking});
		    	this.setState({weather: res.weather});
		    	let latLon = [utils.parseLatLon(this.state.info.latLong).lat, utils.parseLatLon(this.state.info.latLong).lon];				
		    	this.setState({latLon, campsites: res.campsites, watched: res.watched, all_reviews: res.allReviews, user_review: res.review, editing_review: res.review});
		    }
	    })
	    .catch((err) => {
	    	console.log(err);
	    })
	    .then(() => {
	    	this.setState({initial: false});
	    });
	}

	alertsMap = (e, i) => {
		let bng_style = [
			{background: "#ffebe6", borderColor: "#ffad99"},
			{background: "#ffffe6", borderColor: "#e6e600"},
			{background: "#e6f7ff", borderColor: "#99ddff"}
		];
		let icon_style = [
			danger, caution, info
		];
		let type;
		if(e.category == "Danger"){
			type = 0;
		}
		else if(e.category == "Caution"){
			type = 1;
		}
		else{
			type = 2;
		}

		bng_style = bng_style[type];
		let src = icon_style[type];
		
		return <div key={i} className="alert_line" style={bng_style}>
			<img src={src}/>
			<div className="alert_p">
				<p className="alert alert_title">{e.title + ":"}</p>
				<p className="alert alert_desc">{e.description}</p>
			</div>
		</div>
	}

	addToWatch = () => {
		if(!this.state.hasSession){
			if(!this.state.showLoginWarning){
				this.setState({showLoginWarning: true});
			}
		}
		else{
			this.setState({showLoginWarning: false});
			const path = this.props.location.pathname;
			const code = path.substring(path.lastIndexOf("/") + 1);
			fetch('/parks/' + code + "/watch", {
				method:'POST',
				headers:{'Content-Type': 'application/json'},  
			})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				if(res.state === 1){
					this.setState({watched: true});
					const temp = this.state.notif_window;
					if(temp == 0)
						this.setState({notif_window: 1});
					else if(temp == 1)
						this.setState({notif_window: 2});
					else
						this.setState({notif_window: 1});
				}
				else if(res.state === 2){
					this.setState({watched: false});
					const temp = this.state.notif_window;
					if(temp == 0)
						this.setState({notif_window: 1});
					else if(temp == 1)
						this.setState({notif_window: 2});
					else
						this.setState({notif_window: 1});
				}
				else if(res.state === -1){
					this.setState({hasSession: false});
				}
				else{
					this.setState({redirect:true});
				}
			})
			.catch((err) => {
				this.setState({redirect:true});
			});
		}
	}

	postReview = (e) => {
		e.preventDefault();
		//check for image upload part
		if(this.state.error_msg.length){
			return;
		}
		//check for rating
		if(!this.validate()){
			this.setState({validate_notif: true});
			return;
		}
		else{
			this.setState({validate_notif: false});
		}

		const code = utils.getParkCode(this.props);

		const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
		
		const formData = new FormData();
		formData.append('rating', this.state.editing_review.rating);
		formData.append('review', this.state.editing_review.review ? this.state.editing_review.review : "");
		let count = 0;
		if(this.state.uploadFiles && this.state.uploadFiles.length){
			for(let file of this.state.uploadFiles){
				let compressor = new ImageCompressor();

				compressor.compress(file, {quality:0.6})
				.then((result) => {
					formData.append('images', result, result.name);
					if(++count == this.state.uploadFiles.length){

				        // console.log(this.state.editing_review);
						axios.post('/parks/' + code + "/review", formData, config)
				        .then((res) => {
				            if(res.data.state == 1){
				            	// console.log("Refresh");
				            	this.setState({ open: false });
				            	window.location.reload();
				            }
				            else if(res.data.state == 0){
				            	this.setState({ open: false });
					    		this.setState({redirect: true, redirect_path: "/notification"});
				            }
				            else if(res.data.state == -1){
				            	this.setState({ open: false });
				            	this.setState({redirect: true, redirect_path: "/login"})
				            }
				            else if(res.data.state == -2){
				            	this.setState(previousState => ({error_msg: [...previousState.error_msg, res.data.msg]}));
				            }
				        }).catch((error) => {
				    		// console.err(error);
				    		this.setState({ open: false });
				    		this.setState({redirect: true, redirect_path: "/notification"});
				    	});
					}
				})
				.catch((err) => {
					this.setState(previousState => ({error_msg: [...previousState.error_msg,"Error for " + file.name]}));
				});
			}
		}
		else{
	        // console.log(this.state.editing_review);
			axios.post('/parks/' + code + "/review", formData, config)
	        .then((res) => {
	            if(res.data.state == 1){
	            	// console.log("Refresh");
	            	this.setState({ open: false });
	            	window.location.reload();
	            }
	            else if(res.data.state == 0){
	            	this.setState({ open: false });
		    		this.setState({redirect: true, redirect_path: "/notification"});
	            }
	            else if(res.data.state == -1){
	            	this.setState({ open: false });
	            	this.setState({redirect: true, redirect_path: "/login"})
	            }
	            else if(res.data.state == -2){
	            	this.setState(previousState => ({error_msg: [...previousState.error_msg, res.data.msg]}));
	            }
	        }).catch((error) => {
	    		// console.err(error);
	    		this.setState({ open: false });
	    		this.setState({redirect: true, redirect_path: "/notification"});
	    	});
		}
		
		
	}

	validate(){
		if(this.state.editing_review.rating)
			return true;
		return false;
	}

	reviewPop = () => {
		// this.setState({ open: true });
		if(!this.state.hasSession){
			if(!this.state.showLoginWarning){
				this.setState({showLoginWarning: true});
			}
		}
		else{
			this.setState({showLoginWarning: false, open: true});
		}
	}


	handleClose = () => {
	    this.setState({ open: false, editing_review: this.state.user_review, validate_notif: false, error_msg: [], imagePreviewUrl: []});
	};

	closeWarning = () => {
		if(this.state.showLoginWarning){
			this.setState({showLoginWarning: false});
		}
	}

	fileChangeHandler(e){
		console.log(e.target.files);
		if(e.target.files.length > 10){
			this.setState(previousState => ({error_msg: [...previousState.error_msg,"Too many files"]}));
			return;
		}
	    let files = e.target.files;
	    let previewUrls = [];
	    let uploadFiles = [];

	    if(files && files != undefined){
	    	this.setState({error_msg: []});
	    	// this.setState({imagePreviewUrl: new Array(files.length).fill({url: imgPlaceholder, name: "uknown"})});
	    	for(let i = 0;i < files.length;i++){
	    		if(files[i].size > 10 * 1024 * 1024){
	    			this.setState(previousState => ({error_msg: [...previousState.error_msg,"Too large for " + files[i].name]}));
	    		}
    			let reader = new FileReader();  
		        reader.onload = ((file) => { 
		        	return (event) => {
		        		previewUrls.push({url:event.target.result, name: file.name});
		        		uploadFiles.push(file);
				        if(previewUrls.length == files.length){
				        	this.setState({
				    			uploadFiles,
						        imagePreviewUrl: previewUrls
				    		});
				        }

		        	}
		        })(files[i]);
		        reader.readAsDataURL(files[i]);
		    }
	    }
	}

	deleteImg = (e) => {
		let index = e.target.id.substr(e.target.id.indexOf("-") + 1);
		// console.log(e.target.id);
		let previewImgs = this.state.imagePreviewUrl;
		previewImgs.splice(index, 1);
		let files = this.state.uploadFiles;
		files.splice(index, 1);
		this.setState({error_msg: []});
		for(let i = 0;i < files.length;i++){
			if(files[i].size > 10 * 1024 * 1024){
				this.setState(previousState => ({error_msg: [...previousState.error_msg,"Too large for " + files[i].name]}));
			}
		}
		console.log(files);
		this.setState({imagePreviewUrl: previewImgs, uploadFiles: files});
	}

	ratingChange = (value) => {
		this.setState({editing_review: {rating: value, review: this.state.editing_review.review ? this.state.editing_review.review : ""}});
	}

	reviewChange = (e) => {
		e.preventDefault();
		this.setState({editing_review: {rating: this.state.editing_review.rating ? this.state.editing_review.rating : 0, review: e.target.value}});
	}

	selectMenu = (e) => {
		this.setState({menu: e.target.id});
	}

	renderRedirect = () => {
		if(this.state.redirect){
			return <Redirect to={{pathname:'/notification', msg: utils.SERVER_ERR_MSG, state: 0}} />  
		}
	}


	render(){

		const accept_note = "<b>Accept:</b><br/>1. Only images with name of extension as following: .jpg, .jpeg, .png<br/>2. Less than 10 photos<br/>3. Less than 10MB for each photo";

		const images = utils.importAll(require.context('../../../public/img/parks', false));

		const review_photos = utils.importAll(require.context('../../../public/img/review'), false);

		const { classes } = this.props;

		let banner_style, loginWarningStyle, watched;
		let watched_btn_content, review_btn_content, notif_content;
		if(!this.state.initial){
			let arr = [this.state.info];
			let mapping = utils.match(arr, images);
			banner_style = {backgroundImage:"url(" + encodeURI(mapping[this.state.info.name]) + ")"};

			if(!this.state.showLoginWarning)
				loginWarningStyle = {display: "none"};
			else
				loginWarningStyle = {display: "flex"};

			if(this.state.hasSession && this.state.watched){
				watched = {background: "#ec5f5f", color: "white"};
				watched_btn_content = "WATCHED";
				notif_content = "Watched successfully";
			}
			else{
				watched = {background: "white", color: "#ec5f5f"};
				watched_btn_content = "ADD TO WATCH";
				notif_content = "Unwatched successfully";
			}

			if(this.state.hasSession && this.state.user_review.rating){
				review_btn_content = "EDIT REVIEW";
			}
			else{
				review_btn_content = "WRITE A REVIEW";
			}

		}

		let menuNavColor=["#33ccff", "#8080ff", "#ff0066", "#009999"];
		let menuNavStyle = [
			{background: this.state.menu == 0 ? "#0d3752" : menuNavColor[0]},
			{background: this.state.menu == 1 ? "#0d3752" : menuNavColor[1]},
			{background: this.state.menu == 2 ? "#0d3752" : menuNavColor[2]},
			{background: this.state.menu == 3 ? "#0d3752" : menuNavColor[3]} 
		]

		let pointerStyle = [
			{display: this.state.menu == 0 ? "block" : "none"},
			{display: this.state.menu == 1 ? "block" : "none"},
			{display: this.state.menu == 2 ? "block" : "none"},
			{display: this.state.menu == 3 ? "block" : "none"}
		]

		return (
			<div>
				{!this.state.initial &&
					<div>
						{this.renderRedirect()}
						<div className={this.state.notif_window == 0 ? "notif_window notif_window0" : (this.state.notif_window == 1 ? "notif_window notif_window1" : "notif_window notif_window2")}>
							<img src={checked} className="notif_checked"/>{notif_content}
						</div>
						<div className="park_wrapper">
							<div className="park_banner" style={banner_style}>
								<h1>{this.state.info.name}</h1>
							</div>
							<div className="park_content_wrapper">
								<div className="alerts_wrapper">
									{this.state.alerts.map(this.alertsMap)}
								</div>
								<div className="park_content">
								<Grid container spacing={16} direction="row-reverse">
							        <Grid item xs={12} md={3}>
										<div className="park_right">
											<Grid container spacing={8}>
											    <Grid item xs={12} sm={8} md={12}>
													<div className="ranking_board">
														<h1>{this.state.ranking}</h1>
													</div>
													<div className="name_board">
														<div className="states_board">
															{
																this.state.info.states.split(",").map(function(e, i){
																	return <Link key={i} to="/">{e}</Link>
																})
															}
														</div>
														<h4>{this.state.info.name}</h4>
													</div>
												</Grid>
												<Grid item xs={12} sm={4} md={12}>
													<div className="park_user_area">
														<button className="park_fav_btn" onClick={this.addToWatch} style={watched}>
														{watched_btn_content}
														</button>
														<button className="park_review_btn" onClick={this.reviewPop}>
														{review_btn_content}
														</button>
														<div style={loginWarningStyle} className="login_notif"><p>Please&ensp;<Link to="/login">login</Link>&ensp;first </p><b onClick={this.closeWarning}>&#10005;</b></div>
														</div>
													<div className="link_area">
														<a href={this.state.info.url}>Office Site(NPS)</a>
														<a href={this.state.info.directionsUrl}>More Direction Info</a>
													</div>
													<div className="tag_area">
													</div>
												</Grid>
											</Grid>
										</div>
									</Grid>
							        <Grid item xs={12} md={9}>
										<div className="park_left">
											<div className="park_content_nav">
												<Grid container spacing={0}>
													<Grid item xs={12} sm={3}>
													<div className="content_option" id="0" onClick={this.selectMenu} style={menuNavStyle[0]}>
														Overview
														<div className="menu_pointer" style={pointerStyle[0]}>
														</div>
													</div>
													</Grid>
													<Grid item xs={12} sm={3}>
													<div className="content_option" id="1" onClick={this.selectMenu} style={menuNavStyle[1]}>
														Weather
														<div className="menu_pointer" style={pointerStyle[1]}>
														</div>
													</div>
													</Grid>
													<Grid item xs={12} sm={3}>
													<div className="content_option" id="2" onClick={this.selectMenu} style={menuNavStyle[2]}>
														Campsite
														<div className="menu_pointer" style={pointerStyle[2]}>
														</div>
													</div>
													</Grid>
													<Grid item xs={12} sm={3}>
													<div className="content_option" id="3" onClick={this.selectMenu} style={menuNavStyle[3]}>
														Gallery
														<div className="menu_pointer" style={pointerStyle[3]}>
														</div>
													</div>
													</Grid>
												</Grid>
											</div>
											<div className="park_info_content_wrapper">
												{this.state.menu == 0 && <Overview info={this.state.info}/>}
												{this.state.menu == 1 && <Weather weather={this.state.weather}/>}
												{this.state.menu == 2 && <Campsite parkLatLon={this.state.latLon} campsites={this.state.campsites} code={this.state.info.parkCode}/>}
												{this.state.menu == 3 && <Gallery />}
											</div>
											{
												this.state.all_reviews.length == 0 && 
												<div className="review_borad_no_review">
													<img src={review} id="review_icon"></img>
													<h3>Be the first to write a review</h3>
											    </div>
											}
										</div>
									</Grid>
								</Grid>
								</div>
							</div>
							<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" className="review_pop_wrapper" fullWidth={true} maxWidth={'sm'}>
					        	<DialogTitle id="form-dialog-title" className="review_pop_title">Review</DialogTitle>
					          	<DialogContent className={classes.review_pop_content_wrapper}>
						          	<DialogContentText className={this.state.validate_notif ? classes.review_content_text_warning : classes.review_content_text}>
						            	Your overall rating on this park(required):
						            </DialogContentText>
						          	<Rating 
						          		initialRating={this.state.editing_review.rating ? this.state.editing_review.rating : 0}
						          		emptySymbol={<img src={empty} className="star" />}
						          		fullSymbol={<img src={full} className="star" />}
						          		onClick={this.ratingChange}
					          		/>
					          		<TextField
							          id="outlined-multiline-flexible"
							          label="Your review"
							          multiline
							          rowsMax="4"
							          value={this.state.editing_review.review ? this.state.editing_review.review : ""}
							          onChange={this.reviewChange}
							          margin="normal"
							          helperText="Write your review here"
						              fullWidth
						              autoFocus
							          variant="outlined"
							        />
							        <div className="upload_area">
								        <div className="upload_control_area">
								        	{
								        		this.state.error_msg.map((e, i) => {
											        return <p className="warning" key={i}>{e}</p>
								        		})
								        	}
											<p className="note" dangerouslySetInnerHTML={{__html: accept_note}}></p>
									        <label htmlFor="upload" className=""><img src={upload_placeholder}></img></label>
											<input type="file" id="upload" accept=".jpg, .png, .jpeg|images/*" multiple onChange={this.fileChangeHandler}/>
							          	</div>
							          	<div className="upload_preview_area">
							          	<GridList cellHeight={120} className={classes.gridList} cols={3}>
									        {this.state.imagePreviewUrl.map(function(tile, i){
									        	return <GridListTile key={i} cols={tile.cols || 1}>
									            <img src={tile.url} className="preview_img"/>
									            <GridListTileBar
									              title={tile.name}
									              titlePosition="top"
									              actionIcon={
									                <IconButton>
									                	<img src={cancel} alt="cancel" className={classes.icon} onClick={this.deleteImg} id={"upload-" + i}/>
									                </IconButton>
									              }
									              actionPosition="right"
									              className={classes.titleBar + " titleBar"}
									            />
									          </GridListTile>
									        }, this)}
										</GridList>
							          	</div>
						          	</div>
					          	</DialogContent>
					          	<DialogActions>
						            <Button onClick={this.handleClose} color="primary">
						              Cancel
						            </Button>
						            <Button onClick={this.postReview} color="primary">
						              Post
						            </Button>
					          	</DialogActions>
					        </Dialog>
						</div>
					</div>
				}	
			</div>
		)
	}
}

Park.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Park);

