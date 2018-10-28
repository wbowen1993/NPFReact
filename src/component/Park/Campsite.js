import React, {Component} from 'react';
import {Link} from "react-router-dom";
import L from 'leaflet';
import './Campsite.css';
import 'leaflet/dist/leaflet.css';

// import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import icon from './forest2.png';

const iconUrl = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

let campIcon = L.Icon.extend({
    options: {
        shadowUrl: iconShadow
    }
});

const offical_site_base = "https://www.nps.gov/";



L.Marker.prototype.options.icon = DefaultIcon;

export default class Campsite extends Component{
	constructor(props){
		super(props);
		this.state = {

		}
	}

	componentDidMount(){
		this.map = L.map('map', {
			center: this.props.parkLatLon,
			zoom: 10,
			layers: [
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}),
			]
		});
		let parkMarker = L.marker(this.props.parkLatLon).addTo(this.map);

		let allMarkers = [parkMarker];
		for(let i = 0;i < this.props.campsites.length;i++){
			if(this.props.campsites[i].latLon){
				console.log(i);
				let tempUrl = iconUrl + (i + 1).toString() + ".png";
				let tempIcon = new campIcon({iconUrl: tempUrl});
				allMarkers.push(L.marker(this.props.campsites[i].latLon, {icon: tempIcon}).addTo(this.map)); 
			}
		}
		let group = L.featureGroup(allMarkers); //add markers array to featureGroup
        this.map.fitBounds(group.getBounds());   
	}

	render(){
		return (
			<div className="campsite_wrapper">
				<div id="map">
				</div>
				<div className="acc_content campsite_info_box">
				{
					!this.props.campsites.length && 
					<div className="err_board">
						<h2>There is no designed campground for this park, you can check more by visiting <a href={offical_site_base + this.props.code}>official site</a>
						</h2>
					</div>
				}
				{
					this.props.campsites.map(function(e, i){
						let directions = "<b>Direction: </b>" + e.directionsOverview;
						return <div key={i} className="campsite_info_row">
								<div className="campsite_index">{i + 1}</div>
								<div className="info_wrapper campsite_info_wrapper">
									<h4>{e.name.trim().split(" ").map(function(word){console.log(word);word = word.toLowerCase(); return word[0].toUpperCase() + word.substring(1)}).join(" ")}</h4>
									<div className="same_line">{e.phone.length > 10 && <h5>Contact: {e.phone}</h5>}
									{e.reserveUrl.length > 10 && <a href={e.reserveUrl}>RESERVE HERE</a>}
									<a href={e.more}>MORE INFO</a>
									</div>
									<p dangerouslySetInnerHTML={{__html: directions}}></p>
								</div>
						</div>
					})
				}
				</div>
			</div>
		)
	}
}

