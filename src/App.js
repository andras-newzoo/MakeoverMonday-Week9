import React, { Component } from 'react';
import './App.css';
import ChartHeader from './components/ChartHeader/ChartHeader'
import quarterly from './data/quarter.json'
import annual from './data/annual.json'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        width: undefined,
    }
  }

  componentDidMount = () => {
      window.addEventListener("resize", this.handleResize);
      setTimeout(() => this.handleResize(), 200);
  }

  handleResize = () => {
      this.setState({width: this.container && this.container.clientWidth})
  }

  render() {

    const { width } = this.state,
            height = 350

  console.log(quarterly)
  console.log(annual)


    return (
      <div className="App container" >
        <div className="ui doubling centered eight column grid">
          <div className="column card" ref={parent => (this.container = parent)}>
              <ChartHeader
                width = {width}
                height = {height * .45}
                />
          </div>
        </div>

      </div>
    );
  }
}

export default App;
