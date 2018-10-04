import React,{ Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import App from './App';
import Header from './component/Header/Header';
import Home from './component/Home/Home';

class Routes extends Component {
	render(){
		return (
		<BrowserRouter>
			<div>
				<Header />
				<Switch>
					<Route path="/" component={Home} exact />
					<Route path="/parks" component={App} />
				</Switch>
			</div>
		</BrowserRouter>
		);
	}
};

export default Routes;