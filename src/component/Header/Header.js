import React, {Component} from 'react';
import './Header.css';
import logo from './logo.png';

class Header extends Component{
  render(){
  	return (
	  	<div>
	    <div className="nav">
	      <img src={logo} className="logo" alt="logo"/>
	      <h3>National Park Finder</h3>
	      <button className="btn">Log In</button>
	    </div>
	    {this.props.children}
	    </div>
	  );
	}
}

export default Header;