import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './Header.css';
import logo from './logo.png';

class Header extends Component{
  render(){
  	return (
	  	<div>
	    <div className="nav">
	      <div className="logo"><Link to="/"><img src={logo} alt="logo"/></Link></div>
	      <h3>National Park Finder</h3>
	      <button className="btn"><Link to="/login">Log In</Link></button>
	    </div>
	    {this.props.children}
	    </div>
	  );
	}
}

export default Header;