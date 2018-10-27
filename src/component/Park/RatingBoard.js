import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Rating from 'react-rating';
import {HorizontalBar} from 'react-chartjs-2';

import './RatingBoard.css';
import full from './star_readonly.svg';
import empty from './star_empty.svg';

const RatingBoard = function(props){
	return(
		<div className="rating_board">
			<Grid container justify="center" alignItems="center" direction="row">
				<Grid item xs={8}>
					<Grid container direction="column">
						{
							<HorizontalBar data={
								{	
									labels:["Excellent", "Great", "Good", "Poor", "Terrible"],
									datasets:[{
										backgroundColor: '#0d3752',
										data:props.data.distribution
									},
									{	
										backgroundColor: '#bbb',
										data:props.data.distribution.map((e) => 100 - e)
									}],
									
								} 
							}
							options={
								{
									legend: {display: false},
									gridLines: {display: false},
									scales:{
							            xAxes: [{
							            	display: false, 
							            	stacked: true
							            }],
							            yAxes: [{
							                gridLines: {
								                display: false,
								                drawBorder: false
								            },
								            stacked: true
							            }]
							        },
							        tooltips: {enabled: false}
								}
							}/>
						}
					</Grid>
				</Grid>
				<Grid item xs={4}>
					<Grid container justify="center" alignItems="center">
						<Grid item xs={12}>
							<h3>{props.data.avg}</h3>
						</Grid>
				        <Grid item xs={12}>
							<p>{props.data.count + " reviews"}</p>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

export default RatingBoard;