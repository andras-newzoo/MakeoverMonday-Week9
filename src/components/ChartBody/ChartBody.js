import React, {Component} from 'react'
import {select, selectAll, event as currentEvent} from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { transition } from 'd3-transition'
import { max, min } from 'd3-array'
import { axisBottom } from 'd3-axis'
import { format } from 'd3-format'
import './ChartBody.css'
import { appendText, appendArea, moveText } from '../functions'


class ChartBody extends Component {

  componentDidMount(){

  }

  componentDidUpdate(prevProps){

    if (prevProps.width === 10000) {this.initVis()}
    else if (prevProps.width !== this.props.width) {this.updateDimensions()}

  }


  initVis(){


    const   { height, width, data, year, marginRatio, colors, delay} = this.props,
            { above, below } = colors,
            svg = select(this.node),
            filteredData = data.filter(d => +d.quarter.substring(0,4) === year),
            margin = width * marginRatio,
            chartWidth = width - margin*2,
            chartHeight = height - margin*2,
            t = 1000

    svg.attr('height', height).attr('width', width)

    appendArea(svg, 'chart-area ', margin, margin)
    appendArea(svg, 'x-axis', margin, margin + chartHeight *.97)

    const chartArea = svg.select('.chart-area'),
          bars = chartArea.selectAll('.bar-chart-rects').data(filteredData),
          text = chartArea.selectAll('.bar-chart-label').data(filteredData),
          line = chartArea.selectAll('.bar-chart-line').data(filteredData),
          minValue = min(filteredData, d => d.grossValueAdded),
          maxValue = max(filteredData, d => d.grossValueAdded),
          tooltip = select('.tooltip')

    appendText(chartArea, ['text'], '.bar-title light', 'start', 0, chartHeight *.05, 'text', '', '','Gross Value Added vs. Qtrly Avg')

    this.yScale = scaleLinear().range([chartHeight * .97, chartHeight *.1]).domain([0, max(data, d => d.grossValueAdded)*1.05])
    this.xScale = scaleBand().range([0, chartWidth]).domain(filteredData.map(d => d.quarter.substring(5))).paddingOuter(.1).paddingInner(.2)
    this.xAxis = svg.select('.x-axis')
    this.xAxisCall = axisBottom(this.xScale).tickSize(1)

    this.xAxis.transition().duration(1000).call(this.xAxisCall)
    this.xAxis.select('.domain').remove()
    this.xAxis.selectAll('.tick line').remove()

    bars.enter()
        .append('rect')
        .attr('class', 'bar-chart-rects')
        .attr('x', d => this.xScale(d.quarter.substring(5)))
        .attr('height', 0)
        .attr('y', chartHeight * .97)
        .attr('width', this.xScale.bandwidth())
        .attr('fill', d  => d.grossValueAdded > d.quarterlyAVG ? above : below)
        .on('mouseover', d => {
                  tooltip.style('opacity', .9).style('height', 'auto')
                  tooltip.select('.value-one').text(d.quarter)
                  tooltip.select('.description-two').text('Gross Value Added: ')
                  tooltip.select('.value-two').text('£' + format('.3s')(d.grossValueAdded))
                })
        .on('mousemove', d => tooltip.style("left", (currentEvent.pageX + 10) + "px").style("top", (currentEvent.pageY + 10) + "px"))
        .on('mouseout', d => {tooltip.style("opacity", 0).style('height', 0)
                              tooltip.selectAll('text').text('')})
            .merge(bars)
            .transition('bars-in')
            .duration(t)
            .delay(delay)
            .attr('height', d => this.yScale(0) - this.yScale(d.grossValueAdded))
            .attr('y', d => this.yScale(d.grossValueAdded))

    text.enter()
        .append('text')
        .attr('class', 'bar-chart-label')
        .attr('x', d => this.xScale(d.quarter.substring(5)) + this.xScale.bandwidth()/2)
        .attr('text-anchor', 'middle')
        .attr('y', this.yScale(0))
        .attr('fill', '#333')
        .attr('opacity', 0)
        .attr('font-size', d => d.grossValueAdded === minValue || d.grossValueAdded === maxValue? '10px' : 0)
        .text( d => '£' + format('.3s')(d.grossValueAdded))
          .merge(text)
          .transition('bars-in')
          .duration(t)
          .delay(delay)
          .attr('opacity', 1)
          .attr('y', d => this.yScale(d.grossValueAdded) + -3)

    line.enter()
        .append('line')
        .attr('class', 'bar-chart-line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', d => this.yScale(d.quarterlyAVG))
        .attr('y2', d => this.yScale(d.quarterlyAVG))
        .style('stroke', '#333')
        .style('stroke-width', 2)
        .attr('opacity', 0)
        .on('mouseover', d => {
                  tooltip.style('opacity', .9).style('height', 'auto')
                  tooltip.select('.description-one').text('Quaterly Average: ')
                  tooltip.select('.value-one').text('£' + format('.3s')(d.quarterlyAVG))
                })
        .on('mousemove', d => tooltip.style("left", (currentEvent.pageX + 10) + "px").style("top", (currentEvent.pageY + 10) + "px"))
        .on('mouseout', d => {tooltip.style("opacity", 0).style('height', 0)
                              tooltip.selectAll('text').text('')})
            .merge(line)
            .transition('line-in')
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

    this.xScale.range([0, chartWidth])

    this.xAxis.call(this.xAxisCall)
    this.xAxis.select('.domain').remove()
    this.xAxis.selectAll('.tick line').remove()

    svg.selectAll('.bar-chart-rects')
        .attr('x', d => this.xScale(d.quarter.substring(5)))
        .attr('width', this.xScale.bandwidth())

    svg.selectAll('.bar-chart-label')
        .attr('x', d => this.xScale(d.quarter.substring(5)) + this.xScale.bandwidth()/2)



  }

  render(){
    return(
    <svg ref={node => this.node = node}/>
    )
  }
}

ChartBody.defaultProps = {
   colors: {
     above: '#3F7B7F',
     below: '#C1CACC'
   }
}

export default ChartBody;
