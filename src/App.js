import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';
import Parks from './component/Park/Park';
import ColorScheme from 'color-scheme';
import utils from './utils/utils';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      notif_msg: '',
      colors: null
    };
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  componentDidMount(){
    const tops = 5;
    this.getParks(tops);
    // this.setState({parks:data["table"]});
  }

  getParks = (tops) => {
    const SERVER_ERR_MSG = "Oops, it seems that we have some troubles for our server";
    fetch('/parks').then((res) => {
      return res.json();
    }).then((res) => {
      //[Usage]: http://c0bra.github.io/color-scheme-js/
      var scheme = new ColorScheme;
      scheme.from_hue(200)         // Start the scheme 
            .scheme('analogic')    
            .variation('pastel')
            .web_safe(false);

      var colors = scheme.colors().slice(0, tops);

      const images = utils.importAll(require.context('../public/img/parks', false));
      
      this.setState({parks:res["table"].slice(0, tops), colors, mapping: utils.match(res["table"], images)});
    })
    .catch((err) => {
      // console.log(err);
      this.setState({redirect: true, notif_msg: SERVER_ERR_MSG});
    });
  }

  renderParks = (e, index) => {
    return <Parks name={utils.npEliminate(e.name)} url={this.state.mapping[e.name]} index = {index + 1} colors = {this.state.colors[index]}/>
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


