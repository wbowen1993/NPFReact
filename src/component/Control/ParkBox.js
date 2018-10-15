import React from 'react';
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
        <div className="mask park_mask">
          <p className="park_title">{props.name}</p>
        </div>
      </div>
    </div>
  );
}

export default ParkBox;