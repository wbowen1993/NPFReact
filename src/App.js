import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';
import Parks from './component/Park/Park';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      notif_msg: ''
    };
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  componentDidMount(){
    this.getParks();
    // this.setState({parks:data["table"]});
  }

  getParks = () => {
    const SERVER_ERR_MSG = "Oops, it seems that we have some troubles for our server";
    fetch('/parks').then((res) => {
      return res.json();
    }).then((res) => {
      // console.log(res);
      this.setState({parks:res["table"]});
    })
    .catch((err) => {
      // console.log(err);
      this.setState({redirect: true, notif_msg: SERVER_ERR_MSG});
    });
  }

  renderParks = (e) => {
    return <Parks name={e.name} url={"http://" + e.image} />
  }

  renderRedirect = () => {
    if(this.state.redirect)
      return <Redirect to={{pathname:'/notification', msg: this.state.notif_msg, state: 0}} />
  }

  display = () => {
    alert("button");
  }
  render() {
    const parks = this.state.parks
    return (
      <div className="App">
        {this.renderRedirect()}
        <div className="wrapper">{
            parks !== undefined &&
            parks.map(this.renderParks)
          
        }
          </div>
      </div>
    );
  }
}

export default App;


