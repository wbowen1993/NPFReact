import React from 'react';
import {Link} from "react-router-dom";
import './SearchBox.css';

const SearchBox = function (props){
  return (
    <div className="search_div">
      <input type="text" className="search_input" onChange={props.searchChange}/>
      <div className="searchResultDropdown">{
        props.qualified.map(function(e){
          return <div className="searchResultLine">
            <p className="searchState">{e.states}</p>
            <p className="searchName"><Link to={"/park/" + e.code}>{e.name}</Link></p>
          </div>
        })
      }
      </div>
    </div>
  );
}

export default SearchBox;