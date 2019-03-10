import React, { Component } from 'react';
import './App.css';
import {select } from 'd3-selection'
import ChartHeader from './components/ChartHeader/ChartHeader'
import ChartBody from './components/ChartBody/ChartBody'
import quarterly from './data/quarter.json'
import { List } from 'semantic-ui-react'
import annual from './data/annual.json'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        width: 10000,
    }
  }

  componentDidMount = () => {
      this.createTooltip()
      window.addEventListener("resize", this.handleResize);
      this.handleResize()
  }

  handleResize = () => {
      this.setState({width: this.container && this.container.clientWidth})
  }

  createTooltip(){
    select('body').append('div').attr('class', `tooltip`).attr('height', 0)
    select(`.tooltip`)
      .html(
          "<text class='description-one'></text><text class='bold value-one'></text></br>" +
          "<text class='description-two' ></text><text class='bold value-two'></text>"
      )
  }

  render() {

    const { width } = this.state,
            height = 350

    return (
      <div className="App container" >
        <div className="chart-container">
        <div className="ui doubling centered one column grid header-container">
            <div className="column">
              <h1>The Economic Value of the Bicycle Industry in the United Kingdom</h1>
              <p>The downturn in 2016 is volume driven as the value added per bike is 10.5% above historical averages.</p>
            </div>
        </div>
        <div className="ui doubling centered eight column grid">
          {annual.map((d,i) => {
            return <div className="column card" ref={parent => this.container = parent} >
                      <ChartHeader
                        key = {d.year}
                        data = {annual}
                        year = {d.year}
                        marginRatio = {0.05}
                        width = {width}
                        delay = {i * 500}
                        height = {height * .45}
                        />
                      <ChartBody
                        key = {d.grossValueAdded}
                        data = {quarterly}
                        year = {d.year}
                        marginRatio = {0.05}
                        width = {width}
                        delay = {i * 500}
                        height = {height * .55}
                        />
                  </div>
          })}
        </div>
          <div>
            <div className="ui doubling centered eight column grid">
              <List bulleted horizontal link className="credit">
                  <List.Item as='a' href="https://twitter.com/AndSzesztai"  target="_blank">Recreated with D3.js and React by: Andras Szesztai</List.Item>
                  <List.Item as='a' href="https://public.tableau.com/profile/andy.kriebel#!/vizhome/UKBicycleIndustryScorecard/MM-W9-2019"  target="_blank">Original design, calculations and text by: Andy Kriebel</List.Item>
                  <List.Item as='a'href="https://www.makeovermonday.co.uk/"  target="_blank">#MakeoverMonday 2019 W9</List.Item>
                  <List.Item as='a' href="https://data.world/makeovermonday/2019w11"  target="_blank">Data: SQW</List.Item>
              </List>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
