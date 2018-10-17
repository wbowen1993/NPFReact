import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './Overview.css';
import utils from '../../utils/utils';

export default class Overview extends Component{
	constructor(props){
		super(props);
		this.state = {
			toggle: [false, false, false, false]
		};

		this.changeHandle = this.changeHandle.bind(this);
	}
	changeHandle = (e) => {
		// let toggle = [false, false, false, false];
		let toggle = this.state.toggle;
		toggle[e.target.id] = !this.state.toggle[e.target.id];
		this.setState({toggle});
	}
	render(){

		const info = this.props.info;
		let contentStyle = [
			{display: this.state.toggle[0] ? "block" : "none"},
			{display: this.state.toggle[1] ? "block" : "none"},
			{display: this.state.toggle[2] ? "block" : "none"},
			{display: this.state.toggle[3] ? "block" : "none"}
		]

		let symbol = [
			this.state.toggle[0] ? String.fromCharCode(215) : String.fromCharCode(43),
			this.state.toggle[1] ? String.fromCharCode(215) : String.fromCharCode(43),
			this.state.toggle[2] ? String.fromCharCode(215) : String.fromCharCode(43),
			this.state.toggle[3] ? String.fromCharCode(215) : String.fromCharCode(43)
		]
		return (
			<div className="overview_wrapper">
				<div className="acc_wrapper">
					<div className="acc_nav_wrapper">
						<h3>Direction</h3>
						<h3 id="0" onClick={this.changeHandle} >{symbol[0]}</h3>
					</div>
					<div className="acc_content" style={contentStyle[0]}>
						<p>{info.directionsInfo}</p>
					</div>
				</div>
				<div className="acc_wrapper">
					<div className="acc_nav_wrapper">
						<h3>General Weather</h3>
						<h3 id="1" onClick={this.changeHandle} >{symbol[1]}</h3>
					</div>
					<div className="acc_content" style={contentStyle[1]}>
						<p>{info.weatherInfo}</p>
					</div>
				</div>
				<div className="acc_wrapper">
					<div className="acc_nav_wrapper">
						<h3>Fees</h3>
						<h3 id="2" onClick={this.changeHandle} >{symbol[2]}</h3>
					</div>
					<div className="acc_content" style={contentStyle[2]}>
						{info.entranceFees.length == 0 && 
							<p>There is no entrance fees information available</p>
						}
						{
							info.entranceFees.map(function(e, i){
								return <div key={i} className="info_wrapper">
									<div className="cost_line"><p>${e.cost}</p><h4>&ensp;{e.title}</h4></div>
									<h5>{e.description}</h5>
								</div>
							})
						}
					</div>
				</div>
				<div className="acc_wrapper">
					<div className="acc_nav_wrapper">
						<h3>Operating Hours</h3>
						<h3 id="3" onClick={this.changeHandle} >{symbol[3]}</h3>
					</div>
					<div className="acc_content" style={contentStyle[3]}>
						{info.operatingHours.length == 0 && 
							<p>There is no operating hours information available</p>
						}
						{
							info.operatingHours.map(function(e, i){
								return <div key={i} className="info_wrapper">
									<h4>{e.name}</h4>
									<h5>{e.description}</h5>
									{
										utils.dayTransform(e.standardHours).map(function(ee, ii){
											return <div key={ii} className="same_line_box">
												<p>{ee.day[0].toUpperCase() + ee.day.substring(1)}</p>
												<p>{ee.hour}</p>
											</div>
										})
									}
									{
										e.exceptions.map(function(ee, ii){
											return <div key={ii} className="operating_hours_exceptions">
												<h4>{ee.name}&ensp;[{ee.startDate.substring(5)}~{ee.endDate.substring(5)}]</h4>
												{
													utils.dayTransform(ee.exceptionHours).map(function(eee, iii){
														return <div key={iii} className="same_line_box">
															<p>{eee.day[0].toUpperCase() + eee.day.substring(1)}</p>
															<p>{eee.hour}</p>
														</div>
													})
												}
											</div>
										})
									}
								</div>
							})
						}
					</div>
				</div>
			</div>
		)
	}
}
