import React from 'react';
import {Link} from "react-router-dom";
import './Gallery.css';

import photo from "./photos.svg";

const Gallery = function(props){
	return (
		<div className="gallery_wrapper">
		{
			props.photos.length == 0 && 
			<div className="empty_content">
				<img src={photo} id="photo_icon"></img>
				<h3>Be the first to upload photo</h3>
		    </div>
		}
		</div>
	)
}

export default Gallery;