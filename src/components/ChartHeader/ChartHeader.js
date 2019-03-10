import React, {Component} from 'react'
import {select, selectAll, event as currentEvent} from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { transition } from 'd3-transition'
import { max } from 'd3-array'
import { format } from 'd3-format'
import './ChartHeader.css'
import { appendText, appendArea, moveText } from '../functions'


class ChartHeader extends Component {

  componentDidMount(){

  }

  componentDidUpdate(prevProps){

    if (prevProps.width === 10000) {this.initVis()}
    else if (prevProps.width !== this.props.width) {this.updateDimensions()}

  }

  initVis(){

    const   { height, width, data, year, marginRatio, colors, delay } = this.props,
            { above, below } = colors,
            svg = select(this.node),
            filteredData = data.filter(d => d.year === +year),
            margin = width * marginRatio,
            chartWidth = width - margin*2,
            chartHeight = height - margin*2,
            t =1000

    svg.attr('height', height).attr('width', width)

    appendArea(svg, 'chart-area', margin, margin)
    appendArea(svg, 'year-text-area', margin, margin)
    appendArea(svg, 'ban-area', margin, margin)
    appendArea(svg, 'ban-sub-area', margin, margin)
    appendArea(svg, 'chart-text-area', margin, margin)
    appendArea(svg, 'bar-chart-area', margin, margin + chartHeight * .85)
    appendArea(svg, 'bar-chart-text-one', margin, margin)
    appendArea(svg, 'bar-chart-text-two', margin, margin)

    const chartArea = svg.select('.chart-area'),
          yearTextArea = svg.select('.year-text-area'),
          banArea = svg.select('.ban-area'),
          banSubArea = svg.select('.ban-sub-area'),
          chartText = svg.select('.chart-text-area'),
          barChartArea = svg.select('.bar-chart-area'),
          barTextOne = svg.select('.bar-chart-text-one'),
          barTextTwo = svg.select('.bar-chart-text-two')

    appendText(chartArea, filteredData, 'year-text', 'middle', chartWidth/2, chartHeight*.1, 'data', '', '','year')
    appendText(yearTextArea, filteredData, 'year-sub-text light', 'middle', chartWidth/2, chartHeight*.2, 'text', '', '','Value Added per Bike')
    appendText(banArea, filteredData, 'ban-text', 'middle', chartWidth/2, chartHeight*.5, 'data', '£', ".2f",'valueAddedPerBik')
    appendText(banSubArea, filteredData, 'ban-sub-text light', 'middle', chartWidth/2, chartHeight*.6, 'data', '', "+.1%",'%fromAvgPerBike')
    appendText(chartText, filteredData, 'chart-text light', 'start', 0, chartHeight*.8, 'text', '', '','Gross Value Added')

    this.xScale = scaleLinear().domain([0, max(data, d => d.grossValueAdded)*1.05]).range([0, chartWidth])

    const bar = barChartArea.selectAll('.bar-chart-rect').data(filteredData),
          line = barChartArea.selectAll('.bar-chart-line').data(filteredData),
          text = barChartArea.selectAll('.bar-chart-text').data(filteredData)

    console.log(filteredData)

    bar.enter()
        .append('rect')
        .attr('class', 'bar-chart-rect')
        .attr('x', 0)
        .attr('y', 3)
        .attr('width', 0)
        .attr('height', chartHeight * .2 - 6)
        .attr('fill', d  => d.grossValueAdded > d.yearlyAvgGross ? above : below)
          .merge(bar)
          .transition('bar-in')
          .delay(delay)
          .duration(t)
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

    text.enter()
        .append('text')
        .attr('class', 'bar-chart-text')
        .attr('x', chartWidth * .02)
        .attr('text-anchor', 'start')
        .attr('y', chartHeight * .125)
        .attr('fill',  d  => d.grossValueAdded > d.yearlyAvgGross ? '#fff' : '#333')
        .attr('opacity', 0)
        .text( d => format('.3s')(d.grossValueAdded) + ' | ' + format("+.1%")(d['%fromAvgGross']))
          .merge(text)
          .transition('text-in')
          .duration(t)
          .delay(delay)
          .attr('opacity', 1)

  }

  updateDimensions(){

    const   {height, width, marginRatio } = this.props,
            svg = select(this.node),
            margin = width * marginRatio,
            chartWidth = width - margin*2

    svg.attr('height', height).attr('width', width)

    moveText(svg, 'year-text', chartWidth/2)
    moveText(svg, 'year-sub-text', chartWidth/2)
    moveText(svg, 'ban-text', chartWidth/2)
    moveText(svg, 'ban-sub-text', chartWidth/2)

    this.xScale.range([0, chartWidth])

    svg.select('.bar-chart-rect').attr('width', d => this.xScale(d.grossValueAdded))
    svg.select('.bar-chart-line').attr('x1', d => this.xScale(d.yearlyAvgGross)).attr('x2', d => this.xScale(d.yearlyAvgGross))

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
     below: '#C1CACC'
   }
}

export default ChartHeader;
