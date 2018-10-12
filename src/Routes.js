import React,{ Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import App from './App';
import Header from './component/Header/Header';
import Home from './component/Home/Home';
import User from './component/User/User';
import Logout from './component/User/Logout';
import Notification from "./component/Control/Notification";
import Profile from "./component/User/Profile";

class Routes extends Component {

	render(){
		return (
		<BrowserRouter>
			<div>
				<Header />
				<Switch>
					<Route path="/" component={Home} exact />
					<Route path="/parks" component={App} exact />
					<Route path="/login" component={User} exact />
					<Route path="/logout" component={Logout} exact />
					<Route path="/notification" component={Notification} exact />
					<Route path="/profile" component={Profile} exact />
				</Switch>
			</div>
		</BrowserRouter>
		);
	}
};

export default Routes;