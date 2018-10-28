import React from 'react';
import {Link} from "react-router-dom";
// import ImageGallery from 'react-image-gallery';
// import "react-image-gallery/styles/css/image-gallery.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';


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
		{
			props.photos.length > 0 && 
			<Carousel infiniteLoop>
				{
					props.photos.map((e, i) => {
						return <div key={i} className="gallery_image_wrapper">
							<img src={e.photo}/>
							<div className="gallery_legend">
								<img className="avatar" src={e.avatar}/>
								<p>{e.username}</p>
							</div>
						</div>
					})
				}
			</Carousel>
		}
		</div>
	)
}

export default Gallery;