import React,{ Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Features from './component/Control/Features';
import Header from './component/Header/Header';
import Home from './component/Home/Home';
import User from './component/User/User';
import Logout from './component/User/Logout';
import Notification from "./component/Control/Notification";
import Profile from "./component/User/Profile";
import Park from "./component/Park/Park";

class Routes extends Component {

	render(){
		return (
		<BrowserRouter>
			<div>
				<Header />
				<Switch>
					<Route path="/" component={Home} exact />
					<Route path="/features" component={Features} exact />
					<Route path="/login" component={User} exact />
					<Route path="/logout" component={Logout} exact />
					<Route path="/notification" component={Notification} exact />
					<Route path="/profile" component={Profile} exact />
					<Route path="/park/:parkCode" component={Park} />
					<Route path="/reset" component={User} />
				</Switch>
			</div>
		</BrowserRouter>
		);
	}
};

export default Routes;