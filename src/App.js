import React, { Component } from 'react';
import './App.css';
import Parks from './component/Park/Park';

class App extends Component {
  state = {
  }

  componentDidMount(){
    this.getParks();
    // this.setState({parks:data["table"]});
  }

  getParks = () => {
    fetch('http://localhost:4000/').then((res) => {
      return res.json();
    }).then((res) => {
      // console.log(res);
      this.setState({parks:res["table"]});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  renderParks = (e) => {
    console.log(e)
    return <Parks name={e.name} url={"http://" + e.image} />
  }

  display = () => {
    alert("button");
  }
  render() {
    const parks = this.state.parks
    return (
      <div className="App">
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


