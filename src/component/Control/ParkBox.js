import React from 'react';
import {Link} from "react-router-dom";
import './ParkBox.css';

const ParkBox = function (props){
  const style = {background:"#" + props.colors};
  return (
    <div className="parkBoard">
      <div className="parkInfo" style={style}>
        <h3>{props.index}</h3>
      </div>
      <div className="parkAvantar">
        <img src={props.url} className="thumbnail" alt="logo"/>
        <Link to={"/park/" + props.code}>
          <div className="mask park_mask">
            <p className="park_title">{props.name}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ParkBox;