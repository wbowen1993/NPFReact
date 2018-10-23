import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './Home.css';

class Home extends Component{
  
  render(){
    return (
      <div className="homeWrapper">
        <div className="head">
          <h1>FIND YOUR PARK</h1>
        </div>
        <div id="box">
          <Link to="/features" className="links">EXLORER MORE</Link>
        </div>
      </div>
    );
  }
}

export default Home;