import React from 'react';
import './Park.css';

const Park = function (props){
  return (
    <div className="parkBoard">
      <div className="parkAvantar">
        <img src={props.url} className="thumbnail" alt="logo"/>
      </div>
      <div className="parkInfo">
        <h3>{props.name}</h3>
      </div>
    </div>
  );
}

export default Park;