import React, {Component} from 'react';
import {Link} from "react-router-dom";
import { Redirect } from 'react-router-dom';
import './Profile.css';
import photo_icon from './photo.svg';
import review_icon from './review.svg';

export default class Profile extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	      session: '',
	      initial: true,
	      redirect: false,
	      edit_box_show: false,
	      user:'',
	      username:'',
	    };

	    this.renderRedirect = this.renderRedirect.bind(this);
	    this.importAll = this.importAll.bind(this);
	    this.editBoxToggle = this.editBoxToggle.bind(this);
	    this.onChangeHandler = this.onChangeHandler.bind(this);
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
			  this.setState({redirect:false, user:res.info, username:res.info.username});
			}
			this.setState({initial:false});
		})
		.catch((err) => {
			this.setState({redirect:true, notif_msg: SERVER_ERR_MSG, state:0, redirect_path: '/notification'});
			this.setState({initial:false});
		});
	}

	renderRedirect = () => {
		if(this.state.redirect){
			if(this.state.redirect_path == "/login")
				return <Redirect to={{pathname:"/login"}} />
			else
				return <Redirect to={{pathname:this.state.redirect_path, msg: this.state.notif_msg, state: this.state.state}} />  
		}
	}

	editBoxToggle = () => {
		this.setState({edit_box_show: !this.state.edit_box_show});
	}

	onChangeHandler(e){
		this.setState({[e.target.name]:e.target.value});
	}

	importAll = (r) => {
	    let images = {};
	    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
	    return images;
	}

	render(){
		var avantar;
		var images;
		var username;
		var edit_box_show, bng_style;
		if(!this.state.redirect){
			images = this.importAll(require.context('../../../public/img/avantar', false));
			if(this.state.user.profile_img != ''){
				avantar = images[this.state.user.profile_img];
			}
			else{
				avantar = images["default.svg"];
			}
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
											<img src={avantar}></img>
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
										<img src={avantar} className="preview_avantar"></img>
										<label htmlFor="upload" className="mask upload_mask"></label>
										<input type="file" id="upload" />
									</div>
									<div className="flex_box info_area">
										<label>Username</label>
										<input type="text" value={this.state.username} className="input_box" name="username" onChange={this.onChangeHandler}/>
										<label>Username</label>
										<input type="text" value={this.state.username} className="input_box" name="username" onChange={this.onChangeHandler}/>
										<label>Username</label>
										<input type="text" value={this.state.username} className="input_box" name="username" onChange={this.onChangeHandler}/>
									</div>
								</div>
								<div className="console_area">
									<button className="btn cancel" onClick={this.editBoxToggle}>Cancel</button>
									<button className="btn save">Save</button>
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		)
	}
}
