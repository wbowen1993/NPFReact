import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Features.css';
import ParksBox from './ParkBox';
import ColorScheme from 'color-scheme';
import utils from '../../utils/utils';
import SearchBox from '../Utils/SearchBox';


export default class Features extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      notif_msg: '',
      colors: null,
      qualified: []
    };
    this.renderRedirect = this.renderRedirect.bind(this);
    this.search = this.search.bind(this);
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

      const images = utils.importAll(require.context('../../../public/img/parks', false));

      let indexes = [];
      let parks_arr = [];
      for(let i = 0;i < tops;i++){
        let temp = 0;
        while(indexes.indexOf(temp) != -1){
          temp = Math.floor(res['table'].length * Math.random());
        }
        indexes.push(temp);
        parks_arr.push(res['table'][temp]);
      }

      // console.log(utils.match(res.table, iamges));
      
      this.setState({all_parks:res.table, parks:parks_arr, colors, mapping: utils.match(res["table"], images)});
    })
    .catch((err) => {
      this.setState({redirect: true, notif_msg: SERVER_ERR_MSG});
    });
  }

  renderParks = (e, index) => {
    return <ParksBox name={utils.npEliminate(e.name)} url={this.state.mapping[e.name]} index = {index + 1} colors = {this.state.colors[index]}/>
  }

  renderRedirect = () => {
    if(this.state.redirect)
      return <Redirect to={{pathname:'/notification', msg: this.state.notif_msg, state: 0}} />
  }

  search = (event) => {
    // console.log(e.target.value);
    if(event.target.value.length < 2) {this.setState({qualified:[]});return;}
    const all_parks = this.state.all_parks;
    let qualified = all_parks.filter(function(element){
      return element.name.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1;
    });
    qualified = qualified.map(function(e){
      return {name:e.name, states:e.states, code:e.parkCode};
    });
    // console.log(temp);
    this.setState({qualified});
  }

  render() {
    const parks = this.state.parks
    return (
      <div>
        {this.renderRedirect()}
        <div className="wrapper">
          <SearchBox searchChange={this.search} qualified={this.state.qualified}/>
          <div className="ranking_wrapper">{
              parks !== undefined &&
              parks.map(this.renderParks)
          }
          </div>
        </div>
      </div>
    );
  }
}


