import React, {Component} from 'react'
import {select, selectAll, event as currentEvent} from 'd3-selection'
import './ChartHeader.css'


class ChartHeader extends Component {

  componentDidMount(){
    this.initVis()
  }

  componentDidUpdate(prevProps){

    if(prevProps.width !== this.props.width) {this.updateDimensions()}

  }

  initVis(data){

    const   {height, width } = this.props,
            svg = select(this.node)

    svg.attr('height', height).attr('width', width)


  }

  updateDimensions(){

    const   {height, width } = this.props,
            svg = select(this.node)

    svg.attr('height', height).attr('width', width)

  }

  render(){
    return(
    <svg ref={node => this.node = node}/>
    )
  }
}

export default ChartHeader;
