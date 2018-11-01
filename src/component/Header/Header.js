import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './Header.css';
import logo from './logo.png';
import utils from '../../utils/utils';


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  logo:{
  	height:50,
  	width:50
  },
  avatar: {
  	height:'50px',
  	width:'50px',
  	borderRadius: '100%',
	objectFit: 'cover'
  },
  menuItem: {
  	paddingTop: '5px',
  	paddingBottom: '5px'
  }
};

class Header extends Component{
	constructor(props){
		super(props);
		this.state = {
			initial: true,
			hasSession: false,
			profile_img: "default.svg",
			toggle: false,
			anchorEl: null
		};
	};

	componentDidMount(){
		this.checkSession();
		this.setState({initial: false});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// this.checkSession();
	}

	checkSession = () => {
		const token = utils.getCookie("cookie");
		// console.log(token);
		if(token){
			fetch("/user/verify").
			then((res) => {
		        return res.json();
		    }).then((res) => {
		        if(res.success == 1){
		        	if(res.profile_img != '' && this.state.profile_img != res.profile_img){
		        		console.log("Change");
		        		this.setState({profile_img: res.profile_img});
		        	}
		        	if(!this.state.hasSession)
			        	this.setState({hasSession: true});
		        }
		        else {
		        	if(res.success == 0){
		        		utils.setCookie("cookie", "");
		        	}
		        	if(this.state.hasSession)
						this.setState({hasSession: false});
		        }
		    })
		    .catch((err) => {
		    	if(this.state.hasSession)
			        this.setState({hasSession: false});
		    });
		}
		else{
			if(this.state.hasSession)
				this.setState({hasSession: false});
		}
	}

	handleChange = event => {
	    this.setState({ auth: event.target.checked });
	};

  	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

  	handleClose = () => {
    	this.setState({ anchorEl: null });
  	};


	render(){
		
		const { classes } = this.props;
	    const { hasSession, anchorEl } = this.state;
	    const open = Boolean(anchorEl);

		const images = utils.importAll(require.context('../../../public/img/avatar', false));

		const HomeLink = props => <Link to="/" {...props} />
		const LoginLink = props => <Link to="/login" {...props} onClick={this.forceUpdate}/>
		const ProfileLink = props => <Link to="/profile" {...props} />
		const LogoutLink = props => <Link to="/logout" {...props} />
		
		return (
			<div>
				{!this.state.initial && 
					<div className={classes.root}>
				        <AppBar position="fixed" style={{backgroundColor:'#0d3752'}}>
				          <Toolbar>
				            <IconButton className={classes.menuButton} 
				            			color="inherit" 
				            			aria-label="Menu" 
				            			component={HomeLink}>
				            	<img src={logo} className={classes.logo} alt="logo"/>
				            </IconButton>
				            <Typography variant="h6" color="inherit" className={classes.grow}>
				              National Park Finder
				            </Typography>
				            {!hasSession && (
				            	<Button color="inherit" component={LoginLink}>Login</Button>
				            )}
				            {hasSession && (
				              <div>
				                <IconButton
				                  aria-owns={open ? 'menu-appbar' : null}
				                  aria-haspopup="true"
				                  onClick={this.handleMenu}
				                  color="inherit"
				                >
				                  <img src={images[this.state.profile_img]} className={classes.avatar} alt="avatar"/>
				                </IconButton>
				                <Menu
				                  id="menu-appbar"
				                  anchorEl={anchorEl}
				                  getContentAnchorEl={null}
				                  anchorOrigin={{
				                    vertical: 'bottom',
				                    horizontal: 'center',
				                  }}
				                  transformOrigin={{
				                    vertical: -5,
				                    horizontal: 'center',
				                  }}
				                  open={open}
				                  onClose={this.handleClose}
				                >
				                  <MenuItem onClick={this.handleClose} 
				                  			className={classes.menuItem}
			                  				component={ProfileLink}>Profile</MenuItem>
				                  <MenuItem onClick={this.handleClose} 
				                  			className={classes.menuItem}
				                  			component={LogoutLink}>Logout</MenuItem>
				                </Menu>
				              </div>
				            )}
				          </Toolbar>
				        </AppBar>
				      </div>
				}
				{this.props.children}
			</div>
		);
	}
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
