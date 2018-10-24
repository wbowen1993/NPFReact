import React from 'react';
import {Link} from "react-router-dom";

import Grid from '@material-ui/core/Grid';

import './Weather.css';
import './css/weather-icons.min.css';

const Weather = function(props){
	const weather = props.weather;
	return (
		<div className="content_wrapper weather_wrapper">
			{weather.length == 0 && 
				<div className="err_board">
					<h2>No weather service available currently</h2>
				</div>
			}
			{	weather.length > 0 && 
				<Grid container spacing={8}>
				{
					weather.map(function(e, i){
						return <Grid key={i} item xs={12} sm={i == weather.length - 1 ? 12 : 6} md={i < 3 ? 4: 6} lg>
							<div key={i} className="weather_box">
								<h4 className="weather_date">{e.date}</h4>
								<i className={"wi wi-owm-" + e.id}/>
								<h3 className="weather_main">{e.desc}</h3>
								<h3>{e.temp != undefined ? (e.temp) : (e.temp_min + "~" + e.temp_max)}&#8457;</h3>
								<div className="weather_column"><h5>Humidity:</h5><h5>{e.humidity + "%"}</h5></div>
								<div className="weather_column"><h5>Clouds:</h5><h5>{e.clouds + "%"}</h5></div>
							</div>
						</Grid>
					})
				}
				</Grid>
			}
		</div>
	)
}

export default Weather;