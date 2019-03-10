import React, {Component} from 'react'
import {select, selectAll, event as currentEvent} from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { transition } from 'd3-transition'
import { max } from 'd3-array'
import './ChartHeader.css'
import { appendText, appendArea, moveText } from './functionsChartHeader'


class ChartHeader extends Component {

  componentDidMount(){

  }

  componentDidUpdate(prevProps){

    if (prevProps.width === 10000) {this.initVis()}
    else if (prevProps.width !== this.props.width) {this.updateDimensions()}

  }

  initVis(){

    const   { height, width, data, year, marginRatio, colors } = this.props,
            { above, below } = colors,
            svg = select(this.node),
            filteredData = data.filter(d => d.year === +year),
            margin = width * marginRatio,
            chartWidth = width - margin*2,
            chartHeight = height - margin*2

    console.log(filteredData)
    svg.attr('height', height).attr('width', width)

    appendArea(svg, 'chart-area', margin, margin)
    appendArea(svg, 'year-text-area', margin, margin)
    appendArea(svg, 'ban-area', margin, margin)
    appendArea(svg, 'ban-sub-area', margin, margin)
    appendArea(svg, 'chart-text-area', margin, margin)
    appendArea(svg, 'bar-chart-area', margin, margin + chartHeight * .85)
    appendArea(svg, 'bar-chart-text-one', margin, margin)
    appendArea(svg, 'bar-chart-text-two', margin, margin)

    const chartArea = select('.chart-area'),
          yearTextArea = select('.year-text-area'),
          banArea = select('.ban-area'),
          banSubArea = select('.ban-sub-area'),
          chartText = select('.chart-text-area'),
          barChartArea = select('.bar-chart-area'),
          barTextOne = select('.bar-chart-text-one'),
          barTextTwo = select('.bar-chart-text-two')

    appendText(chartArea, filteredData, 'year-text', 'middle', chartWidth/2, chartHeight*.1, 'data', '', '','year')
    appendText(yearTextArea, filteredData, 'year-sub-text', 'middle', chartWidth/2, chartHeight*.2, 'text', '', '','Value Added per Bike')
    appendText(banArea, filteredData, 'ban-text', 'middle', chartWidth/2, chartHeight*.5, 'data', '£', ".2f",'valueAddedPerBik')
    appendText(banSubArea, filteredData, 'ban-sub-text', 'middle', chartWidth/2, chartHeight*.6, 'data', '', ".1%",'%fromAvgPerBike')
    appendText(chartText, filteredData, 'chart-text', 'start', 0, chartHeight*.8, 'text', '', '','Gross Value Added')
    appendText(barTextOne, filteredData, 'bar-text-one', 'start', chartWidth * .01, chartHeight * .975, 'data', '£', '.3s','grossValueAdded')
    appendText(barTextTwo, filteredData, 'bar-text-two', 'start', chartWidth * .24, chartHeight * .97, 'data', ' | ', '+.1%','%fromAvgGross')

    this.xScale = scaleLinear().domain([0, max(data, d => d.grossValueAdded)*1.05]).range([0, chartWidth])

    const bar = barChartArea.selectAll('.bar-chart-rect').data(filteredData),
          line = barChartArea.selectAll('.bar-chart-line').data(filteredData)

    bar.enter()
        .append('rect')
        .attr('class', 'bar-chart-rect')
        .attr('x', 0)
        .attr('y', 3)
        .attr('width', 0)
        .attr('height', chartHeight * .2 - 6)
        .attr('fill', d => d.grossValueAdded > d.yearlyAvgGross ? above : below)
          .merge(bar)
          .transition('bar-in')
          .duration(1000)
          .attr('width', d => this.xScale(d.grossValueAdded))

    line.enter()
        .append('line')
        .attr('class', 'bar-chart-line')
        .attr('x1', d => this.xScale(d.yearlyAvgGross))
        .attr('x2', d => this.xScale(d.yearlyAvgGross))
        .attr('y1', 0)
        .attr('y1', chartHeight * .2)
        .style('stroke', '#333')
        .style('stroke-width', 2)

    select('.bar-text-one').data(filteredData).attr('fill', d => d.grossValueAdded > d.yearlyAvgGross ? '#fff' : '#333')
    select('.bar-text-two').data(filteredData).attr('fill', d => d.grossValueAdded > d.yearlyAvgGross ? '#fff' : '#333')

  }

  updateDimensions(){

    const   {height, width, marginRatio } = this.props,
            svg = select(this.node),
            margin = width * marginRatio,
            chartWidth = width - margin*2

    svg.attr('height', height).attr('width', width)

    moveText('year-text', chartWidth/2)
    moveText('year-sub-text', chartWidth/2)
    moveText('ban-text', chartWidth/2)
    moveText('ban-sub-text', chartWidth/2)
    moveText('chart-text', 0)
    moveText('bar-text-one', chartWidth * .01)
    moveText('bar-text-two', chartWidth * .24)


    this.xScale.range([0, chartWidth])

    select('.bar-chart-rect').attr('width', d => this.xScale(d.grossValueAdded))
    select('.bar-chart-line').attr('x1', d => this.xScale(d.yearlyAvgGross)).attr('x2', d => this.xScale(d.yearlyAvgGross))


  }

  render(){
    return(
    <svg ref={node => this.node = node}/>
    )
  }
}

ChartHeader.defaultProps = {
   colors: {
     above: '#3F7B7F',
     below: '#ACBDBF'
   }
}

export default ChartHeader;
