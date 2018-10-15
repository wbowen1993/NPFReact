import React, {Component} from 'react';
import {Link} from "react-router-dom";
import { Redirect } from 'react-router-dom';
import './Profile.css';
import photo_icon from './photo.svg';
import review_icon from './review.svg';
import plus from './plus.svg';
import axios from 'axios';


export default class Profile extends Component{
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
	      error_msg: ''
	    };

	    this.renderRedirect = this.renderRedirect.bind(this);
	    this.importAll = this.importAll.bind(this);
	    this.editBoxToggle = this.editBoxToggle.bind(this);
	    this.onChangeHandler = this.onChangeHandler.bind(this);
	    this.fileChangeHandler = this.fileChangeHandler.bind(this);
	    this.submitHandler = this.submitHandler.bind(this);
	}

	componentDidMount(){
		const SERVER_ERR_MSG = "Oops, it seems that we have some troubles for our server";
    
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
			  // console.log(res.info);
			  this.setState({redirect:false, user:res.info, username:res.info.username, username_input: res.info.username, imagePreviewUrl: res.info.profile_img});
			}
			this.setState({initial:false});
		})
		.catch((err) => {
			this.setState({redirect:true, notif_msg: SERVER_ERR_MSG, state:0, redirect_path: '/notification'});
			this.setState({initial:false});
		});
	}

	renderRedirect = () => {

		const SERVER_ERR = "Server Error, please try later";
		if(this.state.redirect){
			if(this.state.redirect_path == "/login")
				return <Redirect to={{pathname:"/login"}} />
			else
				return <Redirect to={{pathname:this.state.redirect_path, msg: SERVER_ERR, state: 0}} />  
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

	importAll = (r) => {
	    let images = {};
	    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
	    return images;
	}

	render(){
		const accept_note = "<b>Accept:</b><br/>1. Only images with name of extension as following: .jpg, .jpeg, .bmp, .svg, .png;<br/>2. Less than 2 MB";

		var avantar, preview_avantar;
		var images;
		var username;
		var edit_box_show, bng_style;
		if(!this.state.redirect){
			images = this.importAll(require.context('../../../public/img/avantar', false));
			if(this.state.user.profile_img != ''){
				avantar = images[this.state.user.profile_img];
				console.log(this.state.user.profile_img);
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
				<div>
					{!this.state.initial && this.renderRedirect()}
					{!this.state.initial && !this.state.redirect &&
						<div className="profile_bng">
							<div className="profile_wrapper">
								<div className="side_box">
									<div className="box personal_info_box">
										<h3>Person Info</h3>
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
								<div className="box content_box">
									placeholder
								</div>
							</div>
							<div className="mask bng_mask" style={bng_style}>
							</div>
							<div className="edit_box" style={edit_box_show}>
								<div className="edit_area">
									<div className="flex_box avantar_area">
										<img src={preview_avantar} className="preview_avantar"></img>
										<label htmlFor="upload" className="mask upload_mask"><img src={plus}></img></label>
										<input type="file" id="upload" accept=".jpg, .png, .jpeg, .svg, .bmp|images/*" onChange={this.fileChangeHandler}/>
										<p className="warning">{this.state.error_msg}</p>
										<p className="note" dangerouslySetInnerHTML={{__html: accept_note}}></p>
									</div>
									<div className="flex_box info_area">
										<label>Username</label>
										<input type="text" value={this.state.username_input} className="input_box" name="username_input" onChange={this.onChangeHandler}/>
										<label>Username</label>
										<input type="text" value={this.state.username_input} className="input_box" name="username_input" onChange={this.onChangeHandler}/>
										<label>Username</label>
										<input type="text" value={this.state.username_input} className="input_box" name="username_input" onChange={this.onChangeHandler}/>
									</div>
								</div>
								<div className="console_area">
									<button className="btn cancel" onClick={this.editBoxToggle}>Cancel</button>
									<button className="btn save" onClick={this.submitHandler}>Save</button>
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		)
	}
}
